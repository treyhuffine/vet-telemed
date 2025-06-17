import { openai } from '@ai-sdk/openai';
import * as Sentry from '@sentry/nextjs';
import {
  type Message,
  type UserContent,
  createDataStreamResponse,
  generateText,
  streamText,
} from 'ai';
import { DEFAULT_CHAT_MODEL, DEFAULT_TITLE_MODEL } from '@/constants/ai';
import { getResponseAnnotation, getSubmissionAnnotation } from '@/constants/ai';
import { MediaProviders } from '@/constants/media';
import { PostRequestPayload } from '@/constants/payloads/chat';
import { UpsertInitializeChatThreadMutation } from '@/types/generated/server';
import { signImageView } from '@/services/server/cloudflare/s3';
import { insertChatMessageAi } from '@/services/server/graphql/mutations/insertChatMessageAi';
import { insertChatMessageUser } from '@/services/server/graphql/mutations/insertChatMessageUser';
import { updateChatTitle } from '@/services/server/graphql/mutations/updateChatTitle';
import { upsertInitializeChatThread } from '@/services/server/graphql/mutations/upsertInitializeChatThread';
import { response400BadRequestError, response500ServerError } from '@/lib/server/rsc/http';
import {
  RequestWithViewer,
  withViewerRequired,
} from '@/lib/server/rsc/middleware/withViewerRequired';
import { getTokenCount } from '@/lib/shared/getTokenCount';

export const maxDuration = 90;
export const runtime = 'edge';

const APP_USERS_PATH = process.env.FILE_STORAGE_PATH_PREFIX!;

const TEMPERATURE = 0.9;
const TOP_P = undefined;
const FREQUENCY_PENALTY = 0.2;
const PRESENCE_PENALTY = 0.2;
const MAX_TOKENS = 10000;

const CHAT_TITLE_SYSTEM_PROMPT = `You are a helpful assistant with a single purpose. You are to create simple, human-readables titles for conversations. The title should be short, accurate (3 to 8 words, ideally 4 to 6), and use plain language. The focus should be on the users question, with some slight modification based on the response. You should use at most 6 words. Respond only with the title in plain text (NO MARKDOWN EVER) and nothing else. Don't use quotation marks or put the word "title" in the response. Avoid excessive punctuation and only use punctuation if it's necessary.`;

const getToday = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const SYSTEM_PROMPT_V0 = `You are Sourdo, an expert sourdough bread baker and crumb analyst, and, genereally, an insightful/helpful assistant.

Additional context:
- Today's date is ${getToday()} (yyyy-mm-dd). Anything before this date is in the past. Anything after this date is in the future.`;

const SYSTEM_PROMPT = SYSTEM_PROMPT_V0;

type BreadEntry = NonNullable<
  UpsertInitializeChatThreadMutation['insertChatThreadsOne']
>['breadEntry'];

const generateSystemPrompt = async ({ breadEntry }: { breadEntry?: BreadEntry }) => {
  if (breadEntry) {
    return `${SYSTEM_PROMPT}
    
Here is a specific crumb reading or image that has already been analyzed by the AI in a previous one-shot experience, which can be used if needed, but you will also be provided the images so you can analayze yourself as well:
${breadEntry}`;
  }

  return SYSTEM_PROMPT;
};

export const POST = withViewerRequired(async (request: RequestWithViewer) => {
  try {
    const payload: PostRequestPayload = await request.json();
    const { messages, threadId, files, crumbId } = payload;
    const auth = request.auth;
    const user = auth?.data?.user;
    const userId = user?.id;

    if (!threadId) {
      return response400BadRequestError('Thread ID is required');
    }

    const isFirstMessage = messages.length === 1;
    let existingTitle = '';
    let hasTitle = false;

    const thread = await upsertInitializeChatThread({
      id: threadId,
      createdByUserId: userId,
      breadEntryId: crumbId,
    });
    existingTitle = thread?.title || '';
    hasTitle = !!existingTitle;
    const breadEntry = thread?.breadEntry;
    const breadEntryImages = breadEntry?.images || [];

    const userMessage = messages[messages.length - 1];
    const filesForInsert =
      files?.map((file) => ({
        chatMessageId: userMessage.id,
        fileName: file.fileName,
        mimeType: file.mimeType,
        filePath: file.filePath,
        fileStorageProvider: MediaProviders.Cloudflare,
        originalFileName: file.originalName,
        size: file.size,
      })) || [];

    if (isFirstMessage && breadEntryImages && breadEntryImages.length > 0) {
      breadEntryImages.forEach((image) => {
        filesForInsert.push({
          chatMessageId: userMessage.id,
          fileName: image.imageName,
          mimeType: image.mimeType,
          filePath: image.imagePath,
          fileStorageProvider: MediaProviders.Cloudflare,
          originalFileName: image.originalImageName,
          size: image.size,
        });
      });
    }

    return createDataStreamResponse({
      onError: (error: unknown) => {
        Sentry.captureException(error);
        console.error('Error in data stream response', error);
        return (error as Error)?.message || 'An error occurred';
      },
      execute: async (dataStream) => {
        // Start the main chat response
        const [systemPrompt, userMessageInsertResponse] = await Promise.all([
          generateSystemPrompt({ breadEntry }),
          userId && userMessage
            ? insertChatMessageUser({
                id: userMessage.id,
                userId,
                threadId,
                role: userMessage.role,
                content: userMessage.content,
                promptTokens: getTokenCount({ text: userMessage.content }),
                files: filesForInsert,
              })
            : Promise.resolve({ id: null }),
        ]);

        const userMessageId = userMessageInsertResponse?.id;

        if (userMessageId) {
          dataStream.writeMessageAnnotation(getSubmissionAnnotation(userMessageId));
        }

        const attachmentSigningPromises = [];
        const attachmentMap = new Map();

        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (!message.experimental_attachments || message.experimental_attachments.length === 0) {
            continue;
          }

          for (let j = 0; j < message.experimental_attachments.length; j++) {
            const attachment = message.experimental_attachments[j];
            const key = `${i}-${j}`; // Create a key to identify this attachment's position

            attachmentSigningPromises.push(
              signImageView({
                path: attachment.url,
                fileName: '',
                expirationSeconds: '3600',
              }).then(({ signedUrl }) => {
                attachmentMap.set(key, signedUrl);
                return null;
              }),
            );
          }
        }

        await Promise.all(attachmentSigningPromises);

        const previousMessages = messages.map((message, i) => {
          if (!message.experimental_attachments || message.experimental_attachments.length === 0) {
            return message;
          }

          const updatedAttachments = message.experimental_attachments.map((attachment, j) => {
            const key = `${i}-${j}`;
            const signedUrl = attachmentMap.get(key);

            return signedUrl
              ? {
                  ...attachment,
                  url: signedUrl,
                }
              : null;
          });

          return {
            ...message,
            experimental_attachments: updatedAttachments.filter(Boolean),
          };
        });

        const contentWithFiles: UserContent = [
          { type: 'text', text: messages[messages.length - 1].content },
        ];

        let messagesForAi: any[] = [...messages];

        if (files && files.length > 0) {
          const viewableUrlPromises = files.map(async (file) => {
            return signImageView({
              path: APP_USERS_PATH,
              fileName: file.fileName,
              expirationSeconds: '3600',
            }).then(({ signedUrl }) => {
              return {
                format: file.mimeType.startsWith('image/') ? 'image' : 'file',
                image: signedUrl,
                file: signedUrl,
                mimeType: file.mimeType,
                name: file.fileName,
              };
            });
          });
          const viewableUrls = await Promise.all(viewableUrlPromises);
          viewableUrls.forEach((file) => {
            if (file.format === 'image') {
              contentWithFiles.push({ type: 'image', image: file.image, mimeType: file.mimeType });
            } else {
              contentWithFiles.push({
                type: 'file',
                data: file.file,
                mimeType: file.mimeType,
              });
            }
          });
        }

        if (isFirstMessage && breadEntryImages && breadEntryImages.length > 0) {
          const breadEntryImagePromises = breadEntryImages.map(async (imageObj) => {
            return signImageView({
              path: imageObj.imagePath,
              fileName: '', // NOTE: Included in the path
              expirationSeconds: '3600',
            }).then(({ signedUrl }) => {
              return {
                format: imageObj.mimeType.startsWith('image/') ? 'image' : 'file',
                image: signedUrl,
                file: signedUrl,
                mimeType: imageObj.mimeType,
                name: imageObj.imageName,
              };
            });
          });

          const breadEntryImageUrls = await Promise.all(breadEntryImagePromises);
          breadEntryImageUrls.forEach((file) => {
            contentWithFiles.push({ type: 'image', image: file.image, mimeType: file.mimeType });
          });
        }

        messagesForAi = [
          ...previousMessages.slice(0, -1),
          {
            role: 'user',
            content: contentWithFiles,
          },
        ];

        console.log('++++++ messagesForAi', messagesForAi);

        const model = DEFAULT_CHAT_MODEL;
        const configuration = {
          temperature: TEMPERATURE,
          topP: TOP_P,
          frequencyPenalty: FREQUENCY_PENALTY,
          presencePenalty: PRESENCE_PENALTY,
        };

        const result = streamText({
          system: systemPrompt,
          model: openai(model),
          ...configuration,
          messages: messagesForAi,
          maxTokens: MAX_TOKENS,
          onFinish: async (completion) => {
            const insertNewMessage = async () => {
              if (!userId) {
                return;
              }

              try {
                const response = await insertChatMessageAi({
                  threadId,
                  role: 'assistant',
                  content: completion.text,
                  model: model,
                  promptTokens: completion.usage?.promptTokens,
                  completionTokens: completion.usage?.completionTokens,
                  totalTokens: completion.usage?.totalTokens,
                  temperature: TEMPERATURE || null,
                  topP: TOP_P || null,
                  frequencyPenalty: FREQUENCY_PENALTY,
                  presencePenalty: PRESENCE_PENALTY,
                  createdByUserId: userId,
                  /**
                   * @todo Add files to the insert as children
                   */
                });
                const responseMessageId = response?.id;
                if (responseMessageId) {
                  dataStream.writeMessageAnnotation(getResponseAnnotation(responseMessageId));
                }
              } catch (error) {
                Sentry.captureException(error);
                console.error('Error in data stream response', error);
                return (error as Error)?.message || 'An error occurred';
              }
            };

            const getChatTitle = async () => {
              try {
                if (isFirstMessage || !hasTitle) {
                  const newMessages: Message[] = [
                    ...messages.map((message) => ({
                      role: message.role,
                      content: message.content,
                      id: message.id,
                    })),
                    { role: 'assistant' as const, content: completion.text, id: '1' },
                  ].slice(0, 2);

                  const titleResult = await generateText({
                    model: openai(DEFAULT_TITLE_MODEL),
                    system: CHAT_TITLE_SYSTEM_PROMPT,
                    messages: newMessages,
                    maxTokens: 50,
                    temperature: 0.8,
                  });

                  const title = titleResult.text;

                  if (!hasTitle && userId) {
                    await updateChatTitle({
                      id: threadId,
                      title,
                    });
                  }

                  dataStream.writeData({
                    type: 'title',
                    title: existingTitle || title,
                  });
                }
              } catch (error) {
                Sentry.captureException(error);
                console.error('Error in getChatTitle', error);
              }
            };

            await Promise.all([insertNewMessage(), getChatTitle()]).catch((e) => {
              Sentry.captureException(e);
              console.error('Error in chat Promise.all', e);
            });

            return;
          },
        });

        // console.log('++++++ result', result);

        result.mergeIntoDataStream(dataStream);
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in chat route', error);
    return response500ServerError('Internal Server Error');
  }
});

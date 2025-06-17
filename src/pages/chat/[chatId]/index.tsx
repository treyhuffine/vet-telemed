import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowUp,
  Camera,
  Check,
  ChevronLeft,
  Copy,
  LoaderPinwheel,
  Paperclip,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ROOT_PAGE_URL } from '@/constants/pages';
import { KeyCodes } from '@/lib/client/dom';
import { getIsNativePlatform } from '@/lib/client/mobile';
import { getInitials } from '@/lib/shared/getInitials';
import { cn } from '@/lib/utils';
import { useCurrentChat } from '@/context/Chat';
import { type MessageAttachment, useAttachmentView } from '@/hooks/useAttachmentView';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useMobile';
import { useModal } from '@/hooks/useModal';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import ChatHistorySheet from '@/components/ChatHistorySheet';
import CrumbDataDisplay from '@/components/CrumbDataDisplay';
import FilePreview from '@/components/FilePreview';
import MessageAttachments from '@/components/MessageAttachments';
import { TopNavigation } from '@/components/Navigation';
import { NewCrumbButton } from '@/components/NewCrumbButton';
import { Settings } from '@/components/Settings/Settings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/utils/Page';

const classNameMaxWidth = 'max-w-[100vw] md:max-w-[32rem] lg:max-w-[40rem] xl:max-w-[48rem]';
const classNamePaddingX = 'px-4 sm:px-6 md:px-8';

const CopyButton = ({ content, role }: { content: string; role: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // Clean markdown formatting before copying
    const cleanedContent = content
      // Remove headers (# Title)
      .replace(/^#+\s+/gm, '')
      // Remove bold and italic formatting (**text** or *text* or __text__ or _text_)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove code block markers (```language and ```)
      .replace(/```(?:.*\n)?|```/g, '')
      // Remove inline code (` `)
      .replace(/`([^`]+)`/g, '$1')
      // Remove blockquotes (> text)
      .replace(/^>\s+/gm, '')
      // Convert links ([text](url)) to just the text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Keep lists and other formatting intact

    await navigator.clipboard.writeText(cleanedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={role === 'user' ? 'secondary' : 'ghost'}
      size="icon"
      className="h-7 w-7 [&_svg]:size-3.5"
      onClick={copyToClipboard}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
};

export default function ChatPage() {
  const router = useRouter();
  const { chatId: threadId } = router.query;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    title,
    thread,
    isLoadingThread,
    errorMessage,
    handleUploadClick,
    files,
    setFiles,
    isUploading,
    uploadProgress,
    uploadedFiles,
    handleRemoveUploadedFile,
  } = useCurrentChat();
  const { viewer } = useAuth();
  const isMobile = useIsMobile();
  const {
    isOpen: isSettingsOpen,
    openModal: openSettingsModal,
    setIsOpen: setSettingsOpen,
  } = useModal();
  const [isChatHistoryOpen, setChatHistoryOpen] = useState(false);

  // Collect all attachments from messages
  const allAttachments = messages.reduce<MessageAttachment[]>((acc, message) => {
    if (message.experimental_attachments && message.experimental_attachments.length > 0) {
      acc.push(...(message.experimental_attachments as MessageAttachment[]));
    }
    return acc;
  }, []);

  // Set up per-chat attachment handling with threadId and all attachments
  const attachmentViewState = useAttachmentView({
    threadId: typeof threadId === 'string' ? threadId : undefined,
    messageAttachments: allAttachments,
  });

  // Auto-focus the textarea when the page loads, but only on desktop
  useEffect(() => {
    // Only autofocus if not mobile width and not a native platform
    // Also check that isMobile is not undefined (initial state)
    const isExplicitlyNotMobile = isMobile === false;
    const isNative = getIsNativePlatform();
    if (textareaRef.current && !isLoadingThread && threadId && isExplicitlyNotMobile && !isNative) {
      textareaRef.current.focus();
    }
  }, [isLoadingThread, threadId, isMobile]);

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    await handleSubmit(e, {});

    // Wait for the message to be appended to the DOM
    requestAnimationFrame(() => {
      if (lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key, shiftKey } = e;
    if (key === KeyCodes.Enter && !shiftKey && !isLoading) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  // Find the last user message index
  const lastUserMessageIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
  const lastMessageIndex = messages.length - 1;

  // Check if we should show placeholder - when last message is from user and we're loading
  const shouldShowPlaceholder = isLoading && messages[messages.length - 1]?.role === 'user';

  // console.log('++++++ thread', thread);
  // console.log('++++++ messages', messages);
  // console.log('threadId', threadId);

  if (!threadId) {
    return null;
  }

  const classNameMinHeight = cn(
    !!files?.length
      ? 'min-h-[calc(100dvh-380px-var(--sat,0px)*2)]'
      : 'min-h-[calc(100dvh-304px-var(--sat,0px)*2)]',
  );

  return (
    <Page title={title} isNoIndex>
      <div className="flex min-h-svh w-full">
        <main className="relative flex min-h-svh flex-1 flex-col">
          <div className="flex h-full flex-col">
            <div className="flex h-full flex-col pb-12">
              <header className="h-header-safe sticky top-0 z-20 mb-4 flex w-full max-w-[100vw] shrink-0 items-center justify-between gap-2 overflow-x-hidden border-b bg-background/70 pt-safe-top backdrop-blur-md">
                {/* Mobile header bar */}
                <div className="flex h-12 w-full items-center justify-between gap-2 px-2 lg:hidden">
                  <Button className="h-8 w-8 shrink-0" size="icon" variant="ghost" asChild>
                    <Link href={ROOT_PAGE_URL}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    <NewCrumbButton
                      size="icon"
                      className="h-8 w-8"
                      variant="default"
                      aria-label="Crumb Reader"
                    >
                      <Camera className="h-4 w-4" />
                    </NewCrumbButton>
                  </div>
                </div>
                {/* Desktop nav */}
                <div className="hidden w-full lg:block">
                  <TopNavigation
                    openSettingsModal={openSettingsModal}
                    setChatHistoryOpen={setChatHistoryOpen}
                  />
                </div>
                {/* <div className={cn('flex items-center gap-2', classNamePaddingX)}>
                    <Button variant="outline-invert" className="rounded-full" size="sm">
                      <Share className="!size-3" size={12} />
                      <span className="">Share</span>
                    </Button>
                  </div> */}
              </header>
              <div className="flex w-full flex-col pb-safe-bottom">
                <div className={classNamePaddingX}>
                  <div className={cn('mx-auto w-full', classNameMaxWidth)}>
                    <CrumbDataDisplay thread={thread} />
                  </div>
                </div>

                {isLoadingThread
                  ? null
                  : messages.map((m, i) => {
                      const isUser = m.role === 'user';
                      const isLastUserMessage = i === messages.length - 1 - lastUserMessageIndex;
                      const isLastMessage = i === lastMessageIndex;

                      return (
                        <article
                          key={m.id}
                          ref={isLastUserMessage ? lastUserMessageRef : undefined}
                          className={cn(
                            'w-full max-w-[100vw] overflow-visible text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-4px] md:max-w-[unset]',
                            'group',
                            isUser && i !== 0 && 'pt-2',
                            !isUser && isLastMessage && classNameMinHeight,
                          )}
                        >
                          <h5 className="sr-only">{isUser && 'You said:'}</h5>
                          <div
                            className={cn(
                              'm-auto',
                              classNamePaddingX,
                              'overflow-visible py-3 text-base',
                            )}
                          >
                            <div
                              className={cn(
                                'mx-auto flex flex-1 gap-4 text-base',
                                classNameMaxWidth,
                              )}
                            >
                              {isUser && (
                                <div className="relative flex shrink-0 flex-col items-end">
                                  <div>
                                    <Avatar className="h-8 w-8 rounded-lg">
                                      <AvatarImage alt={viewer?.name} />
                                      <AvatarFallback>
                                        {getInitials({ name: viewer?.name }) || (
                                          <User className="h-4 w-4" />
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                              )}
                              <div className="relative flex w-full min-w-0 flex-col">
                                <div className="flex-col gap-1 md:gap-3">
                                  <div className="relative flex max-w-full flex-grow flex-col">
                                    {isUser ? (
                                      <div className="w-auto max-w-fit rounded-3xl bg-primary/25 px-5 py-3 text-foreground">
                                        <div className="whitespace-pre-wrap break-words">
                                          {m.content}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-message flex min-h-8 w-full flex-col items-end gap-2 whitespace-normal break-words text-start [.text-message+&]:mt-5">
                                        <div className="flex w-full flex-col text-foreground first:pt-[3px] empty:hidden">
                                          <Markdown
                                            className={cn(
                                              'prose w-full max-w-[unset] break-words dark:prose-invert',
                                              '[&>*:first-child]:mt-0 [&>*]:my-3 [&_ol]:my-5 [&_p+p]:mt-3 [&_ul]:my-5',
                                              '[&>*:last-child]:mb-0',
                                              '[&_pre]:relative',
                                              '[&_pre]:overflow-x-auto',
                                              '[&_pre]:p-4',
                                              '[&_pre]:rounded-lg',
                                              '[&_code]:inline-block',
                                              '[&_code]:whitespace-pre',
                                              '[&_h1]:text-4xl [&_h1]:font-bold',
                                              '[&_h2]:text-2xl [&_h2]:font-semibold',
                                              '[&_h3]:text-lg [&_h3]:font-semibold',
                                              '[&_h4]:text-base [&_h4]:font-semibold',
                                            )}
                                            components={{
                                              a: (props) => (
                                                <a
                                                  {...props}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                />
                                              ),
                                            }}
                                            remarkPlugins={[remarkGfm]}
                                          >
                                            {m.content}
                                          </Markdown>
                                          {isLoading && i === messages.length - 1 && (
                                            <LoaderPinwheel
                                              className={cn(
                                                'h-4 w-4 animate-spin',
                                                !m.content && 'mt-2',
                                              )}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    <div
                                      className={cn(
                                        'absolute z-10',
                                        isUser && '-bottom-2 -left-2',
                                        !isUser && '-bottom-6 -left-1',
                                        (isUser || (!isUser && !isLastMessage)) &&
                                          'opacity-0 transition-opacity group-hover:opacity-100',
                                        isLoading && 'opacity-0',
                                      )}
                                    >
                                      <CopyButton content={m.content} role={m.role} />
                                    </div>
                                  </div>
                                </div>
                                {m.experimental_attachments &&
                                  m.experimental_attachments.length > 0 && (
                                    <MessageAttachments
                                      attachments={m.experimental_attachments as any}
                                      attachmentViewState={attachmentViewState}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}

                {shouldShowPlaceholder && (
                  <article
                    className={cn(
                      'w-full max-w-[100vw] overflow-x-hidden text-foreground',
                      classNameMinHeight,
                    )}
                  >
                    {/* ... existing placeholder content ... */}
                  </article>
                )}
              </div>
            </div>
            {errorMessage && (
              <div className={cn('w-full', classNamePaddingX)}>
                <div
                  className={cn(
                    'mx-auto mb-4 flex w-full flex-1 gap-4 text-base',
                    classNameMaxWidth,
                  )}
                >
                  <Alert variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="break-words">{errorMessage}</AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
            <div className="sticky bottom-0 z-10 m-auto flex w-full grow flex-col">
              {isLoading && (
                <div className="absolute -top-10 left-1/2 mx-auto mb-2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-3xl bg-background px-3 py-2 text-sm text-muted-foreground">
                  <LoaderPinwheel className="h-4 w-4 animate-spin" />
                  <span>Responding...</span>
                </div>
              )}
              <div className={cn('bg-background', 'text-base')}>
                <div className={cn('mx-auto w-full', classNameMaxWidth)}>
                  <div className="mx-auto flex w-full flex-1 gap-4 bg-background text-base md:gap-5 lg:gap-6">
                    <form className="w-full" onSubmit={handleFormSubmit}>
                      <div className="relative flex flex-col rounded-t-3xl border border-b-0 border-border pb-safe-bottom shadow-[0_-4px_16px_-1px_rgba(0,0,0,0.05)] md:pb-4">
                        <div className="relative px-4 pt-1">
                          <FilePreview
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            uploadProgress={uploadProgress}
                            uploadedFiles={uploadedFiles}
                            onRemoveUploadedFile={handleRemoveUploadedFile}
                          />
                        </div>
                        <AutoResizeTextarea
                          ref={textareaRef}
                          className="resize-none border-0 bg-transparent p-5 pb-0 shadow-none ring-transparent focus:outline-none focus:ring-0 focus-visible:ring-0"
                          rows={1}
                          value={input}
                          placeholder="Get advice on anything..."
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                        <div className="flex items-center justify-between px-4 py-2 md:pb-0">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 border border-border text-muted-foreground hover:text-foreground [&_svg]:size-3.5 md:[&_svg]:size-4"
                              onClick={handleUploadClick}
                            >
                              <Paperclip className="" />
                              <span className="sr-only">Attach</span>
                            </Button>
                          </div>

                          <Button
                            type="submit"
                            className="h-8 w-8 rounded-full [&_svg]:size-3.5 md:[&_svg]:size-4"
                            size="icon"
                            disabled={isLoading || isLoadingThread || !input.trim() || isUploading}
                            variant="default"
                          >
                            <ArrowUp />
                            <span className="sr-only">Send</span>
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Settings open={isSettingsOpen} onOpenChange={setSettingsOpen} />
      <ChatHistorySheet open={isChatHistoryOpen} onOpenChange={setChatHistoryOpen} />
    </Page>
  );
}

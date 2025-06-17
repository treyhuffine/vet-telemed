import { useEffect, useRef, useState } from 'react';
import { type Attachment } from 'ai';
import { toast } from 'sonner';
import {
  PostSignedUrlRequestPayload,
  PostSignedUrlResponsePayload,
  SIGN_API_URL,
} from '@/constants/payloads/files/view';
import { useApiGateway } from '@/hooks/useApi';

export type MessageAttachment = Attachment;

export interface SignedAttachment {
  name: string;
  contentType: string;
  originalUrl: string;
  signedUrl: string;
  localUrl?: string; // ObjectURL for the downloaded file
  isDownloaded: boolean;
  isDownloading: boolean;
  error?: string;
  threadId?: string; // Associated thread ID
}

export interface UseAttachmentViewReturn {
  attachments: Record<string, SignedAttachment>;
  isSigningBatch: boolean;
  isLoading: boolean;
}

interface UseAttachmentViewOptions {
  path?: string;
  expirationSeconds?: string;
  threadId?: string; // Current thread ID
  messageAttachments?: MessageAttachment[];
}

export function useAttachmentView(options: UseAttachmentViewOptions = {}): UseAttachmentViewReturn {
  const [isSigningBatch, setIsSigningBatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Record<string, SignedAttachment>>({});
  const processedAttachmentsRef = useRef<Set<string>>(new Set());
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  const { post: generateSignedUrls } = useApiGateway<
    PostSignedUrlRequestPayload,
    PostSignedUrlResponsePayload
  >(SIGN_API_URL);

  // Process attachments and download images
  useEffect(() => {
    const processAndDownload = async () => {
      const { messageAttachments } = options;
      if (!messageAttachments || messageAttachments.length === 0) {
        setIsLoading(false);
        return;
      }
      if (isProcessingRef.current) return;

      isProcessingRef.current = true;
      setIsLoading(true);

      try {
        // Process all attachments that have names and haven't been processed yet
        const validAttachments = messageAttachments.filter(
          (att) => att.name && !processedAttachmentsRef.current.has(att.name),
        );

        if (validAttachments.length > 0) {
          setIsSigningBatch(true);

          const { data, isError, error } = await generateSignedUrls({
            payload: {
              files: validAttachments.map((attachment) => ({
                fileName: attachment.name!,
                path: options.path || 'users',
              })),
              mode: 'view',
              expirationSeconds: options.expirationSeconds,
            },
          });

          if (isError || !data || typeof data !== 'object') {
            throw new Error(error || 'Failed to get signed URLs');
          }

          // Update attachment state with signed URLs
          const newAttachments = { ...attachments };
          let hasChanges = false;

          for (const file of data.files) {
            const matchingAttachment = validAttachments.find((a) => a.name === file.fileName);

            if (matchingAttachment) {
              // Mark as processed
              processedAttachmentsRef.current.add(file.fileName);

              // Check if the attachment already exists with the same signed URL
              const existingAttachment = attachments[file.fileName];
              if (existingAttachment && existingAttachment.signedUrl === file.signedUrl) {
                continue; // Skip this one to avoid unnecessary state updates
              }

              newAttachments[file.fileName] = {
                name: file.fileName,
                contentType: matchingAttachment.contentType || '',
                originalUrl: matchingAttachment.url,
                signedUrl: file.signedUrl,
                isDownloaded: false,
                isDownloading: false,
                threadId: options.threadId,
              };
              hasChanges = true;
            }
          }

          if (hasChanges) {
            setAttachments(newAttachments);
          }

          // Download images sequentially
          for (const file of data.files) {
            if (!isMountedRef.current) break;

            const attachment = newAttachments[file.fileName];
            if (!attachment) continue;

            const isImageFile = attachment.contentType.startsWith('image/');
            if (!isImageFile) continue;

            // Start downloading
            setAttachments((prev) => ({
              ...prev,
              [file.fileName]: {
                ...prev[file.fileName],
                isDownloading: true,
                error: undefined,
              },
            }));

            try {
              const response = await fetch(attachment.signedUrl);
              if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
              }

              const blob = await response.blob();
              const localUrl = URL.createObjectURL(blob);

              if (!isMountedRef.current) {
                URL.revokeObjectURL(localUrl);
                break;
              }

              setAttachments((prev) => ({
                ...prev,
                [file.fileName]: {
                  ...prev[file.fileName],
                  localUrl,
                  isDownloaded: true,
                  isDownloading: false,
                },
              }));
            } catch (error) {
              console.error(`Error downloading ${file.fileName}:`, error);
              if (isMountedRef.current) {
                setAttachments((prev) => ({
                  ...prev,
                  [file.fileName]: {
                    ...prev[file.fileName],
                    isDownloading: false,
                    error: error instanceof Error ? error.message : 'Failed to download file',
                  },
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing attachments:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to process attachments');
      } finally {
        if (isMountedRef.current) {
          setIsSigningBatch(false);
          setIsLoading(false);
          isProcessingRef.current = false;
        }
      }
    };

    processAndDownload();
  }, [options.messageAttachments]);

  // Reset state when thread changes
  useEffect(() => {
    if (options.threadId) {
      // Clear processed attachments when thread changes
      processedAttachmentsRef.current.clear();
      // Clear attachments state
      setAttachments({});
      // Reset loading states
      setIsSigningBatch(false);
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  }, [options.threadId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cleanup any object URLs
      Object.values(attachments).forEach((attachment) => {
        if (attachment.localUrl) {
          URL.revokeObjectURL(attachment.localUrl);
        }
      });
    };
  }, []);

  return {
    attachments,
    isSigningBatch,
    isLoading,
  };
}

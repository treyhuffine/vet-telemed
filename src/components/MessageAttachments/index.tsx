import { useState } from 'react';
import { Download, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MessageAttachment, type UseAttachmentViewReturn } from '@/hooks/useAttachmentView';
import { FileLightbox } from '@/components/FilePreview/FileLightbox';
import { Button } from '@/components/ui/button';

interface MessageAttachmentsProps {
  attachments: MessageAttachment[];
  attachmentViewState: UseAttachmentViewReturn;
}

function MessageAttachments({ attachments, attachmentViewState }: MessageAttachmentsProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<MessageAttachment | null>(null);
  const { attachments: signedAttachments, isLoading } = attachmentViewState;

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const handleDownload = async (attachment: MessageAttachment) => {
    if (!attachment.name) return;
    const signedAttachment = signedAttachments[attachment.name];
    if (!signedAttachment) return;

    try {
      const response = await fetch(signedAttachment.signedUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleImageClick = (attachment: MessageAttachment) => {
    setSelectedAttachment(attachment);
  };

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {attachments.map((attachment) => {
          if (!attachment.name) return null;
          const signedAttachment = signedAttachments[attachment.name];
          const isImage = attachment.contentType?.startsWith('image/');
          const isDownloading = signedAttachment?.isDownloading;
          const hasError = signedAttachment?.error;
          const imageUrl = signedAttachment?.localUrl || signedAttachment?.signedUrl;

          return (
            <div
              key={attachment.name}
              className={cn(
                'group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border bg-muted',
                isLoading && 'animate-pulse',
                hasError && 'border-destructive',
              )}
            >
              {isImage ? (
                <>
                  {imageUrl ? (
                    <button
                      type="button"
                      className="h-full w-full"
                      onClick={() => handleImageClick(attachment)}
                    >
                      <img
                        src={imageUrl}
                        alt={attachment.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </>
              ) : (
                <button
                  type="button"
                  className="flex h-full w-full flex-col items-center justify-center gap-2"
                  onClick={() => handleImageClick(attachment)}
                >
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <span className="max-w-[90%] truncate text-xs text-muted-foreground">
                    {attachment.contentType}
                  </span>
                </button>
              )}

              {!isLoading && !isDownloading && !hasError && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(attachment);
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
                  <span className="text-xs text-destructive"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedAttachment && selectedAttachment.name && (
        <FileLightbox
          url={
            signedAttachments[selectedAttachment.name]?.localUrl ||
            signedAttachments[selectedAttachment.name]?.signedUrl ||
            ''
          }
          name={selectedAttachment.name}
          mimeType={selectedAttachment.contentType || ''}
          isOpen={selectedAttachment !== null}
          onClose={() => setSelectedAttachment(null)}
        />
      )}
    </>
  );
}

export default MessageAttachments;

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

interface Props {
  url: string;
  name: string;
  mimeType: string;
  size?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function FileLightbox({ url, name, mimeType, size, isOpen, onClose }: Props) {
  const isImage = mimeType.startsWith('image/');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-10 bg-black/90" />
        <DialogPrimitive.Content tabIndex={-1}>
          <div className="fixed left-[50%] top-[50%] z-10 flex max-h-[90vh] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] items-center justify-center overflow-hidden focus:outline-none md:max-w-[80vw]">
            {isImage ? (
              <img
                src={url}
                alt={name}
                className="max-h-[90vh] w-auto object-contain"
                tabIndex={-1}
              />
            ) : (
              <div className="flex min-w-[50vw] flex-col items-center gap-4 rounded-lg bg-muted/50 p-8 backdrop-blur-sm">
                <div className="rounded-full bg-background/50 p-4">
                  <FileText className="h-8 w-8 text-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-secondary-foreground">
                    {mimeType || getFileExtension(name)}
                  </p>
                  {size && <p className="text-sm text-muted-foreground">{formatFileSize(size)}</p>}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = name;
                    a.click();
                  }}
                >
                  Download
                </Button>
              </div>
            )}
          </div>
          <button
            className="fixed right-4 top-4 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

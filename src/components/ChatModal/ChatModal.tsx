import React, { useEffect, useRef } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import { KeyCodes } from '@/lib/client/dom';
import { useCurrentChat } from '@/context/Chat';
import { useCrumb } from '@/context/Crumb';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import FilePreview from '@/components/FilePreview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const PLACEHOLDER_TEXT = 'Ask anything about sourdough...';

export function ChatModal() {
  const {
    chatModal,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    files,
    handleUploadClick,
    isUploading,
    uploadProgress,
    uploadedFiles,
    setFiles,
    isFollowUpCrumb,
    setIsFollowUpCrumb,
    startNewChat,
  } = useCurrentChat();
  const { isOpen, closeModal } = chatModal;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { breadEntry, isLoadingEntry } = useCrumb();

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    startNewChat();
    await handleSubmit(e, { isNewChat: true });
    closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { key, shiftKey } = e;
    if (key === KeyCodes.Enter && !shiftKey && !isLoading) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="flex flex-col sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Sourdough AI</DialogTitle>
          </div>
          <DialogDescription>
            I can answer any question about sourdough baking. Ask for advice or share images, I can
            help with anything.
          </DialogDescription>
        </DialogHeader>

        {/* Crumb follow-up UI */}
        {breadEntry && !isLoadingEntry && (
          <div className="mb-4 rounded-lg border bg-muted/30 p-4">
            {breadEntry.images && breadEntry.images.length > 0 && (
              <div className="mb-3 flex justify-center">
                <img
                  src={
                    breadEntry.images[0].imagePath
                      ? `${process.env.CLOUDFLARE_PUBLIC_URL}${breadEntry.images[0].imagePath}`
                      : ''
                  }
                  alt="Crumb photo"
                  className="h-32 w-auto rounded-md object-cover shadow"
                />
              </div>
            )}
            <div className="mb-2 flex items-center gap-2">
              <Switch
                id="followup-crumb-switch"
                checked={isFollowUpCrumb}
                onCheckedChange={setIsFollowUpCrumb}
                className="mr-2"
              />
              <label htmlFor="followup-crumb-switch" className="text-sm font-medium">
                Is this a follow-up question about this crumb reading?
              </label>
            </div>
            <div className="text-xs text-muted-foreground">
              {breadEntry.summary && (
                <div className="mb-1">
                  <span className="font-semibold">Summary:</span> {breadEntry.summary}
                </div>
              )}
              {breadEntry.recipe && (
                <div className="mb-1">
                  <span className="font-semibold">Recipe:</span> {breadEntry.recipe.name}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleFormSubmit} className="flex h-full flex-col">
            <div className="relative px-4 pt-1">
              <FilePreview
                files={files}
                setFiles={setFiles}
                uploadedFiles={uploadedFiles}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            </div>
            <div className="rounded-2xl border bg-white text-black focus-within:border-primary">
              <AutoResizeTextarea
                ref={textareaRef}
                placeholder={PLACEHOLDER_TEXT}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxHeight="200px"
                rows={1}
                className="resize-none border-0 bg-transparent p-5 pb-0 text-base shadow-none ring-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 md:text-base lg:text-base"
                disabled={isLoading}
                autoFocus
                tabIndex={1}
                name="message"
              />
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 border border-border text-muted-foreground hover:text-foreground"
                    onClick={handleUploadClick}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach</span>
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="rounded-full"
                  size="icon"
                  disabled={
                    (input.trim() === '' && uploadedFiles.length === 0) || isLoading || isUploading
                  }
                  variant="default"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

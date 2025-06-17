import { useState } from 'react';
import { FileText, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_FILES } from '@/constants/app';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileLightbox } from './FileLightbox';

// Match the UploadedFile type from useFileUpload
interface UploadedFile {
  originalName: string;
  fileName: string;
  fileUrl: string;
}

interface Props {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  maxFiles?: number;
  isUploading?: boolean;
  uploadProgress?: Record<string, number>;
  uploadedFiles?: UploadedFile[];
  onRemoveUploadedFile?: (fileName: string) => void;
}

export default function FilePreview({
  files,
  setFiles,
  maxFiles = MAX_FILES,
  isUploading = false,
  uploadProgress = {},
  uploadedFiles = [],
  onRemoveUploadedFile,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!files || files.length === 0) return null;

  const filesArray = Array.from(files);

  const handleRemoveFile = (fileToRemove: File) => {
    // Don't allow removing files during upload
    if (isUploading) return;

    const progress = uploadProgress[fileToRemove.name] || 0;
    const isComplete = progress === 100;

    // If the file is already uploaded and we have a handler for removing uploaded files
    if (isComplete && onRemoveUploadedFile) {
      // Find if this file exists in uploadedFiles
      const uploadedFile = uploadedFiles.find((f) => f.originalName === fileToRemove.name);
      if (uploadedFile) {
        onRemoveUploadedFile(fileToRemove.name);
      }
    }

    const dataTransfer = new DataTransfer();

    Array.from(files).forEach((file) => {
      if (file !== fileToRemove) {
        dataTransfer.items.add(file);
      }
    });

    setFiles(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  const getFileExtension = (filename: string) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  };

  // Check if we exceed max files
  if (filesArray.length > maxFiles) {
    toast.error(`You can only upload a maximum of ${maxFiles} files`);

    // Keep only the first maxFiles
    const dataTransfer = new DataTransfer();
    filesArray.slice(0, maxFiles).forEach((file) => {
      dataTransfer.items.add(file);
    });

    setFiles(dataTransfer.files);
    return null;
  }

  // Check if a file is approaching the size limit (over 10MB)
  // const getIsLargeFile = (size: number) => size > MAX_FILE_SIZE * 0.66;

  return (
    <>
      <div className="flex w-full gap-3 overflow-x-auto pb-2 pt-3">
        {filesArray.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const progress = uploadProgress[file.name] || 0;
          const isFileUploading = progress > 0 && progress < 100;
          const isComplete = progress === 100;

          return (
            <div key={`${file.name}-${index}`} className="relative">
              <div
                className={cn(
                  'group relative flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted transition-colors hover:bg-muted/80',
                  isImage ? 'h-14 w-14' : 'h-14 max-w-40',
                  !isFileUploading && isImage && 'cursor-pointer',
                )}
                onClick={() => isImage && !isFileUploading && setSelectedFile(file)}
              >
                {/* Upload overlay */}
                {progress > 0 && !isComplete && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50">
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div className="mt-1 w-full px-3">
                        <Progress value={progress} className="h-1.5 w-full" />
                      </div>
                      {/* <span className="mt-1 text-xs text-muted-foreground">{progress}%</span> */}
                    </>
                  </div>
                )}

                {isImage ? (
                  <div className="relative h-full w-full">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-24 w-24 object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full flex-col p-2 pr-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="truncate text-sm font-medium">{file.name}</div>
                    </div>
                    <div className="mt-auto text-xs text-muted-foreground">
                      {file.type || getFileExtension(file.name)}
                    </div>
                    {/* <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                      {isLargeFile && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-3 w-3 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Large file (max 15MB per file)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div> */}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 bg-foreground/90 text-background opacity-90 transition-opacity hover:bg-foreground hover:text-background hover:opacity-100 [&_svg]:size-3',
                  isFileUploading && 'pointer-events-none opacity-50',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(file);
                }}
                disabled={isUploading && !isComplete}
              >
                <X className="h-2 w-2" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          );
        })}
      </div>

      <FileLightbox
        url={selectedFile ? URL.createObjectURL(selectedFile) : ''}
        name={selectedFile?.name || ''}
        mimeType={selectedFile?.type || ''}
        size={selectedFile?.size}
        isOpen={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
      />
    </>
  );
}

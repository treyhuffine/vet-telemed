import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { FILE_PATH } from '@/constants/app';
import {
  BATCH_API_PATH,
  BatchPostRequestBody,
  BatchPostResponseBody,
} from '@/constants/payloads/signedUrl';
import { useApiGateway } from '@/hooks/useApi';

interface UploadedFile {
  originalName: string;
  fileName: string;
  fileUrl: string;
  filePath: string;
  mimeType: string;
  size: number;
}

interface UseFileUploadOptions {
  path?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadError?: (error: Error) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { post: generateSignedUrls } = useApiGateway<BatchPostRequestBody, BatchPostResponseBody>(
    BATCH_API_PATH,
  );

  const uploadFiles = async (filesToUpload: File[]): Promise<UploadedFile[]> => {
    if (!filesToUpload.length) return [];

    setIsUploading(true);

    try {
      // Initialize progress for each file
      const initialProgress: Record<string, number> = {};
      filesToUpload.forEach((file) => {
        initialProgress[file.name] = 1;
      });
      setUploadProgress(initialProgress);

      // Get signed URLs using the API gateway
      const { data, isError, error } = await generateSignedUrls({
        payload: {
          files: filesToUpload.map((file) => ({
            originalFileName: file.name,
            mimeType: file.type,
            size: file.size,
            requestId: uuidv4(),
          })),
          path: options.path || FILE_PATH,
        },
      });

      if (isError || !data || typeof data !== 'object') {
        throw new Error(error || 'Failed to get signed URLs');
      }

      // Assert that data is FileUploadResponse
      const responseData = data;
      const { urls } = responseData;

      // Upload each file to its signed URL
      const uploadPromises = filesToUpload.map(async (file) => {
        const fileData = urls.find((url) => url.originalFileName === file.name);

        if (!fileData) {
          throw new Error(`No upload URL found for ${file.name}`);
        }

        const {
          signedUrl,
          fileName,
          url: fileUrl,
          originalFileName,
          path: filePath,
          mimeType,
        } = fileData;

        // Upload the file with progress tracking
        const xhr = new XMLHttpRequest();

        const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: percentComplete,
              }));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                originalName: originalFileName,
                fileName,
                fileUrl,
                filePath,
                mimeType,
                size: file.size,
              });
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });

          xhr.open('PUT', signedUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        return uploadPromise;
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(results);

      if (results.length > 0) {
        toast.success(
          `${results.length} ${results.length === 1 ? 'file' : 'files'} uploaded successfully`,
        );
      }

      if (options.onUploadComplete) {
        options.onUploadComplete(results);
      }

      return results;
    } catch (error) {
      console.error('Error uploading files:', error);

      toast.error(error instanceof Error ? error.message : 'Failed to upload files');

      if (options.onUploadError && error instanceof Error) {
        options.onUploadError(error);
      }

      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadState = () => {
    setUploadedFiles([]);
    setUploadProgress({});
  };

  // Add a function to remove a specific uploaded file
  const removeUploadedFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.originalName !== fileName));
  };

  return {
    uploadFiles,
    isUploading,
    uploadProgress,
    uploadedFiles,
    resetUploadState,
    removeUploadedFile,
  };
}

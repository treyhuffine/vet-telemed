import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  API_PATH,
  BATCH_API_PATH,
  BatchPostRequestBody,
  BatchPostResponseBody,
  BatchSignedUrlInfo,
  PostRequestBody,
  PostResponseBody,
} from '@/constants/payloads/signedUrl';
import { useApiGateway } from '@/hooks/useApi';

interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  originalFileName: string;
  size: number;
  mimeType: string;
}

interface UseImageUploadOptions {
  path?: string;
}

export const useImageUpload = ({ path = 'users' }: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useApiGateway<PostRequestBody, PostResponseBody>(API_PATH);
  const { post: postBatch } = useApiGateway<BatchPostRequestBody, BatchPostResponseBody>(
    BATCH_API_PATH,
  );

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    try {
      setIsUploading(true);
      setError(null);

      // Get signed URL from our API
      const response = await post({
        payload: {
          originalFileName: file.name,
          path,
        },
      });

      if (response.isError || !response.data || typeof response.data === 'string') {
        throw new Error(response.error || 'Failed to get signed URL');
      }

      // Upload to Cloudflare R2
      const uploadResponse = await fetch(response.data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      return {
        url: response.data.url,
        path: response.data.path,
        fileName: response.data.fileName,
        originalFileName: file.name,
        size: file.size,
        mimeType: file.type,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Function to upload multiple images at once
  const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
    if (files.length === 0) {
      return [];
    }

    try {
      setIsUploading(true);
      setError(null);

      // Prepare file metadata without generating filenames
      const fileMetadata = files.map((file) => {
        return {
          requestId: uuidv4(),
          originalFileName: file.name,
          size: file.size,
          mimeType: file.type,
          file: file,
        };
      });

      // Get batch signed URLs from our API with file metadata
      const response = await postBatch({
        payload: {
          files: fileMetadata.map((file) => ({
            requestId: file.requestId,
            originalFileName: file.originalFileName,
            size: file.file.size,
            mimeType: file.file.type,
          })),
          path,
        },
      });

      if (response.isError || !response.data || typeof response.data === 'string') {
        throw new Error(response.error || 'Failed to get batch signed URLs');
      }

      // Map the signed URLs to their corresponding files
      const uploadTasks = response.data.urls
        .map((urlInfo: BatchSignedUrlInfo) => {
          // Find the file detail by matching requestId
          const fileDetail = fileMetadata.find(
            (detail) =>
              detail.originalFileName === urlInfo.originalFileName && detail.size === urlInfo.size,
          );

          if (!fileDetail) return null;

          return {
            file: fileDetail.file,
            signedUrl: urlInfo.signedUrl,
            result: {
              url: urlInfo.url,
              path: urlInfo.path,
              fileName: urlInfo.fileName,
              originalFileName: urlInfo.originalFileName,
              size: urlInfo.size,
              mimeType: urlInfo.mimeType,
            },
          };
        })
        .filter(Boolean);

      // Upload all files to Cloudflare R2 in parallel
      // Important: Return the promises directly without awaiting them
      const uploadPromises = uploadTasks.map((task) => {
        if (!task) return Promise.resolve(null);

        // Return the fetch promise directly
        return fetch(task.signedUrl, {
          method: 'PUT',
          body: task.file,
          headers: {
            'Content-Type': task.file.type,
          },
        })
          .then((uploadResponse) => {
            if (uploadResponse.ok) {
              return task.result;
            } else {
              console.error('Failed to upload file to R2:', task.file.name);
              return null;
            }
          })
          .catch((uploadErr) => {
            console.error('Error during file upload to R2:', task.file.name, uploadErr);
            return null;
          });
      });

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Filter out failed uploads
      const results = uploadResults.filter((result) => result !== null);

      if (results.length === 0 && files.length > 0) {
        throw new Error('All image uploads failed');
      }

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    uploadImages,
    isUploading,
    error,
  };
};

import { v4 as uuidv4 } from 'uuid';
import {
  BatchPostRequestBody,
  BatchPostResponseBody,
  BatchSignedUrlInfo,
} from '@/constants/payloads/signedUrl';
import { signImageUpload } from '@/services/server/cloudflare/s3';
import { response500ServerError, responseJson200Success } from '@/lib/server/rsc/http';
import {
  RequestWithViewer,
  withViewerRequired,
} from '@/lib/server/rsc/middleware/withViewerRequired';

export const runtime = 'edge';

export const POST = withViewerRequired(async (req: RequestWithViewer) => {
  try {
    const payload = await req.json();
    const { files, path = 'users' } = payload as BatchPostRequestBody;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return response500ServerError('Invalid or empty files array');
    }

    // First, validate all file metadata and prepare the signing operations
    const validFiles = files.filter((fileMetadata) => {
      const { originalFileName } = fileMetadata;
      if (!originalFileName) {
        console.error('Missing originalFileName in file metadata:', fileMetadata);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return response500ServerError('No valid files to process');
    }

    // Create an array of promises for all file signing operations
    // Important: We don't use await inside the map function to ensure true parallelization
    const signPromises = validFiles.map((fileMetadata) => {
      const { originalFileName, size, mimeType } = fileMetadata;

      // Generate filename on the server
      const extension = originalFileName.split('.').pop() || '';
      const fileName = `file_${uuidv4()}.${extension}`;

      // Return the promise directly without awaiting it
      return signImageUpload({
        path,
        fileName,
      })
        .then(({ signedUrl, data }) => {
          return {
            signedUrl,
            url: data.url,
            path: data.path,
            fileName: data.fileName,
            originalFileName: originalFileName || '',
            size,
            mimeType,
          };
        })
        .catch((error) => {
          console.error(`Error getting signed URL for ${fileName}:`, error);
          return null;
        });
    });

    // Now we await all promises at once
    const allResults = await Promise.all(signPromises);

    // Filter out null values and cast to the correct type
    const results: BatchSignedUrlInfo[] = allResults.filter(
      (result): result is BatchSignedUrlInfo => result !== null,
    );

    if (results.length === 0) {
      return response500ServerError('Failed to generate any signed URLs');
    }

    return responseJson200Success<BatchPostResponseBody>({
      urls: results,
    });
  } catch (error) {
    console.error('Error getting batch signed URLs:', error);
    return response500ServerError('Failed to get batch signed URLs');
  }
});

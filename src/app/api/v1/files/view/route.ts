import {
  PostSignedUrlRequestPayload,
  PostSignedUrlResponsePayload,
} from '@/constants/payloads/files/view';
import { signImageView } from '@/services/server/cloudflare/s3';
import {
  response400BadRequestError,
  response500ServerError,
  responseJson200Success,
} from '@/lib/server/rsc/http';
import {
  RequestWithViewer,
  withViewerRequired,
} from '@/lib/server/rsc/middleware/withViewerRequired';

export const runtime = 'edge';

const APP_USERS_PATH = process.env.FILE_STORAGE_PATH_PREFIX!;

export const POST = withViewerRequired(async (request: RequestWithViewer) => {
  try {
    const {
      files,
      mode,
      expirationSeconds = '3600',
    }: PostSignedUrlRequestPayload = await request.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return response400BadRequestError('Files array is required and must not be empty');
    }

    if (!mode || !['upload', 'view'].includes(mode)) {
      return response400BadRequestError('Valid mode (upload or view) is required');
    }

    // Validate each file request
    for (const file of files) {
      if (!file.path || !file.fileName) {
        return response400BadRequestError('Each file must have a path and fileName');
      }
    }

    // Sign all files in parallel
    const signedFiles = await Promise.all(
      files.map(async (file) => {
        console.log('++++++ file', file);
        const { signedUrl, data } = await signImageView({
          path: APP_USERS_PATH,
          fileName: file.fileName,
          expirationSeconds,
        });

        return {
          signedUrl,
          url: data.url,
          path: data.path,
          fileName: data.fileName,
          provider: data.provider,
          providerUrl: data.providerUrl,
        };
      }),
    );

    return responseJson200Success<PostSignedUrlResponsePayload>({
      files: signedFiles,
    });
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    return response500ServerError('Failed to generate signed URLs');
  }
});

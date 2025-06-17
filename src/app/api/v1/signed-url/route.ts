import { v4 as uuidv4 } from 'uuid';
import { PostRequestBody, PostResponseBody } from '@/constants/payloads/signedUrl';
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
    const { originalFileName, path = 'users' } = payload as PostRequestBody;

    // Generate filename on the server
    const extension = originalFileName.split('.').pop() || '';
    const fileName = `file_${uuidv4()}.${extension}`;

    const { signedUrl, data } = await signImageUpload({
      path,
      fileName,
    });

    return responseJson200Success<PostResponseBody>({
      signedUrl,
      url: data.url,
      path: data.path,
      fileName: data.fileName,
      originalFileName,
    });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    return response500ServerError('Failed to get signed URL');
  }
});

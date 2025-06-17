import { AwsClient } from 'aws4fetch';
import { MediaProviders } from '@/constants/media';
import { removeBoundSlash } from '@/lib/shared/string/removeBoundSlash';

const PROVIDER_KEY = MediaProviders.Cloudflare;
const USERS_BUCKET = 'users';
const CLOUDFLARE_S3_URL = process.env.CLOUDFLARE_S3_URL;

export const s3 = new AwsClient({
  accessKeyId: process.env.CLOUDFLARE_S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.CLOUDFLARE_S3_SECRET_ACCESS_KEY!,
  region: 'auto',
});

async function blobToArrayBuffer(body: BodyInit | null | undefined) {
  if (!body) {
    return null;
  }

  // @ts-expect-error works
  if (typeof body?.arrayBuffer === 'function') {
    console.log('--- HAS ARRAY BUFFER +++');
    // @ts-expect-error works
    return body.arrayBuffer();
  } else if (typeof FileReader !== 'undefined') {
    console.log('--- HAS FileReader +++');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      // @ts-expect-error works
      reader.readAsArrayBuffer(body);
    });
  } else {
    return null;
  }
}

interface UploadImageParams {
  path: string;
  fileName: string;
  body: BodyInit | null | undefined;
}

export const uploadImage = async ({ path, fileName, body }: UploadImageParams) => {
  if (!path) {
    throw new Error('URL path is required');
  }

  if (!fileName) {
    throw new Error('File name is required');
  }

  const host = CLOUDFLARE_S3_URL;
  const filePath = `/${removeBoundSlash(path)}/${fileName}`;

  const uploadUrl = `${host}${filePath}`;

  const payloadBody = await blobToArrayBuffer(body);

  if (!payloadBody) {
    throw new Error('No image data found');
  }

  const response = await s3.fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Length': payloadBody?.byteLength?.toString(),
    },
    body: payloadBody,
  });

  const url = `${process.env.CLOUDFLARE_PUBLIC_URL}${filePath}`;

  return {
    response,
    data: {
      path: filePath,
      fileName,
      host: process.env.CLOUDFLARE_PUBLIC_URL,
      url: url,
      provider: PROVIDER_KEY,
      providerUrl: url,
    },
  };
};

export const uploadUserImage = async ({ fileName, body }: Omit<UploadImageParams, 'path'>) => {
  return uploadImage({ path: USERS_BUCKET, fileName, body });
};

export const uploadTestImage = async ({ fileName, body }: Omit<UploadImageParams, 'path'>) => {
  return uploadImage({ path: 'test', fileName, body });
};

interface SignImageUploadParams {
  expirationSeconds?: string;
  path: string;
  fileName: string;
}

/**
 * @note Strict CORS
 */
// [
//   {
//     "AllowedOrigins": [
//       "http://localhost:3000",
//       "THIS DOMAIN",
//     ],
//     "AllowedMethods": [
//       "GET",
//       "PUT",
//       "POST",
//       "DELETE",
//       "HEAD"
//     ],
//     "AllowedHeaders": [
//       "*"
//     ]
//   }
// ]
/**
 * @note allow any CORS policity
 */
// [
//   {
//     "AllowedOrigins": [
//       "*"
//     ],
//     "AllowedMethods": [
//       "GET",
//       "PUT",
//       "POST",
//       "HEAD"
//     ],
//     "AllowedHeaders": [
//       "*"
//     ]
//   }
// ]

export const signImageUpload = async ({
  expirationSeconds = '3600',
  path,
  fileName,
}: SignImageUploadParams) => {
  if (!path) {
    throw new Error('URL path is required');
  }

  if (!fileName) {
    throw new Error('File name is required');
  }

  const filePath = `/${removeBoundSlash(path)}/${fileName}`;
  console.log('filePath', filePath);

  const uploadUrl = `https://${process.env.CLOUDFLARE_UPLOAD_BUCKET}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${process.env.CLOUDFLARE_PUBLIC_URL}${filePath}`;
  console.log('uploadUrl', uploadUrl);
  console.log('url', url);

  const uploadUrlObject = new URL(uploadUrl);
  uploadUrlObject.pathname = filePath;
  uploadUrlObject.searchParams.append('X-Amz-Expires', expirationSeconds);

  const response = await s3.sign(
    new Request(uploadUrlObject, {
      method: 'PUT',
    }),
    {
      aws: {
        signQuery: true,
      },
    },
  );

  return {
    response,
    signedUrl: response.url,
    data: {
      path: filePath,
      fileName,
      host: process.env.CLOUDFLARE_PUBLIC_URL,
      url: url,
      provider: PROVIDER_KEY,
      providerUrl: url,
    },
  };
};

export const signUserImageUpload = async ({
  expirationSeconds = '3600',
  fileName,
}: Omit<SignImageUploadParams, 'path'>) => {
  return signImageUpload({ expirationSeconds, path: USERS_BUCKET, fileName });
};

export const signTestImageUpload = async ({
  expirationSeconds = '3600',
  fileName,
}: Omit<SignImageUploadParams, 'path'>) => {
  return signImageUpload({ expirationSeconds, path: 'test', fileName });
};

export const signImageView = async ({
  expirationSeconds = '3600',
  path,
  fileName,
}: SignImageUploadParams) => {
  if (!path) {
    throw new Error('URL path is required');
  }

  const filePath = `/${removeBoundSlash(path)}${fileName ? `/${fileName}` : ''}`;

  const uploadUrl = `https://${process.env.CLOUDFLARE_UPLOAD_BUCKET}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${process.env.CLOUDFLARE_PUBLIC_URL}${filePath}`;

  const uploadUrlObject = new URL(uploadUrl);
  uploadUrlObject.pathname = filePath;
  uploadUrlObject.searchParams.append('X-Amz-Expires', expirationSeconds);

  const response = await s3.sign(
    new Request(uploadUrlObject, {
      method: 'GET',
    }),
    {
      aws: {
        signQuery: true,
      },
    },
  );

  return {
    response,
    signedUrl: response.url,
    data: {
      path: filePath,
      fileName,
      host: process.env.CLOUDFLARE_PUBLIC_URL,
      url: url,
      provider: PROVIDER_KEY,
      providerUrl: url,
    },
  };
};

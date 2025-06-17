export const SIGN_API_URL = '/v1/files/view' as const;

export type SigningMode = 'upload' | 'view';

export type FileSigningRequest = {
  path: string;
  fileName: string;
};

export type PostSignedUrlRequestPayload = {
  files: FileSigningRequest[];
  mode: SigningMode;
  expirationSeconds?: string;
};

export type SignedFileResponse = {
  signedUrl: string;
  url: string;
  path: string;
  fileName: string;
  provider: string;
  providerUrl: string;
};

export type PostSignedUrlResponsePayload = {
  files: SignedFileResponse[];
};

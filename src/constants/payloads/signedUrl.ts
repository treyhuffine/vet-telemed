export const API_PATH = '/v1/signed-url' as const;

export interface PostRequestBody {
  originalFileName: string;
  path?: string;
}

export interface PostResponseBody {
  signedUrl: string;
  url: string;
  path: string;
  fileName: string;
  originalFileName: string;
}

// Enhanced types for batch processing
export const BATCH_API_PATH = '/v1/signed-urls' as const;

// File metadata to be included in the request
export interface FileMetadata {
  originalFileName: string;
  requestId: string;
  size: number;
  mimeType: string;
}

export interface BatchPostRequestBody {
  files: FileMetadata[];
  path?: string;
}

export interface BatchSignedUrlInfo {
  signedUrl: string;
  url: string;
  path: string;
  fileName: string;
  originalFileName: string;
  size: number;
  mimeType: string;
}

export interface BatchPostResponseBody {
  urls: BatchSignedUrlInfo[];
}

import { Message } from 'ai';

export type PostRequestPayload = {
  messages: Message[];
  threadId: string;
  crumbId?: string;
  files?: {
    originalName: string;
    fileName: string;
    fileUrl: string;
    filePath: string;
    mimeType: string;
    size: number;
  }[];
};

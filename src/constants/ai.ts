import { Message } from 'ai';

export const CHARACTERS_PER_TOKEN_INT = 4;

export enum AiModel {
  Standard = 'gpt-4.1',
  Cheap = 'gpt-4.1-mini',
  Nano = 'gpt-4.1-nano',
}

export const DEFAULT_CHAT_MODEL = AiModel.Cheap;
export const DEFAULT_TITLE_MODEL = AiModel.Nano;
export const DEFAULT_CRUMB_READ_MODEL = AiModel.Cheap;

export type Role = Message['role'];

export const Roles = {
  User: 'user' as Role,
  Assistant: 'assistant' as Role,
  System: 'system' as Role,
  Tool: 'tool' as Role,
  Function: 'function' as Role,
  Data: 'data' as Role,
} as const;

export const INFORMATION_KEY = 'information';
export const SUBMISSION_ANNOTATION_TYPE = 'id:submission';
export const RESPONSE_ANNOTATION_TYPE = 'id:response';

export const getSubmissionAnnotation = (id: string) => ({
  id,
  other: INFORMATION_KEY,
  type: SUBMISSION_ANNOTATION_TYPE,
});

export const getResponseAnnotation = (id: string) => ({
  id,
  other: INFORMATION_KEY,
  type: RESPONSE_ANNOTATION_TYPE,
});

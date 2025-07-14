import { gql } from '@/types/generated/client';

export const CHAT_THREAD = gql(/* GraphQL */ `
  fragment chatThread on ChatThreads {
    id
    title
    messages(orderBy: { createdAt: ASC }) {
      id
      user {
        id
        name
      }
      content
      role
      files {
        id
        filePath
        fileName
        mimeType
      }
    }
  }
`);

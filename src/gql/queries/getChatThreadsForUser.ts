import { gql } from '@/types/generated/client';

export const GET_CHAT_THREADS_FOR_USER = gql(/* GraphQL */ `
  query getChatThreadsForUser($userId: uuid!) {
    chatThreads(where: { userId: { _eq: $userId } }, orderBy: { updatedAt: DESC }) {
      id
      title
    }
  }
`);

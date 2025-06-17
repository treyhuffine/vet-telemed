import { gql } from '@/types/generated/client';

export const GET_CHAT_THREAD_BY_ID = gql(/* GraphQL */ `
  query getChatThreadById($id: uuid!) {
    chatThreadsByPk(id: $id) {
      ...chatThread
    }
  }
`);

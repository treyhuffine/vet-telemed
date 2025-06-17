import { type Message } from 'ai';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertChatMessageUserMutation,
  InsertChatMessageUserMutationVariables,
} from '@/types/generated/server';
import client from '@/services/server/graphql/client';

type Variables = Omit<InsertChatMessageUserMutationVariables, 'role'> & {
  role: Message['role'];
};

const MUTATION = gql`
  mutation insertChatMessageUser(
    $id: uuid!
    $userId: uuid!
    $threadId: uuid!
    $role: String!
    $content: String!
    $promptTokens: Int = 0
    $files: [ChatMessageFilesInsertInput!] = []
    $isMedical: Boolean
    $isMedicalConfidence: numeric
  ) {
    insertChatMessagesOne(
      object: {
        id: $id
        chatThreadId: $threadId
        role: $role
        content: $content
        userId: $userId
        promptTokens: $promptTokens
      }
      onConflict: {
        constraint: chat_messages_pkey
        updateColumns: [updatedAt]
        where: { userId: { _eq: $userId }, thread: { userId: { _eq: $userId } } }
      }
    ) {
      id
      content
      role
      createdAt
      updatedAt
    }
    insertChatMessageFiles(
      objects: $files
      onConflict: { constraint: chat_message_files_pkey, updateColumns: updatedAt }
    ) {
      returning {
        id
      }
    }
  }
`;

export const insertChatMessageUser = async (variables: Variables) => {
  const data = await client.request<InsertChatMessageUserMutation>(print(MUTATION), variables);
  return data?.insertChatMessagesOne;
};

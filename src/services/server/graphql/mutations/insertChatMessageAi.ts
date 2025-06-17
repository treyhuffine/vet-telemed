import { type Message } from 'ai';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  InsertChatMessageAiMutation,
  InsertChatMessageAiMutationVariables,
} from '@/types/generated/server';
import client from '@/services/server/graphql/client';

type Variables = Omit<InsertChatMessageAiMutationVariables, 'role'> & {
  role: Message['role'];
};

const MUTATION = gql`
  mutation insertChatMessageAi(
    $threadId: uuid!
    $role: String!
    $content: String!
    $model: String
    $promptTokens: Int = 0
    $completionTokens: Int = 0
    $totalTokens: Int = 0
    $temperature: numeric
    $topP: numeric
    $frequencyPenalty: numeric
    $presencePenalty: numeric
    $createdByUserId: uuid!
  ) {
    insertChatMessagesOne(
      object: {
        chatThreadId: $threadId
        role: $role
        content: $content
        model: $model
        promptTokens: $promptTokens
        totalTokens: $totalTokens
        completionTokens: $completionTokens
        temperature: $temperature
        topP: $topP
        frequencyPenalty: $frequencyPenalty
        presencePenalty: $presencePenalty
      }
      onConflict: {
        constraint: chat_messages_pkey
        updateColumns: [updatedAt]
        where: { thread: { userId: { _eq: $createdByUserId } } }
      }
    ) {
      id
      content
      role
      createdAt
      updatedAt
    }
  }
`;

export const insertChatMessageAi = async (variables: Variables) => {
  const data = await client.request<InsertChatMessageAiMutation>(print(MUTATION), variables);
  return data?.insertChatMessagesOne;
};

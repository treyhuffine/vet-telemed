import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpsertInitializeChatThreadMutation,
  UpsertInitializeChatThreadMutationVariables,
} from '@/types/generated/server';
import client from '@/services/server/graphql/client';

const MUTATION = gql`
  mutation upsertInitializeChatThread($id: uuid!, $createdByUserId: uuid!, $breadEntryId: uuid) {
    insertChatThreadsOne(
      object: { id: $id, userId: $createdByUserId, breadEntryId: $breadEntryId }
      onConflict: {
        constraint: chat_threads_pkey
        updateColumns: [updatedAt]
        where: { userId: { _eq: $createdByUserId } }
      }
    ) {
      id
      title
      createdAt
      updatedAt
      userId
      breadEntry {
        id
        analysis
        message
        notes
        summary
        trendAnalysis
        images {
          imagePath
          id
          imageName
          mimeType
          size
          originalImageName
        }
        recipe {
          id
          flour
          ingredients
          instructions
          name
          remarks
          salt
          water
        }
      }
    }
  }
`;

export const upsertInitializeChatThread = async (
  variables: UpsertInitializeChatThreadMutationVariables,
) => {
  const data = await client.request<UpsertInitializeChatThreadMutation>(print(MUTATION), variables);
  return data?.insertChatThreadsOne;
};

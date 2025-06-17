import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  UpdateChatTitleMutation,
  UpdateChatTitleMutationVariables,
} from '@/types/generated/server';
import client from '@/services/server/graphql/client';

const MUTATION = gql`
  mutation updateChatTitle($id: uuid!, $title: String!) {
    updateChatThreadsByPk(pkColumns: { id: $id }, _set: { title: $title }) {
      id
      title
    }
  }
`;

export const updateChatTitle = async (variables: UpdateChatTitleMutationVariables) => {
  const data = await client.request<UpdateChatTitleMutation>(print(MUTATION), variables);
  return data;
};

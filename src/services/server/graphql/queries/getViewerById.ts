import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { GetViewerByIdQuery, GetViewerByIdQueryVariables } from '@/types/generated/server';
import client from '@/services/server/graphql/client';

const QUERY = gql`
  query getViewerById($id: uuid!) {
    usersByPk(id: $id) {
      createdAt
      email
      id
      name
    }
  }
`;

export const getViewerById = async (variables: GetViewerByIdQueryVariables) => {
  const data = await client.request<GetViewerByIdQuery>(print(QUERY), variables);
  return data?.usersByPk;
};

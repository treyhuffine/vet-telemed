import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import {
  GetCheckUserExistsQuery,
  GetCheckUserExistsQueryVariables,
} from '@/types/generated/server';
import client from '@/services/server/graphql/client';

const QUERY = gql`
  query getCheckUserExists($email: String!) {
    users(where: { email: { _eq: $email } }, limit: 1) {
      id
      name
      email
    }
  }
`;

export const getCheckUserExists = async (variables: GetCheckUserExistsQueryVariables) => {
  const data = await client.request<GetCheckUserExistsQuery>(print(QUERY), variables);
  return data?.users;
};

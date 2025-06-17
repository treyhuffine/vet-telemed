import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { InsertNewUserMutation, InsertNewUserMutationVariables } from '@/types/generated/server';
import client from '@/services/server/graphql/client';

const MUTATION = gql`
  mutation insertNewUser(
    $id: uuid!
    $email: String!
    $createdAt: timestamptz = "now()"
    $updatedAt: timestamptz = "now()"
    $stripeCustomerId: String!
  ) {
    insertUsersOne(
      object: {
        id: $id
        email: $email
        createdAt: $createdAt
        updatedAt: $updatedAt
        stripeCustomerId: $stripeCustomerId
        name: ""
      }
    ) {
      id
    }
  }
`;

export const insertNewUser = async (variables: InsertNewUserMutationVariables) => {
  const data = await client.request<InsertNewUserMutation>(print(MUTATION), variables);
  return data?.insertUsersOne;
};

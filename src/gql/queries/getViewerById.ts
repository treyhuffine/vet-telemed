import { gql } from '@/types/generated/client';

export const GET_VIEWER_BY_CLERK_ID = gql(/* GraphQL */ `
  query getViewerById($id: uuid!) {
    usersByPk(id: $id) {
      id
      name
      email
    }
  }
`);

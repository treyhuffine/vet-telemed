import { gql } from '@/types/generated/client';

export const SET_USER_FULL_NAME = gql(/* GraphQL */ `
  mutation setUserFullName($id: uuid!, $name: String = "") {
    updateUsersByPk(pkColumns: { id: $id }, _set: { name: $name }) {
      id
      name
    }
  }
`);

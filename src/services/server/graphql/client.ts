import { GraphQLClient } from 'graphql-request';

const ENDPOINT = process.env.GRAPHQL_URL || '/v1/graphql';
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '';

const client = new GraphQLClient(ENDPOINT, {
  headers: {
    'x-hasura-admin-secret': ADMIN_SECRET,
  },
});

export default client;

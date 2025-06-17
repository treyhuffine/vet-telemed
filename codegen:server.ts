import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  watch: true,
  schema: {
    ['https://staging-graphql-sourdo.onrender.com/v1/graphql']: {
      headers: {
        'x-hasura-admin-secret': 'ppvjdgYmGgNKR_cAL@U!D3mYrY_XpwEhmaEa@Jf@UwcDwiQs',
      },
    },
  },
  documents: 'src/services/server/graphql/**/*.ts',
  generates: {
    './src/types/generated/server.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        addInferredTypes: true,
      },
    },
    './src/types/generated/introspection.json': {
      plugins: ['introspection'],
      config: {
        minify: true, // Optional: Minify the JSON output
      },
    },
    './src/types/generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;

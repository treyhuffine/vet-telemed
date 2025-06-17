import type { CodegenConfig } from '@graphql-codegen/cli';

// config: {
//   withHooks: true,
//   withComponent: false,
//   withHOC: false,
//   withHoc: false,
//   noNamespaces: true,
//   strict: true,
// },

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
  documents: 'src/{components,gql,screens,pages,layouts,hooks,context,app}/**/*.{ts,tsx}',
  ignoreNoDocuments: true,
  generates: {
    './src/types/generated/client/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
      },
    },
    './src/types/generated/client/hooks.tsx': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;

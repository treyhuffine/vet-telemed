import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/nextjs';
import merge from 'deepmerge';
import * as http from 'http';
import { isEqual } from 'lodash';
import { getViewerToken } from '@/services/client/supabase';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

export interface InitApolloOptions {
  clientState?: object;
  headers?: http.IncomingHttpHeaders;
  authToken?: string;
}

type Client = ApolloClient<NormalizedCacheObject>;
let apolloClient: Client;
const URI = process.env.GRAPHQL_URL;

const withToken = setContext(async () => {
  const token = await getViewerToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
});

function createApolloClient(options: InitApolloOptions = { headers: {} }) {
  const httpLink = new HttpLink({
    uri: URI,
    fetchOptions: {
      mode: 'cors',
    },
    // @ts-expect-error The headers ill always match
    headers: options.headers || {},
    credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        Sentry.captureException(new Error(`GraphQL Error: ${message}`), {
          extra: {
            locations,
            path,
            operationName: operation.operationName,
          },
        });
      });
    }
    if (networkError) {
      Sentry.captureException(networkError, {
        extra: {
          operationName: operation.operationName,
        },
      });
    }
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([withToken, errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addApolloState(client: Client, pageProps: any) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}

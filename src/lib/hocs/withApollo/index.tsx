import React, { useState } from 'react';
import {
  ApolloClient,
  DefaultOptions,
  InMemoryCache,
  NormalizedCacheObject,
  from,
  split,
  HttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/react-hooks';
import { onError } from '@apollo/client/link/error';
import UI from '../../common/UI';
import { isServer } from 'nuudel-utils';
import { onErrors } from '../../common/helper';
import withApollo from 'next-with-apollo';
//import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'; // apollo-client-nextjs
import { resolvers, typeDefs, QUERY, initData } from './resolvers';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { pathname } from 'nuudel-utils';

export const cache = new InMemoryCache({ addTypename: false }).restore({});

cache.writeQuery({
  query: QUERY,
  data: { ...initData },
});

const { NEXT_PUBLIC_WS_SUBSCRIPTION = 'false' } = process?.env;

export const getURL = (): string => {
  return process?.env?.NEXT_PUBLIC_ENV === 'development'
    ? `http://${process?.env?.HOST || 'localhost'}:${
        process?.env?.NEXT_PUBLIC_PORT || process?.env?.PORT || '8080'
      }/${pathname}`
    : `${process?.env?.NEXT_PUBLIC_WEB || ''}/${pathname}`;
};

const wsLink =
  !isServer && NEXT_PUBLIC_WS_SUBSCRIPTION === 'true'
    ? new WebSocketLink({
        // if you instantiate in the server, the error will be thrown
        uri: `ws://${process?.env?.DOMAIN}:${process?.env?.PORT}/${pathname}`,
        options: {
          reconnect: true,
          connectionParams: {
            //authToken: (await UI.headers())?.Authorization,
          },
        },
      })
    : null;

const httpLink = new HttpLink({
  uri: getURL(),
});

const authLink = setContext(async (_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    //credentials: 'include',
    //fetchOptions: { credentials: 'include'},
    headers: {
      ...headers,
      'Accept-Encoding': 'gzip, deflate, br',
      ...(await UI.headers()),
    },
  };
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (
        !isServer &&
        !window.location?.pathname?.startsWith('/admin/login') &&
        //(!!message && message.toLowerCase().indexOf('access denied') >= 0) ||
        !!extensions &&
        typeof extensions.code === 'string' &&
        extensions.code?.toUpperCase() === 'FORBIDDEN' // UNAUTHENTICATED
      ) {
        window.location.href =
          '/admin/login?message=' + encodeURIComponent(message || '');
      }
      // eslint-disable-next-line no-console
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
  }
});

const link =
  !isServer && !!wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

var client: ApolloClient<NormalizedCacheObject>;
export const createClient = (headers?: any): any => {
  return (
    client ||
    (client = new ApolloClient({
      link: authLink.concat(
        from([
          errorLink,
          link,
          //createUploadLink({ uri: process?.env?.NEXT_PUBLIC_COMMON_BACKEND_URL }),
        ])
      ),
      resolvers,
      typeDefs,
      cache,
      //headers: headers,
      //defaultOptions: defaultOptions,
      ssrMode: isServer,
    }))
  );
};
client = createClient();

// Extracting a Custom Hook
export function useClient() {
  const [clientStat, setClientStat] = useState(client);
  if (!clientStat) {
    setClientStat(createClient());
  }
  return clientStat;
}

export default withApollo(
  ({ initialState, headers }) => {
    return createClient(headers);
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props?.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);

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
//import { createUploadLink } from 'apollo-upload-client';
import UI from '../../common/UI';
import { onErrors, isServer } from '@Utils';
import withApollo from 'next-with-apollo';
import { resolvers, typeDefs, QUERY } from './resolvers';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

export const cache = new InMemoryCache({ addTypename: false }).restore({});

cache.writeQuery({
  query: QUERY,
  data: {
    isLeftDrawerOpen: false,
    snackMsg: 'default',
    snackType: 'success',
    snackBarOpen: false,
    leftDrawerWidth: 260,
    isConnected: true,
  },
});

const { WEB = '' } = process.env;
const pathname: string = 'api/graphql';

export const URL: string = `${WEB}/${pathname}`;

const wsLink =
  !isServer && process?.env?.NODE_ENV === 'development'
    ? new WebSocketLink({
        // if you instantiate in the server, the error will be thrown
        uri: `ws://${process.env.DOMAIN}:${process.env.PORT}/${pathname}`,
        options: {
          reconnect: true,
          connectionParams: {
            //authToken: (await UI.headers())?.Authorization,
          },
        },
      })
    : null;

const httpLink = new HttpLink({
  uri: URL,
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
        window.location.pathname !== '/admin/login' &&
        //(!!message && message.toLowerCase().indexOf('access denied') >= 0) ||
        !!extensions &&
        extensions.code.toUpperCase() === 'UNAUTHENTICATED'
      ) {
        window.location.href = '/admin/login';
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

let client: ApolloClient<NormalizedCacheObject>;
export const createClient = (headers?: any): any => {
  return (
    client ||
    (client = new ApolloClient({
      link: authLink.concat(
        from([
          errorLink,
          link,
          //createUploadLink({ uri: process.env.NEXT_PUBLIC_COMMON_BACKEND_URL }),
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
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);

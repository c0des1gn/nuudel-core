import { store } from '../hocs/withRedux';
import { sign_out } from '../redux/actions/user';
import { ApolloError, fromPromise } from '@apollo/client';
import { useApolloClient } from '@apollo/react-hooks';
import {
  USER_TOKEN,
  USER_ID,
  USER_KEY,
  USER_LANG,
  isServer,
} from 'nuudel-utils';
import gql from 'graphql-tag';
import UI from '../common/UI';

var debounce: any = null;
export const signOut = (router?: any) => {
  try {
    const token = UI.getItem(USER_TOKEN);
    if (token) {
      UI.removeItem(USER_TOKEN);
      UI.removeItem(USER_ID);
      UI.removeItem(USER_KEY);
      UI.removeItem(USER_LANG);
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (router && router.push) {
          router.push('/admin/login');
        } else if (!isServer) {
          window.location.href = '/admin/login';
        }
      }, 50);
    }
  } catch {}
};

const GET_TOKEN_QUERY = gql`
  query Refresh($refresh_token: String!) {
    refresh(refresh_token: $refresh_token) {
      _id
      token
      currency
      locale
      type
      status
      refreshToken
    }
  }
`;

export const getNewToken = () => {
  // need to replace refresh token
  const refresh_token = UI.getItem(USER_TOKEN);
  const client = useApolloClient();
  return client.query({
    query: GET_TOKEN_QUERY,
    variables: { refresh_token },
  });
};

export const onErrors = ({
  graphQLErrors,
  networkError,
  operation,
  forward,
}): void | any => {
  if (graphQLErrors) {
    if (networkError && networkError.statusCode === 401) {
      signOut();
      return;
    }
    for (let e of graphQLErrors) {
      // handle errors differently based on its error code
      switch (e.extensions.code) {
        case 'UNAUTHENTICATED':
          signOut();
          return;
          // old token has expired throwing AuthenticationError,
          // one way to handle is to obtain a new token and
          // add it to the operation context
          return fromPromise(
            getNewToken()
              .then((response) => {
                // extract your accessToken from your response data and return it
                const { data } = response;
                if (data && data.refresh) {
                  return data.refresh.token;
                }
                return;
              })
              .catch((error) => {
                // Handle token refresh errors e.g clear stored tokens, redirect to login
                signOut();
                return;
              })
          )
            .filter((value) => Boolean(value))
            .flatMap((accessToken) => {
              const headers = operation.getContext().headers;
              // modify the operation context with a new token
              operation.setContext({
                headers: {
                  ...headers,
                  authorization: `Bearer ${accessToken}`,
                },
              });
              // retry the request, returning the new observable
              return forward(operation);
            });
          break;
        // handle other errors
        case 'INTERNAL_SERVER_ERROR':
          if (
            !!e.message &&
            e.message.toLowerCase().indexOf('access denied') >= 0
          ) {
            //signOut();
            return;
          }
          break;
      }
    }
  }
};

export const clientError = async ({ errors }) => {
  if (
    typeof errors !== 'undefined' &&
    errors.length > 0 &&
    errors.filter(
      (e) =>
        //(!!e.message && e.message.toLowerCase().indexOf('access denied') >= 0) ||
        !!e.extensions && e.extensions.code.toUpperCase() === 'UNAUTHENTICATED'
    ).length > 0
  ) {
    signOut();
  }
};

export const onError = (error: any) => {
  if (error instanceof ApolloError) {
    //graphQLErrors, networkError, message, extraInfo
    error =
      error.graphQLErrors.length > 0
        ? error.graphQLErrors[0].message
        : error.message;
  }
  return error;
};

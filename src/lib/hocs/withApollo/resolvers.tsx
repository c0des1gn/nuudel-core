import gql from 'graphql-tag';
import { Resolvers, ApolloCache } from '@apollo/client';
import { SNACKBAR_STATE_QUERY } from '../../components/Material/SuccessMessage';

export const typeDefs = gql`
  extend type Query {
    snackMsg: String
    snackType: String
    snackBarOpen: Boolean
    isLeftDrawerOpen: Boolean
    leftDrawerWidth: Int
    isConnected: Boolean
  }
`;

export const QUERY = gql`
  query WriteQuery {
    snackMsg
    snackType
    snackBarOpen
    isLeftDrawerOpen
    leftDrawerWidth
    isConnected
  }
`;

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

interface ResolverMap {
  [field: string]: ResolverFn;
}

interface AppResolvers extends Resolvers {
  Launch: ResolverMap;
  Mutation: ResolverMap;
}

export const resolvers: AppResolvers = {
  Launch: {},
  Mutation: {
    updateNetworkStatus: (_, { isConnected }, { cache }) => {
      cache.writeQuery({ query: QUERY, data: { isConnected } });
      return null;
    },
    toggleSnackBar(_, variables, { cache }) {
      const cacheData = cache.readQuery<any>({
        query: SNACKBAR_STATE_QUERY,
      });

      const data = {
        ...cacheData,
        snackBarOpen: variables.msg !== '' ? !cacheData.snackBarOpen : false,
        snackMsg: variables.msg,
        snackType: variables.type,
      };
      cache.writeQuery({ query: QUERY, data: data });
      return { data: data };
    },
  },
};

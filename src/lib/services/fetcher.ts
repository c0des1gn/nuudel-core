import axios from 'axios';
import { UI } from '../common/UI';
import { isServer } from 'nuudel-utils';

const pathname: string = 'api/graphql';

export const fetcher = async (
  query: string,
  variables: any = {},
  headers: any = {}
) =>
  axios({
    url: `${process?.env?.WEB || ''}/${pathname}`,
    method: 'post',
    data: {
      query: query,
      variables: variables,
    },
    headers: {
      ...(!isServer
        ? await UI.headers()
        : !process?.env?.TOKEN
        ? {}
        : { Authorization: `Bearer ${process?.env?.TOKEN}` }),
      ...headers,
    },
  }).then((res) => res.data);

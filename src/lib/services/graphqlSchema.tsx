import {
  getIntrospectionQuery,
  buildClientSchema,
  GraphQLSchema,
} from 'graphql';
import UI from '../common/UI';
import { HttpClient } from 'nuudel-utils';

export const GetSchema = async (url: string): Promise<GraphQLSchema | null> => {
  let clientSchema: GraphQLSchema | null = null;
  try {
    const json = await HttpClient(url, {
      method: 'POST',
      //mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        ...(await UI.headers()),
      },
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    });
    clientSchema = buildClientSchema(json.data);
  } catch (error) {
    return Promise.reject(error); // end server untarsan ued ajillah zuils hiine
  }

  return clientSchema;
};

export default GetSchema;

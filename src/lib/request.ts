import axios, { AxiosResponse } from 'axios';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql';

const CancelToken = axios.CancelToken;

/**
 * @param {String} url The url value as a string.
 * @param {Any} request The request as a object.
 * @returns {Promise<any>} The parsed json object.
 */
export const HttpClient = async (
  url: string,
  request: any = {},
  errorCallback?: Function,
  onCancel?: Function,
): Promise<any> => {
  //return fetch(url, request).then(response => response.json());
  let body = {};
  if (typeof request.body !== 'undefined') {
    body = request.body;
    delete request['body'];
  }
  // https://github.com/axios/axios#cancellation
  if (onCancel) {
    request['cancelToken'] = new CancelToken(() => onCancel);
  }
  let res: AxiosResponse<any>,
    data = {};
  try {
    const method = request.method.toLowerCase();
    if (method === 'post') {
      res = await axios.post(url, body, request);
    } else if (method === 'put') {
      res = await axios.put(url, body, request);
    } else if (method === 'delete') {
      res = await axios.delete(url, request);
    } else {
      res = await axios.get(url, request);
    }
    if (res) {
      if (res.status === 200) {
      }
      if (res.data) {
        data = res.data;
      }
    }
  } catch (error) {
    if (typeof errorCallback === 'function') {
      errorCallback(error);
    }
    if (error.message) {
      // Something happened in setting up the request and triggered an Error
      throw new Error(error.message);
    } else if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error);
    }
  }
  return data;
};

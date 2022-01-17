import moment from 'moment';
import { ApolloError, fromPromise } from '@apollo/client';
import { useApolloClient } from '@apollo/react-hooks';
import { store } from '../hocs/withRedux';
import { t } from '@Translate';
import { USER_TOKEN, USER_ID, USER_KEY, USER_LANG } from '../config';
import { MarketType, Permission } from '../common/ControlMode';
import gql from 'graphql-tag';
import UI from '../common/UI';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ICurrentUser } from '@Interfaces';

export class Utils {
  /**
   * Returns formated date string
   */
  public GetFormatedDate(dateValue: any, length: number = 16): string {
    let date: string = '';
    if (typeof dateValue === 'string') {
      let convertedDate: Date = new Date(dateValue);
      date = convertedDate.toLocaleString().substring(0, length);
    } else if (dateValue instanceof Date) {
      date = dateValue.toLocaleString().substring(0, length);
    }
    return date || dateValue;
  }

  /**
   * Returns formated date string
   */
  public GetDateOnly(dateString: string): string {
    let shortDate = '';
    if (dateString) {
      let dateItems = dateString.split(' ');
      if (dateItems.length > 1) {
        shortDate = dateItems[0];
      }
    }
    let convertedDate: Date = new Date(dateString);
    return shortDate;
  }
  /**
   * Returns the file name by spliting the file url
   */
  public GetFileName(fileAbsoluteUrl: string): string {
    if (fileAbsoluteUrl) {
      let items = fileAbsoluteUrl.split('/');
      return items[items.length - 1];
    }
    return '';
  }
}

export const titleShorter = (title: string, length = 30) => {
  if (title.length > length) {
    title = title.substring(0, length) + '...';
  }
  return title;
};

export const formatPrice = (value: any, fixed: number = 0) => {
  if (!isNaN(value)) {
    value = Number(value);
    const multi: number = fixed === 1 ? 10 : 1;
    value =
      fixed > 1 ? value.toFixed(fixed) : Math.round(value * multi) / multi;
    value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return value;
};

const currency_symbol: object = {
  MNT: { pre: '', post: '₮' },
  TRY: { pre: '', post: '₺' },
  INR: { pre: '', post: '₹' },
  USD: { pre: '$', post: '' },
  EUR: { pre: '€', post: '' },
  CNY: { pre: '', post: '¥' },
  RUB: { pre: '', post: '₽' },
  JPY: { pre: '', post: '¥' },
  GBP: { pre: '£', post: '' },
  CHF: { pre: '', post: 'CHF' },
  KRW: { pre: '', post: '₩' },
  HKD: { pre: '', post: '$' },
  AUD: { pre: '$', post: '' },
  CAD: { pre: '$', post: '' },
  SGD: { pre: '', post: '$' },
  SEK: { pre: '', post: 'kr' },
};

export const getCurrency = (): any => {
  const { user } = store.getState();
  return user.currency;
};

export const getCurrencySymbol = (currency: string = 'MNT'): any => {
  return Object.keys(currency_symbol).indexOf(currency) >= 0
    ? { currency, ...currency_symbol[currency] }
    : { currency, pre: '', post: '' };
};

export const withSymbol = (value: any, currency: string = 'MNT'): string => {
  const symbol = getCurrencySymbol(currency);
  return symbol.pre + formatPrice(value) + symbol.post;
};

export const getSymbol = (): string => {
  const symbol = getCurrencySymbol();
  return !symbol.pre ? symbol.post : symbol.pre;
};

export const convertCurrency = (
  price: number,
  currency: string,
  showzero: boolean = false
): string => {
  const { user } = store.getState();
  let rate: number = getRate(currency);
  const converted_currency = rate === 1 ? currency : user.currency;
  const symbol =
    Object.keys(currency_symbol).indexOf(converted_currency) >= 0
      ? currency_symbol[converted_currency]
      : { pre: '', post: '' };
  const value = formatPrice(price * rate);
  return value === '0' && !showzero ? '' : symbol.pre + value + symbol.post;
};

export const getRate = (currency: string): number => {
  let rate: number = 1;
  let rt: any[] = [];

  if (rt && rt.length > 0) {
    rate = rt[0].rate;
  }
  return rate;
};

export const convertValue = (price: number, currency: string): number => {
  return price * getRate(currency);
};

export const exchangeValue = (price: number, currency: string): number => {
  return price / getRate(currency);
};

export const getMinLeft = (expired: any) => {
  let min: number = 0;
  if (!(expired && moment(expired).isValid())) {
    return min;
  }
  let deadline = moment(expired);
  let now = moment();

  if (!now.isAfter(deadline)) {
    min = deadline.diff(now, 'minutes');
  }
  return min;
};

export const getTimeLeft = (expired: any): string => {
  const min: number = getMinLeft(expired);
  if (min <= 0) {
    return t('item ends');
  } else {
    if (min >= 1440) {
      return t('dayhour', {
        days: Math.floor(min / 1440),
        hours: Math.floor((min % 1440) / 60),
      });
    } else {
      return t('hourmin', {
        hours: Math.floor(min / 60),
        min: Math.floor(min % 60),
      });
    }
  }
};

export const estimateDay = (created: any, days: number = 1) => {
  if (!(created && moment(created).isValid())) {
    return created;
  }
  const estimate_start = moment(moment(created).add(days, 'd')).format(
    'YYYY/MM/DD'
  );
  const estimate_end = moment(moment(created).add(days + 7, 'd')).format(
    'MM/DD'
  );
  return estimate_start + ' ~ ' + estimate_end;
};

export const traverse = (data: any, parent: string = ''): any => {
  let nodes = {};
  for (let [key, value] of Object.entries(data)) {
    const internalName = !!parent ? parent + '.' + key : key;
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Array) &&
      Object.keys(value as object).indexOf('uri') < 0
    )
      nodes = { ...nodes, ...traverse(value, internalName) };
    else nodes[internalName] = value;
  }
  return nodes;
};

export const zeroPad = (value: number | string, size: number): string => {
  let s: string = value.toString();
  //while (s.length < (size || 2)) { s = '0' + s; }
  s = s.padStart(size, '0');
  return s;
};

export const getGqlString = (doc: any) => {
  return doc.loc && doc.loc.source.body;
};

// remove duplicate elements from an array [duplicate]
export const getUnique = (arr, comp): any[] => {
  let unique = arr
    .map((e) => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);
  return unique;
};

export const getAdress = (
  address: any,
  withPhone = true,
  withCountry = false,
  withCode = false
) => {
  let location: string[] = [];
  if (!address) {
    return location;
  }

  if (withPhone && (address.phone || address.mobile)) {
    location.push(...[address.phone, address.mobile].filter(Boolean));
  }

  if (!!address.other && withCode) location.push(address.address);

  if (!!address.address) location.push(address.address);
  if (!!address.street) location.push(address.street);
  if (!!address.district) location.push(address.district);
  if (!!address.city && withCountry)
    location.push(
      address.city + (!address.zipcode ? '' : ' ' + address.zipcode)
    );
  if (!!address.country && withCountry) location.push(address.country);

  return location.filter(function (e) {
    return e;
  });
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

export function getCondition(condition) {
  switch (condition ? condition.toLowerCase() : '') {
    case 'new':
    case 'sealed':
    case 'brand new':
    case 'new with box':
    case 'new with tags':
      condition = t('New');
      break;
    case 'used':
    case 'pre-owned':
    case 'certified pre-owned':
      condition = t('Used');
      break;
    case 'openbox':
    case 'open box':
      condition = t('OpenBox');
      break;
    case 'refurbished':
    case 'renewed':
      condition = t('Refurbished');
      break;
    case 'parts':
      condition = t('Parts');
      break;
    case 'any':
      condition = t('Any');
      break;
    case 'collectible':
      condition = t('Collectible');
      break;
    case 'new other (see details)':
    case 'new without tags':
    case 'new without box':
      condition = t('NewOther');
      break;
    case 'new with defects':
      condition = t('NewWithDefects');
      break;
    case 'manufacturer refurbished':
      condition = t('ManufacturerRefurbished');
      break;
    case 'seller refurbished':
    case 'remanufactured':
    case 'retread':
    case 'certified refurbished':
      condition = t('SellerRefurbished');
      break;
    case 'like new':
      condition = t('LikeNew');
      break;
    case 'very good':
      condition = t('VeryGood');
      break;
    case 'good':
      condition = t('Good');
      break;
    case 'acceptable':
      condition = t('Acceptable');
      break;
    case 'for parts or not working':
    case 'damaged':
      condition = t('Parts');
      break;
    default:
      break;
  }
  return condition;
}

export const isHTML = RegExp.prototype.test.bind(
  /(<\/[^>]*?>)|(<[^>]*?\/>)/m // <(\S*?)[^>]*>(.|\n)*?<\/\1>
);

export const getTax = (market: MarketType): number => {
  let tax: number = 0;
  return tax;
};

export const shipping = (product: any): number => {
  return (
    product.shipping.value *
    product.qty *
    product.rate *
    (product.taxincluded && product.shippingtaxed === false
      ? (100 + product.tax) / 100
      : 1)
  );
};

export const tax = (product: any): number => {
  return (
    ((product.cost.value +
      (product.shippingtaxed === false ? product.shipping.value : 0)) *
      product.qty *
      product.rate *
      (product.taxincluded ? 0 : product.tax)) /
    100
  );
};

export const subtotal = (product: any): number => {
  return (
    product.cost.value * product.qty * product.rate +
    tax(product) +
    product.fee * fee(product)
  );
};

export const fee = (product: any): number => {
  return product.cost.value * product.qty;
};

export const uuid = (): string => {
  let uid = bcrypt.encodeBase64(crypto.pseudoRandomBytes(64), 32).substring(24);
  uid =
    uid.substring(0, 8) +
    '-' +
    uid.substring(8, 12) +
    '-' +
    uid.substring(12, 16) +
    '-' +
    uid.substring(16, 20) +
    '-' +
    uid.substring(20);
  return uid;
};

export const isServer: boolean = typeof window === 'undefined';

export const formatDate = (isoDateString: string): string => {
  const date = moment(isoDateString);
  const currentDate = moment();
  const daysAgo = date.diff(currentDate, 'days');
  const hoursAgo = date.diff(currentDate, 'hours');
  const minutesAgo = date.diff(currentDate, 'minutes');
  const secondsAgo = date.diff(currentDate, 'seconds');

  if (secondsAgo <= 2) {
    return `just now`;
  }
  if (minutesAgo < 1) {
    return `${secondsAgo} second${secondsAgo > 1 ? 's' : ''} ago`;
  }
  if (hoursAgo < 1) {
    return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
  }
  if (daysAgo < 1) {
    return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
  }
  if (daysAgo <= 30) {
    return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  }
  return date.format('MMM do, yyyy');
};

export const formateDateForInput = (isoDateString: string): string => {
  if (isoDateString && moment(isoDateString).isValid()) {
    return moment(isoDateString).format('yyyy-MM-dd');
  }
  return isoDateString;
};

export const capitalizeFirstLetter = (word: string) => {
  if (!word) {
    return '';
  }
  word = word.toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const getPermission = (
  listname: string,
  user: ICurrentUser,
  permission: Permission = Permission.Read,
  data?: any
): Permission => {
  if (!user) {
    return Permission.Read;
  }

  if (
    user.type === 'Admin' ||
    (!!data && data._userId && data._userId === user._id)
  ) {
    return Permission.Remove;
  }

  let per = user.permission.filter((p) => p.listname === listname);

  if (per.length > 0) {
    return per[0].permission;
  } else if (
    user.permission.length > 0 &&
    user.permission[0].listname === 'Default'
  ) {
    return user.permission[0].permission;
  }

  return permission;
};

export const getPlural = (listname: string, post = 's') => {
  if (post !== 's') {
    return listname;
  }
  return `${
    listname.endsWith('s') ||
    listname.endsWith('sh') ||
    listname.endsWith('ch') ||
    listname.endsWith('x') ||
    listname.endsWith('z')
      ? listname + 'e'
      : listname.endsWith('y')
      ? listname.substring(0, listname.length - 1) + 'ie'
      : listname.endsWith('f') || listname.endsWith('fe')
      ? listname.substring(
          0,
          listname.length - (listname.endsWith('fe') ? 2 : 1)
        ) + 've'
      : listname
  }`;
};

export const dateToISOString = (date: any, length = 24, defaultValue = '') => {
  if (!moment(date).isValid()) {
    return defaultValue;
  }
  return moment(date).toISOString().substring(0, length);
};

export const dateToString = (
  date: any = new Date(),
  format = 'YYYY-MM-DDTHH:mm',
  defaultValue = ''
) => {
  if (!date || !moment(date).isValid()) {
    return defaultValue;
  }
  return moment(date).format(format);
};

export const decodeHTML = (str: string) => {
  return str.replace(/&#([0-9]{1,3});/gi, (match, num) => {
    return String.fromCharCode(parseInt(num));
  });
};

export const getPath = (listname: string) => {
  const _customLists = [
    'Address',
    'Category',
    'Delivery',
    'Merchant',
    'Product',
    'Stock',
    'User',
  ];
  if (_customLists.indexOf(listname) >= 0) {
    return 'User' === listname
      ? '/admin/signup'
      : '/admin/' + listname.toLowerCase();
  }
  return '/forms/' + listname.toLowerCase();
};

export const closeDialog = (refresh: boolean = false): void => {
  try {
    window.frameElement['cancelPopUp'](refresh);
  } catch {
    window.parent.document.getElementById('closealldialogordrawer').click();
  }
};

export const clearText = (
  value: string | null,
  lowercase: boolean = false
): string => {
  value = !value ? '' : value.replace(/\s+/g, '');
  return lowercase ? value.toLowerCase() : value;
};

export const lookupFormater = (data: any[], name: string) => {
  let list = [];
  if (data) {
    list = data.map((item) => ({
      _id: item._id,
      name: item[name],
    }));
  }
  return list;
};

export const query_string = (query: string) => {
  let vars = query.replace(/^\?|^\%3(F|f)/, '').split('&');
  let query_string = {};
  for (let i: number = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    let key = decodeURIComponent(pair[0]);
    let value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === 'undefined') {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === 'string') {
      let arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
};

export const parse_params = (path: string) => {
  let query_string = {};
  let url: string = path.match(
    /^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*))?$/
  )
    ? new URL(path).search
    : path;
  let params = new URLSearchParams(url);
  params.forEach((key, value) => {
    query_string[key] = value;
  });
  return query_string;
};

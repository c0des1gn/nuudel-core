export { useWindowDimensions } from './useWindowDimension';
import { USER_TOKEN, isServer } from 'nuudel-utils';
import {
  isIOS,
  isAndroid,
  isTablet,
  osName,
  osVersion,
  browserName,
  browserVersion,
  fullBrowserVersion,
  getUA,
  isMobile,
  mobileModel,
  deviceType,
} from 'react-device-detect';

const getUniqueId = mobileModel || deviceType;
export const DeviceId = {
  uniqueId: getUniqueId,
  deviceId: fullBrowserVersion,
  brand: browserName,
  os: osName,
  osVersion: osVersion,
  isTablet: isTablet,
  isIOS: isIOS,
  isAndroid: isAndroid,
  isMobile: isMobile,
  version: browserVersion,
  device: getUA,
};

export const isIpad = isIOS && isTablet;

export const width =
  typeof window !== 'undefined'
    ? window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    : 1920; // seWindowDimensions().width
export const height =
  typeof window !== 'undefined'
    ? window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight
    : 1080; // seWindowDimensions().height

type storageType = 'cookie' | 'localStorage';
const defaultType: storageType = 'localStorage';
export class UI {
  public static getItem = (
    key: string,
    type: storageType = defaultType,
    callback?: (error?: Error, result?: string) => void
  ): string | null => {
    let data: string | null = null;
    // @ts-ignore
    if (isServer || typeof localStorage === 'undefined') {
      type = 'cookie';
    }
    data = type === 'cookie' ? getCookie(key) : getStorage(key);
    if (!data && type === 'localStorage') {
      data = getCookie(key);
    }
    if (callback) {
      callback();
    }
    return data;
  };

  public static setItem = (
    key: string,
    value: string,
    type: storageType = defaultType,
    callback?: (error?: Error) => void
  ): void => {
    // @ts-ignore
    if (
      isServer ||
      USER_TOKEN === key ||
      (type !== 'cookie' &&
        typeof localStorage === 'undefined' &&
        checkCookie())
    ) {
      type = 'cookie';
    }
    type === 'cookie' ? setCookie(key, value) : setStorage(key, value);
    if (callback) {
      callback();
    }
  };

  public static removeItem = (
    key: string,
    callback?: (error?: Error) => void
  ): void => {
    try {
      eraseCookie(key);
    } catch {}
    try {
      localStorage.removeItem(key);
    } catch {}
    if (callback) {
      callback();
    }
  };

  public static async headers(): Promise<any> {
    // get the authentication token from local storage if it exists
    const token = UI.getItem(USER_TOKEN);
    // return the headers object

    let headers: any = {
      deviceuniqid: DeviceId.uniqueId + '|' + DeviceId.device,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}

function getStorage(name: string): string | null {
  let cookie: string | null = null;
  // @ts-ignore
  if (typeof localStorage !== 'undefined') {
    cookie = localStorage.getItem(name);
  }
  return cookie;
}

function setStorage(name: string, value: any) {
  // @ts-ignore
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(name, value);
  }
}

export function getCookie(name: string): string | null {
  var nameEQ = name + '=';
  try {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  } catch {}
  return null;
}

export function setCookie(
  name: string,
  value: any,
  days: number = 365,
  Secure = false,
  HttpOnly = false
) {
  var cook = [name + '=' + (value || ''), 'path=/'];
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cook.push('expires=' + date.toUTCString());
  }
  if (Secure) {
    cook.push('Secure');
  }
  if (HttpOnly) {
    cook.push('HttpOnly');
  }
  try {
    document.cookie = cook.join('; ');
  } catch {}
}

function checkCookie(test: boolean = true) {
  var cookieEnabled = !!navigator?.cookieEnabled;
  if (!cookieEnabled && test) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') != -1;
  }
  return cookieEnabled;
}

function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export default UI;

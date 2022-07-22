import { useWindowDimensions } from './useWindowDimension';
import { USER_TOKEN, isServer } from 'nuudel-utils';
import {
  isIOS,
  isAndroid,
  isTablet,
  osName,
  osVersion,
  browserName,
} from 'react-device-detect';
//import cookie from 'fastify-cookie';

const DeviceInfo = '',
  getUniqueId = '';
export const DeviceId = {
  uniqueId: getUniqueId,
  deviceId: DeviceInfo,
  brand: browserName,
  os: osName,
  osVersion: osVersion,
  isTablet: isTablet,
  isIOS: isIOS,
  isAndroid: isAndroid,
  //version: DeviceInfo.getVersion(),
  device: DeviceInfo,
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

export class UI {
  public static getItem = (
    key: string,
    callback?: (error?: Error, result?: string) => void
  ): string | null => {
    return getStorage(key);
  };

  public static setItem = (
    key: string,
    value: string,
    callback?: (error?: Error) => void
  ): void => {
    return setStorage(key, value);
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
  };

  public static async headers(): Promise<any> {
    // get the authentication token from local storage if it exists
    const token = UI.getItem(USER_TOKEN);
    // return the headers object
    return {
      Authorization: token ? `Bearer ${token}` : '',
      deviceuniqid: DeviceId.uniqueId + '|' + DeviceId.device,
    };
  }
}

function setStorage(name: string, value: any) {
  if (checkCookie() || isServer) {
    setCookie(name, value);
    return;
  }
  typeof localStorage === 'undefined'
    ? setCookie(name, value)
    : localStorage?.setItem(name, value);
}

function getStorage(name: string) {
  return getCookie(name) || localStorage?.getItem(name);
}

function setCookie(name: string, value: any, days: number = 365) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  try {
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  } catch {}
}

function checkCookie(test: boolean = true) {
  var cookieEnabled = navigator.cookieEnabled;
  if (!cookieEnabled && test) {
    document.cookie = 'testcookie';
    cookieEnabled = document.cookie.indexOf('testcookie') != -1;
  }
  return cookieEnabled;
}

function getCookie(name: string) {
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

function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export default UI;

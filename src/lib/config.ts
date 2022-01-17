export const USER_KEY = 'USER_KEY';
export const USER_ID = 'USER_ID';
export const USER_TOKEN = 'USER_TOKEN';
export const USER_LANG = 'USER_LANG';
export const NOTI_TOKEN = 'NOTI_TOKEN';
export const CURRENT_INVOICE = 'CURRENT_INVOICE';

export const GUEST_USER_ID = '1234567890abcd0987654321';

export var CONF = {
  minVersion: '1.0.0',
  site_title: '',
  site_description: '',
  posts_per_page: 10,
};

export const AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36';

export const setConf = (Conf: any) => {
  CONF = Conf;
};

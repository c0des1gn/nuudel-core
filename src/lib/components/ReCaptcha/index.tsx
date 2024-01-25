import React from 'react';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import {Recaptcha} from './Recaptcha';
//import {HttpClient} from 'nuudel-utils';

export interface IProps {
  onReceiveToken?: (captchaToken: string) => void;
  siteKey?: string;
  action?: string;
  showSwitch?: boolean;
}
/*
export const verifyRecaptcha = async (
  token: string,
  action: string = 'contactus',
): Promise<boolean> => {
  let re = false;
  let uri: string =
    typeof window?.location === 'undefined' || process?.env?.WEB
      ? process?.env?.WEB || ''
      : window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port !== '80' && window.location.port !== '443'
          ? ':' + window.location.port
          : '');

  try {
    // Ping the google recaptcha verify API to verify the captcha code you received
    const r = await HttpClient(`${uri}/recaptcha`, {
      method: 'post',
      body: JSON.stringify({captcha: token}),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    re = !!r?.success;
  } catch {}

  return re;
}; // */

const ReCaptcha: React.FC<IProps> = ({
  siteKey = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  ...props
}) => {
  return (
    <GoogleReCaptchaProvider
      useRecaptchaNet
      reCaptchaKey={siteKey}
      scriptProps={{async: true, defer: true, appendTo: 'body'}}>
      <Recaptcha {...props} captchaDomain={''} />
    </GoogleReCaptchaProvider>
  );
};

export default ReCaptcha;

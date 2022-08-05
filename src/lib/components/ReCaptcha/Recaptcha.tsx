import React, {useState, useCallback, useEffect, useRef} from 'react';
import {useGoogleReCaptcha, GoogleReCaptcha} from 'react-google-recaptcha-v3';
import Switch from '@material-ui/core/Switch';

export interface IProps {
  captchaDomain?: string;
  onReceiveToken?: (captchaToken: string) => void;
  action?: string;
  showSwitch?: boolean;
}

export const Recaptcha: React.FC<IProps> = ({
  showSwitch = true,
  action = 'contactus', // 'login' | 'homepage',
  ...props
}) => {
  const {executeRecaptcha} = useGoogleReCaptcha();

  const _token = useRef<string>('');
  const handleReCaptchaVerify = async (): Promise<string> => {
    if (!executeRecaptcha || !action) {
      return '';
    }
    const token = await executeRecaptcha(action);
    _token.current = token;
    return token;
  };

  const clickHandler = useCallback(
    async (checked: boolean = true) => {
      let token = await handleReCaptchaVerify();
      if (props.onReceiveToken) {
        props.onReceiveToken(checked ? token : '');
      }
    },
    [executeRecaptcha],
  );

  useEffect(() => {
    if (!showSwitch) {
      clickHandler();
    }
  }, [executeRecaptcha]);

  return (
    <>
      {showSwitch && (
        <Switch
          name="Agree"
          defaultChecked={!!_token.current}
          onChange={e => clickHandler(e?.target?.checked)}
        />
      )}
      {/*
      !showSwitch && (
        <GoogleReCaptcha
          onVerify={(token: string) => {
            if (props.onReceiveToken && !_token.current) {
              props.onReceiveToken(token);
            }
            _token.current = token;
          }}
          action={action}
        />
      )
        // */}
    </>
  );
};

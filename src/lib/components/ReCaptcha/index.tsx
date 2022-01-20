import React, { Component } from 'react';
import {
  IWithGoogleReCaptchaProps,
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from 'react-google-recaptcha-v3';
import { HttpClient } from 'nuudel-utils';

export interface IProps extends IWithGoogleReCaptchaProps {
  captchaDomain?: string;
  onReceiveToken: (captchaToken: string) => void;
  siteKey: string;
  action: string;
}

export type IState = { token?: string };

const { WEB = '' } = process.env;

class ReCaptcha extends Component<IProps, IState> {
  public static defaultProps = {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    action: 'homepage', // 'login'
  };

  constructor(props: IProps) {
    super(props);
    this.state = { token: undefined };
  }

  handleVerifyRecaptcha = async () => {
    const { executeRecaptcha } = this.props.googleReCaptchaProps;

    if (!executeRecaptcha) {
      console.log('Recaptcha has not been loaded');
      return;
    }

    const token = await executeRecaptcha(this.props.action);

    this.setState({ token });
  };

  onReCAPTCHAChange = async (token: string) => {
    let uri: string =
      typeof window.location === 'undefined'
        ? WEB
        : window.location.protocol +
          '//' +
          window.location.host +
          (window.location.port !== '80' && window.location.port !== '443'
            ? ':' + window.location.port
            : '');

    try {
      // Ping the google recaptcha verify API to verify the captcha code you received
      const r = await HttpClient(`${uri}/recaptcha`, {
        method: 'post',
        body: JSON.stringify({ captcha: token }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      if (r.status === 200) {
      }
    } catch (error) {}
  };

  render() {
    const { token } = this.state;
    return (
      <div>
        <GoogleReCaptchaProvider reCaptchaKey={this.props.siteKey}>
          <GoogleReCaptcha
            onVerify={(token: string) => {
              this.props.onReceiveToken(token);
            }}
            action={this.props.action}
          />
        </GoogleReCaptchaProvider>
        <button onClick={this.handleVerifyRecaptcha}>Verify Recaptcha</button>
        <p>Token: {token}</p>
      </div>
    );
  }
}

export default ReCaptcha;

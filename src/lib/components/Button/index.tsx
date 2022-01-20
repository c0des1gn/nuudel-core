import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button as BaseButton, ButtonProps } from '@material-ui/core';

interface IProps extends ButtonProps {
  timeout?: number;
  style?: any;
  disabled?: boolean;
  onClick?(e?: any): void;
}

export const Button: FunctionComponent<IProps> = ({ children, ...props }) => {
  const { timeout = 1200 } = props;
  //const [_debounce, setDebounce] = useState();
  let _debounce: any = undefined;
  useEffect(() => {
    //function cleanup()
    return () => {
      clearTimeout(_debounce);
    };
  }, [_debounce]);

  const onClick = e => {
    if (timeout) {
      if (!_debounce) {
        props.onClick && props.onClick(e);
      } else {
        clearTimeout(_debounce);
      }
      _debounce = setTimeout(() => {
        //setDebounce(undefined);
        _debounce = undefined;
      }, timeout);
    } else {
      props.onClick && props.onClick(e);
    }
  };
  return (
    <BaseButton
      variant="contained"
      {...props}
      onClick={onClick}
      style={props.style}
    >
      {children}
    </BaseButton>
  );
};

interface TouchableProps {
  timeout: number;
  onClick?(e?: any): void;
  onDoubleClick?(e?: any): void;
}

export class Touchable extends React.Component<TouchableProps, any> {
  protected LongClick: boolean;
  protected _debounce: any = undefined;
  constructor(props: TouchableProps) {
    super(props);
    this.LongClick = false;
    this.state = {};
  }

  static defaultProps = {
    timeout: 1200,
  };

  protected onLongClick = e => {
    this.LongClick = true;
    this.props.onDoubleClick && this.props.onDoubleClick(e);
  };

  protected onClick = e => {
    this.LongClick = false;
    if (this.props.timeout) {
      if (!this._debounce) {
        this.props.onClick && this.props.onClick(e);
      } else {
        clearTimeout(this._debounce);
      }
      this._debounce = setTimeout(() => {
        this._debounce = undefined;
      }, this.props.timeout);
    } else {
      this.props.onClick && this.props.onClick(e);
    }
  };

  componentWillUnmount() {
    clearTimeout(this._debounce);
  }

  render() {
    return (
      <button
        {...this.props}
        onClick={this.onClick}
        onDoubleClick={this.onLongClick}
      />
    );
  }
}

export default Button;

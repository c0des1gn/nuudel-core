import React from 'react';
import { Container as BaseContainer, ContainerProps } from '@mui/material';

export interface IProps extends ContainerProps {
  children: any;
  style?: any;
  iscenter?: boolean | undefined;
}

export default class Container extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    iscenter: undefined,
  };

  render() {
    const { children, ...props } = this.props;

    let style =
      typeof this.props.iscenter !== 'undefined'
        ? {
            alignItems: 'center',
            justifyContent: 'center',
          }
        : {};

    return (
      <BaseContainer {...props} style={{ ...style, ...props.style }}>
        {children}
      </BaseContainer>
    );
  }
}

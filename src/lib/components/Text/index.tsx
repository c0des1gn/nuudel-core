import React, { FunctionComponent, ElementType } from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface ITextProps extends TypographyProps {
  component?: ElementType<any>;
  //children?: React.ReactNode;
  style?: any;
}

export const Text: FunctionComponent<ITextProps> = ({ children, ...props }) => (
  <Typography {...props} style={props.style}>
    {children}
  </Typography>
);

export const H1: FunctionComponent<ITextProps> = ({ children, ...props }) => (
  <Typography {...props} style={props.style}>
    {children}
  </Typography>
);

export const Label: FunctionComponent<ITextProps> = ({
  children,
  ...props
}) => (
  <Typography {...props} style={props.style}>
    {children}
  </Typography>
);

export default Text;

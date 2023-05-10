import React from 'react';
import { TextField, OutlinedTextFieldProps } from '@mui/material';

interface ITextFieldProps extends OutlinedTextFieldProps {
  style?: any;
  maxLength?: number;
  //variant?: string;
}

const Input: React.FC<ITextFieldProps> = React.forwardRef<
  HTMLInputElement,
  ITextFieldProps
>(({ children, ...props }, ref) => {
  const { variant = 'outlined', maxLength = 255, inputProps } = props;
  props.variant = variant;
  return (
    <TextField
      ref={ref}
      {...props}
      style={props.style}
      inputProps={{
        ...inputProps,
        maxLength: maxLength,
      }}
    >
      {children}
    </TextField>
  );
});

export default Input;

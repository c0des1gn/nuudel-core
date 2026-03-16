import React from 'react';
import { Checkbox as BaseCheckbox, CheckboxProps } from '@mui/material';

interface ICheckboxProps extends CheckboxProps {
  placeholder?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, ICheckboxProps>(
  function Checkbox({ placeholder = '', ...props }, ref) {
    return <BaseCheckbox ref={ref} placeholder={placeholder} {...props} />;
  }
);

//export const Checkbox: React.FC<ICheckboxProps> = (props: ICheckboxProps) => (
//  <BaseCheckbox {...props} />
//);

export default Checkbox;

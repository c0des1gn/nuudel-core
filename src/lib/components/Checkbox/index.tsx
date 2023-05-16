import React from 'react';
import { Checkbox as BaseCheckbox, CheckboxProps } from '@mui/material';

interface ICheckboxProps extends CheckboxProps {}

const Checkbox = React.forwardRef<HTMLButtonElement, ICheckboxProps>(
  function Checkbox(props, ref) {
    return <BaseCheckbox ref={ref} {...props} />;
  }
);

//export const Checkbox: React.FC<ICheckboxProps> = (props: ICheckboxProps) => (
//  <BaseCheckbox {...props} />
//);

export default Checkbox;

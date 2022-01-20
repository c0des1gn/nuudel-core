import React from 'react';
import { Checkbox as BaseCheckbox, CheckboxProps } from '@material-ui/core';

interface ICheckboxProps extends CheckboxProps {}

export const Checkbox: React.FC<ICheckboxProps> = props => (
  <BaseCheckbox {...props} />
);

export default Checkbox;

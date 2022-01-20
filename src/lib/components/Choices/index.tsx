import React from 'react';
import {
  RadioGroup,
  RadioGroupProps,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

interface IRadioGroupProps extends RadioGroupProps {
  options: IChoicesItem[];
}

export interface IChoicesItem {
  value: string | any;
  label: string;
  icon?: string;
  uri?: string;
}

export const Choices: React.FC<IRadioGroupProps> = ({ options, ...props }) => (
  <RadioGroup {...props}>
    {options.map((option: IChoicesItem) => (
      <FormControlLabel
        value={option.value}
        control={<Radio />}
        label={option.label}
      />
    ))}
  </RadioGroup>
);

export default Choices;

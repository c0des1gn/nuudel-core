import React from 'react';
import {
  RadioGroup,
  RadioGroupProps,
  FormControlLabel,
  Radio,
} from '@mui/material';

interface IRadioGroupProps extends RadioGroupProps {
  options: IChoicesItem[];
  disabled?: boolean;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  color?: 'primary' | 'secondary' | 'default';
}

export interface IChoicesItem {
  value: string | any;
  label: string;
  icon?: React.ReactNode;
  uri?: string;
}

export const Choices: React.FC<IRadioGroupProps> = ({
  options = [],
  color = undefined, // 'primary'
  labelPlacement, // 'end'
  disabled,
  ...props
}) => (
  <RadioGroup {...props}>
    {options.map((option: IChoicesItem, index: number) => (
      <div
        style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}
      >
        <FormControlLabel
          key={index}
          labelPlacement={labelPlacement}
          value={option.value}
          control={<Radio disabled={true === disabled} color={color} />}
          label={option.label}
        />
        {option.icon}
      </div>
    ))}
  </RadioGroup>
);

export default Choices;

import React from 'react';
import {
  Switch as BaseSwitch,
  SwitchProps,
  FormControlLabel,
} from '@mui/material';

interface ISwitchProps extends SwitchProps {
  label?: string;
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  labelValue?: any;
}

export const Switch: React.FC<ISwitchProps> = ({
  label,
  labelPlacement,
  labelValue,
  value,
  ...props
}) => (
  <FormControlLabel
    control={<BaseSwitch {...props} />}
    label={label}
    labelPlacement={labelPlacement}
    value={labelValue}
  />
);

export default Switch;

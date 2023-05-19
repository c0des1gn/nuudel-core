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

export const Switch: React.FC<ISwitchProps> = React.forwardRef<
  HTMLButtonElement,
  ISwitchProps
>(({ label, labelPlacement, labelValue, value, ...props }, ref) => (
  <FormControlLabel
    control={<BaseSwitch {...props} ref={ref} />}
    label={label}
    labelPlacement={labelPlacement}
    value={labelValue}
  />
));

export default Switch;

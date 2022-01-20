import React from 'react';
import { Divider as BaseDivider, DividerProps } from '@material-ui/core';

interface IDividerProps extends DividerProps {}

export const Divider: React.FC<IDividerProps> = props => (
  <BaseDivider {...props} />
);

export default Divider;

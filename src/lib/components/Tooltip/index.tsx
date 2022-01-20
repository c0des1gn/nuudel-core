import React from 'react';
import { Tooltip as Hint, TooltipProps } from '@material-ui/core';

interface ITooltipProps extends TooltipProps {}

export const Tooltip: React.FC<ITooltipProps> = props => <Hint {...props} />;

export default Tooltip;

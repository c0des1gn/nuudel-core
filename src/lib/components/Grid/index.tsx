import React from 'react';
import { Grid as BaseGrid, GridProps } from '@material-ui/core';

interface IGridProps extends GridProps {}

export const Grid: React.FC<IGridProps> = props => <BaseGrid {...props} />;

export default Grid;

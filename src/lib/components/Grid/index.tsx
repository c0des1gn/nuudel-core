import React from 'react';
import { Grid as BaseGrid, GridProps } from '@mui/material';

interface IGridProps extends GridProps {}

export const Grid: React.FC<IGridProps> = (props) => <BaseGrid {...props} />;

export default Grid;

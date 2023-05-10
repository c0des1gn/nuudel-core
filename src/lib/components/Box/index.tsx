import React from 'react';
import { Box as BaseBox, BoxProps } from '@mui/material';

interface IBoxProps extends BoxProps {}

export const Box: React.FC<IBoxProps> = (props) => <BaseBox {...props} />;

export default Box;

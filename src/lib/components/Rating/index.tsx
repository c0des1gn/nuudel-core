import React from 'react';
import StarRating, { RatingProps } from '@mui/material/Rating';
import { makeStyles } from 'tss-react/mui';

interface IRatingProps extends RatingProps {}

export const Rating: React.FC<IRatingProps> = (props) => (
  <StarRating {...props} />
);

export default Rating;

import React from 'react';
import StarRating, { RatingProps } from '@mui/material/Rating';
import { createStyles, makeStyles } from '@mui/styles';

interface IRatingProps extends RatingProps {}

export const Rating: React.FC<IRatingProps> = (props) => (
  <StarRating {...props} />
);

export default Rating;

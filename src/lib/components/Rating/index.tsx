import React from 'react';
import StarRating, { RatingProps } from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core';

interface IRatingProps extends RatingProps {}

export const Rating: React.FC<IRatingProps> = props => (
  <StarRating {...props} />
);

export default Rating;

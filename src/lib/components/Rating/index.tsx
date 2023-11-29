import React from 'react';
import StarRating, { RatingProps } from '@mui/material/Rating';

interface IRatingProps extends RatingProps {}

export const Rating: React.FC<IRatingProps & any> = React.forwardRef<
  HTMLSpanElement,
  IRatingProps
>(({ ...props }, ref) => <StarRating {...props} ref={ref} />);

export default Rating;

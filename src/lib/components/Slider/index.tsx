import React from 'react';
import { Slider as BaseSlider, SliderProps } from '@mui/material';

interface ISliderProps extends SliderProps {}

export const Slider: React.FC<ISliderProps> = (props) => (
  <BaseSlider {...props} />
);

export default Slider;

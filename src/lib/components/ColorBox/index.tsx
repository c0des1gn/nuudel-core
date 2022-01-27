import React from 'react';
import styles from '../../theme/styles/styles.module.scss';

interface IColorBox {
  //style?: any;
  color: string;
}

const colors = {
  Clear:
    'linear-gradient(to top right, #fff calc(50% - 1px), rgba(255,0,0,1), #fff calc(50% + 1px)',
  Multi:
    'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,0,219,1) 25%, rgba(252,220,0,1) 50%, rgba(9,255,0,1) 75%, rgba(0,52,255,1) 100%)',
  Black: '#111111',
  Blue: '#1e90ff',
  Brown: '#754113',
  Gray: '#e0e0e0',
  Green: '#008000',
  Red: '#c62828',
  White: '#ffffff',
  Ivory: '#faf8d9',
  Beige: '#e8d3b9',
  Orange: '#ff5722',
  Pink: '#e91e63',
  Purple: '#9c27b0',
  Yellow: '#ffeb3b',
  Silver: '#a8a9ad',
  Gold: '#cfa240',
};

const Color = (color: string) => {
  if (colors.hasOwnProperty(color)) {
    color = colors[color];
  } else if (!color) {
    color = 'transparent';
  }
  return color;
};

const ColorBox: React.FC<IColorBox> = ({ color }) => {
  color = Color(color);
  let style: any = { backgroundColor: color };
  if (color.indexOf('linear-gradient') === 0) {
    style = { background: color };
  }
  return color === 'None' ? (
    <></>
  ) : (
    <span style={style} className={styles.colorbox}></span>
  );
};

export default ColorBox;

import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import styles from './styles.module.scss';
import { useWindowDimensions } from '../../common/useWindowDimension';

type GridProps = {
  columns: number;
  gridGap?: number;
  maxCol?: number;
};

const Grid: React.FC<GridProps> = ({
  children,
  columns,
  gridGap = 10,
  maxCol = 10,
}) => {
  const maxColumn = columns > maxCol ? maxCol : columns;
  let cols = Math.floor(useWindowDimensions().width / 120) || columns;
  return (
    <MuiGrid container>
      <ul
        className={styles.itemGrid}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${
            cols > maxColumn ? maxColumn : cols
          }, 1fr)`,
          gridGap: gridGap,
          //maxWidth: '1200px',
          margin: `${gridGap}px 0`,
        }}
      >
        {children}
      </ul>
    </MuiGrid>
  );
};

export default Grid;

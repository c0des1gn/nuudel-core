import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import styles from './styles.module.scss';
import { useWindowDimensions } from '../../common/useWindowDimension';

type GridProps = {
  columns: number;
};

const Grid: React.FC<GridProps> = ({ children, columns }) => {
  const maxColumn = columns > 10 ? 10 : columns;
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
          gridGap: 10,
          //maxWidth: '1200px',
          margin: '10px 0',
        }}
      >
        {children}
      </ul>
    </MuiGrid>
  );
};

export default Grid;

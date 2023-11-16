import React, { forwardRef, HTMLAttributes, CSSProperties } from 'react';
import { DragHandle, RemoveItem } from './SortableItem';
import styles from './styles.module.scss';

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string | number;
  item: any;
  total?: number;
  width?: number;
  height?: number;
  withOpacity?: boolean;
  isDragging?: boolean;
  onRemove?(id: string | number);
};

const Item = forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      item,
      withOpacity,
      isDragging,
      style,
      width = 100,
      height = 100,
      total = 1,
      ...props
    },
    ref
  ) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? '0.5' : '1',
      transformOrigin: '50% 50%',
      height: `${width}px`,
      width: `${height}px`,
      maxWidth: `${width}px`,
      maxHeight: `${height}px`,
      borderRadius: '0px',
      //cursor: !isDragging ? 'grab' : 'grabbing',
      backgroundColor: '#fff',
      backgroundImage: `url("${item?.uri || '/images/placeholder.png'}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: isDragging
        ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px'
        : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px',
      transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      ...style,
    };

    return (
      <div ref={ref} style={inlineStyles} {...props}>
        <div className={styles.actionButtons}>
          <RemoveItem id={item?.uri} />
          {total > 1 && <DragHandle />}
        </div>
      </div>
    );
  }
);

export default Item;

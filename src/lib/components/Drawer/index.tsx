import React, { useEffect, useRef } from 'react';
import { SwipeableDrawer, SwipeableDrawerProps } from '@mui/material';
import clsx from 'clsx';
import { isIOS } from 'react-device-detect';
import styles from './styles.module.scss';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface IDrawerProps extends SwipeableDrawerProps {
  anchor: Anchor;
  style?: any;
}

export const Drawer: React.FC<IDrawerProps> = ({ children, ...props }) => {
  const { anchor = 'right' } = props;
  const [open, setOpen] = React.useState(props.open === true);

  const toggleDrawer =
    (extend: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpen(extend);
      if (extend && props.onOpen) {
        props.onOpen(event);
      } else if (!extend && props.onClose) {
        props.onClose(event);
      }
    };

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current && props.open !== open) {
      setOpen(!open);
    }
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
  }, [props.open]);

  return (
    <div>
      <SwipeableDrawer
        {...props}
        anchor={anchor}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
      >
        <div
          className={clsx(styles.list, {
            [styles.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
        >
          {children}
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Drawer;

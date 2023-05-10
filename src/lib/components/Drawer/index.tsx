import React, { useEffect, useRef } from 'react';
import { SwipeableDrawer, SwipeableDrawerProps } from '@mui/material';
import clsx from 'clsx';
import { isIOS } from 'react-device-detect';
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    list: {
      width: 300,
      overflowX: 'hidden',
      height: '100%',
    },
    fullList: {
      width: 'auto',
    },
  };
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface IDrawerProps extends SwipeableDrawerProps {
  anchor: Anchor;
  style?: any;
}

export const Drawer: React.FC<IDrawerProps> = ({ children, ...props }) => {
  const { anchor = 'right' } = props;
  const { classes } = useStyles();
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
    } else didMountRef.current = true;
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
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
        >
          {children}
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Drawer;

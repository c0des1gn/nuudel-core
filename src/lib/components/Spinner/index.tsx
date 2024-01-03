import React, { FC } from 'react';
import {
  CircularProgress,
  CircularProgressProps,
  Backdrop,
} from '@mui/material';

interface IProps extends CircularProgressProps {
  overflowHide?: boolean;
  clickClose?: boolean;
}

const Spinner: FC<IProps> = ({ overflowHide, ...props }) => {
  const { clickClose = false, size = 48 } = props;
  const [open, setOpen] = React.useState(true);
  const [isSSR, setIsSSR] = React.useState(true);
  const handleClose = () => {
    if (clickClose) setOpen(false);
  };

  React.useEffect(() => {
    setIsSSR(false);
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  return isSSR ? null : !overflowHide ? (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -(Number(size) / 2),
        marginLeft: -(Number(size) / 2),
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress {...props} />
    </div>
  ) : (
    <div>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff',
        }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress {...props} />
      </Backdrop>
    </div>
  );
};

export default Spinner;

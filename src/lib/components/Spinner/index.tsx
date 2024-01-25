import React, { FunctionComponent } from 'react';
import {
  CircularProgress,
  CircularProgressProps,
  Backdrop,
} from '@mui/material';

interface IProps extends CircularProgressProps {
  overflowHide?: boolean;
  clickClose?: boolean;
}

const Spinner: FunctionComponent<IProps> = ({ overflowHide, ...props }) => {
  const { clickClose = false, size = 48 } = props;
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    if (clickClose) setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return !overflowHide ? (
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

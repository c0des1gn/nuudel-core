import React, { FunctionComponent, useRef, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { t } from '../../loc/i18n';

export interface IDialogProps {
  title: string;
  description: string;
  show: boolean;
  onOpen?(): void;
  onClose?(): void;
  onSubmit?(): void;
}

const MessageBox: FunctionComponent<IDialogProps> = ({ ...props }) => {
  const { description = '', show = false } = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (props.onOpen) {
      props.onOpen();
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
    setOpen(false);
  };

  const handleSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit();
    }
    setOpen(false);
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current && show && !open) {
      handleClickOpen();
    } else didMountRef.current = true;
  }, [show]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('No')}
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            {t('Yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MessageBox;

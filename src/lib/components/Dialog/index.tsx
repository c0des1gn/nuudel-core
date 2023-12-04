import React, { FC, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { Button } from '../';
import { t } from '../../loc/i18n';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SxProps, Theme } from '@mui/material';

const sxstyle: Record<string, SxProps<Theme> | undefined> = {
  root: (theme) => ({
    margin: 0,
    padding: theme.spacing(2),
  }),
  closeButton: {
    //color: theme.palette.grey[500],
  },
  title: (theme) => ({
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    backgroundColor: theme.palette.primary.main,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.palette.common.white,
  }),
  dialogContent: (theme) => ({
    padding: theme.spacing(1),
  }),
};

export interface IDialogProps extends DialogProps {
  title: string;
  children?: any;
  //show: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onOpen?(): void;
  onClose?(): void;
  onSubmit?(e?: any): void;
}

const DialogBasic: FC<IDialogProps> = ({ children, ...props }) => {
  //const { show = false } = props;
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

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current && props.open && !open) {
      handleClickOpen();
    } else if (didMountRef.current && !props.open && open) {
      handleClose();
    } else didMountRef.current = true;
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-content"
        maxWidth={props.maxWidth}
        fullWidth={props.fullWidth}
        fullScreen={props.fullScreen}
      >
        <DialogTitle id="alert-dialog-title" sx={sxstyle.title}>
          {props.title}
          <IconButton
            aria-label="close"
            sx={sxstyle.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent id="alert-dialog-content" sx={sxstyle.dialogContent}>
          <div
            style={{
              display: 'flex',
              overflowY: 'auto',
              justifyContent: 'center',
            }}
          >
            {children}
          </div>
        </DialogContent>
        {!!props.onSubmit && (
          <DialogActions>
            <Button onClick={props.onSubmit} color="primary">
              {t('Done')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
};

export default DialogBasic;

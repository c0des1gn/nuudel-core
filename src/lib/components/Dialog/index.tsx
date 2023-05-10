import React, { FunctionComponent, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogActions,
  DialogTitle,
  Theme,
} from '@mui/material';
import { Button } from '../';
import { t } from '../../loc/i18n';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      //color: theme.palette.grey[500],
    },
    content: {
      display: 'flex',
      overflowY: 'auto',
      justifyContent: 'center',
    },
    title: {
      boxShadow:
        '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
      backgroundColor: theme.palette.primary.main,
      zIndex: 1,
    },
    dialogContent: {
      padding: theme.spacing(1),
    },
  };
});

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

const DialogBasic: FunctionComponent<IDialogProps> = ({
  children,
  ...props
}) => {
  const { classes } = useStyles();
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
        <DialogTitle id="alert-dialog-title" className={classes.title}>
          {props.title}
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          id="alert-dialog-content"
          className={classes.dialogContent}
        >
          <div className={classes.content}>{children}</div>
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

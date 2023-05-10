import React, { FunctionComponent } from 'react';
import { Alert, AlertTitle, AlertProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Collapse } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export type MessageBarType = 'error' | 'warning' | 'info' | 'success';

interface IMessageBarProps extends AlertProps {
  messageBarType: MessageBarType;
  title?: string;
}

export interface INotificationMessages extends AlertProps {
  text: string;
  type: MessageBarType;
  title?: string;
  duration: number;
}

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  };
});

export const MessageBar: FunctionComponent<IMessageBarProps> = ({
  children,
  messageBarType,
  title,
  onClose,
  ...props
}) => {
  const { classes } = useStyles();
  const [open, setOpen] = React.useState(true);
  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          {...props}
          severity={messageBarType}
          onClose={(e) => {
            if (onClose) {
              onClose(e);
              setOpen(false);
            }
          }}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {children}
        </Alert>
      </Collapse>
    </div>
  );
};

export default MessageBar;

import React, { FunctionComponent } from 'react';
import { Alert, AlertTitle, AlertProps } from '@mui/material';
import { Collapse } from '@mui/material';
import styles from './styles.module.scss';

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

export const MessageBar: FunctionComponent<IMessageBarProps> = ({
  children,
  messageBarType,
  title,
  onClose,
  ...props
}) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className={styles.container}>
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

import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles.module.scss';
import { t } from 'nuudel-utils';

const ErrorStyles = (props: any) => (
  <div className={styles.errormsg}>{props.children}</div>
);

const DisplayError = ({ ...props }) => {
  const { error = {} } = props;
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason?) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (!error || !error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    ));
  }
  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        <strong>{'Shoot!'}</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
              {t('UNDO')}
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </ErrorStyles>
  );
};

export default DisplayError;

import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Message = () => {
  const { data, error, loading } = useQuery(SNACKBAR_STATE_QUERY);
  const [toggleSnackBar] = useMutation(TOGGLE_SNACKBAR_MUTATION);
  if (!loading && data) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={Boolean(data?.snackBarOpen)}
        autoHideDuration={6000}
        onClose={() =>
          toggleSnackBar({ variables: { msg: '', type: 'success' } })
        }
      >
        <Alert
          onClose={() =>
            toggleSnackBar({ variables: { msg: '', type: 'success' } })
          }
          severity={data.snackType}
        >
          {data.snackMsg}
        </Alert>
      </Snackbar>
    );
  } else {
    return <></>;
  }
};

const TOGGLE_SNACKBAR_MUTATION = gql`
  mutation toggleSnackBar {
    toggleSnackBar(msg: $msg, type: $type) @client
  }
`;

const SNACKBAR_STATE_QUERY = gql`
  query snackbar {
    snackBarOpen @client
    snackMsg @client
    snackType @client
    isLeftDrawerOpen @client
    leftDrawerWidth @client
    isConnected @client
  }
`;

export default Message;
export { SNACKBAR_STATE_QUERY, TOGGLE_SNACKBAR_MUTATION };

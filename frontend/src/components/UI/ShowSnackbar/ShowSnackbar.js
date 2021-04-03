// components/SuccessSnackbar.js or whatever you wanna call it
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { clearSnackbar } from "../../../store/actions/snackbarActions";

export default function ShowSnackbar() {
  const dispatch = useDispatch();

  const { snackbarMessage, successSnackbarOpen, errorSnackbarOpen, infoSnackbarOpen } = useSelector(
    state => state.uiReducer
  );

  function handleClose() {
    dispatch(clearSnackbar());
  }

  function Alert(props) {
    const wrapper = React.createRef();
    return <MuiAlert elevation={6} variant="filled" {...props} ref={wrapper} />;
  }

  let isOpen = false;
  let isType = 'success';
  if(successSnackbarOpen) {
    isOpen = true;
    isType = 'success';
  } else if(errorSnackbarOpen) {
    isOpen = true;
    isType = 'error';
  } else if(infoSnackbarOpen) {
    isOpen = true;
    isType = 'info';
  }
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={isType}>
        {snackbarMessage}
        </Alert>
    </Snackbar>
  );
}
// reducers/uiReducer.js
const defalutState = {
    successSnackbarOpen: false,
    errorSnackbarOpen: false,
    infoSnackbarOpen: false,
    snackbarMessage: '',
};

const uiReducer = (state = defalutState, action) => {
    switch (action.type) {
        case "SNACKBAR_SUCCESS":
            return {
            ...state,
            successSnackbarOpen: true,
            snackbarMessage: action.message
            };
        case "SNACKBAR_ERROR":
            return {
              ...state,
              errorSnackbarOpen: true,
              snackbarMessage: action.message
            };
        case "SNACKBAR_INFO":
            return {
                ...state,
                infoSnackbarOpen: true,
                snackbarMessage: action.message
            };
        case "SNACKBAR_CLEAR":
            return {
            ...state,
            snackbarMessage: '',
            successSnackbarOpen: false,
            errorSnackbarOpen: false,
            infoSnackbarOpen: false
            };
        default:
        return state;
    }
  };
  
  export default uiReducer;
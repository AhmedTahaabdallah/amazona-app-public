import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';
import { setlocalStorageItem } from '../../shared/utility';

export const resetSignMsgError = () => {
    return {
        type: actionTypes.USER_SIGNIN_RESETSIGNMSGERROR
    };
};

export const signinStart = () => {
    return {
        type: actionTypes.USER_SIGNIN_START
    };
};

export const signinSuccess = (userData, msg) => {
    setlocalStorageItem('userData', userData);
    return {
        type: actionTypes.USER_SIGNIN_SUCCESS,
        userData: userData,
        msg: msg
    };
};

export const signinFail = (msg) => {
    return {
        type: actionTypes.USER_SIGNIN_FAIL,
        msg: msg
    };
};

export const signin = (email, password) => {
    return async(dispatch) => {
        try{
            dispatch(signinStart());
            const {data} = await axios.post('/api/users/signin', { email, password});
            if(data.message) {
                dispatch(signinSuccess(null, data.message));
            } else {
                dispatch(signinSuccess(data, 'success Signin..'));
            }       
        } catch(err) {
            dispatch(signinFail(err.response && err.response.data.message ? err.response.data.message : err.message));
        }  
    };
};

export const registerStart = () => {
    return {
        type: actionTypes.USER_REGISTER_START
    };
};

export const registerSuccess = (userData, msg) => {
    setlocalStorageItem('userData', userData);
    return {
        type: actionTypes.USER_REGISTER_SUCCESS,
        userData: userData,
        msg: msg
    };
};

export const registerFail = (msg) => {
    return {
        type: actionTypes.USER_REGISTER_FAIL,
        msg: msg
    };
};

export const register = (name, email, password) => {
    return async(dispatch) => {
        try{
            dispatch(registerStart());
            const {data} = await axios.post('/api/users/register', { name, email, password});
            if(data.message) {
                dispatch(registerSuccess(null, data.message));
            } else {
                dispatch(registerSuccess(data, 'success Register..'));
            }       
        } catch(err) {
            dispatch(registerFail(err.response && err.response.data.message ? err.response.data.message : err.message));
        }  
    };
};

export const resetMsgError = () => {
    return {
        type: actionTypes.USER_SIGNIN_RESETMSGERROR
    };
};

export const userDetails = (userId) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.USER_DETILS_START });
        try{
            //const { user: { user }} = getState();
            const {data} = await axios.get(`/api/users/${userId}`,
            /*{
                headers: {
                    Authorization: user.token
                }
            }*/);
            if(data.message) {
                dispatch({ 
                    type: actionTypes.USER_DETILS_FAIL, 
                    msg: data.message 
                });              
            } else {                
                dispatch({ 
                    type: actionTypes.USER_DETILS_SUCCESS, 
                    user: data,
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.USER_DETILS_FAIL, 
                msg:  errMsg
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg: errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}

export const resetUpdateUserProfileMsgError = () => {
    return {
        type: actionTypes.USER_UPDATE_PROFILE_RESETMSGERROR
    };
};

export const updateUserProfile = (userData) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.USER_UPDATE_PROFILE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.put(`/api/users/profile`, userData,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.user) {
                dispatch({ 
                    type: actionTypes.USER_UPDATE_PROFILE_SUCCESS, 
                    user: data.user,
                    oldUser: user,
                    msg: data.message, 
                });                            
            } else {                
                dispatch({ 
                    type: actionTypes.USER_UPDATE_PROFILE_FAIL, 
                    msg: data.message 
                });  
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.USER_UPDATE_PROFILE_FAIL, 
                msg: errMsg
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg: errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}

export const signout = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.USER_SIGNOUT
        });
    };
};

export const listUsers = ({
    pageNumber = 1,
    loadMore
}) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.USERS_LIST_START, loadMore: loadMore });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.get(`/api/users/?pageNumber=${pageNumber}`,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.message) {
                dispatch({ 
                    type: actionTypes.USERS_LIST_FAIL, 
                    msg: data.message,
                    loadMore: loadMore
                });              
            } else {                
                dispatch({ 
                    type: actionTypes.USERS_LIST_SUCCESS, 
                    users: data.users,
                    page: data.page,
                    pages: data.pages,
                    usersCount: data.count,
                    loadMore: loadMore
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.USERS_LIST_FAIL, 
                msg: errMsg,
                loadMore: loadMore
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg: errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}

export const resetDeleteUserMsgError = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.USERS_DELETE_RESET
        });
    };
};

export const deleteUser = (userId) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.USERS_DELETE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.delete(`/api/users/${userId}`,
            {
                headers: {
                    Authorization: user.token
                }
            });
            dispatch({ 
                type: actionTypes.USERS_DELETE_SUCCESS, 
                userId: userId,
                msg: data.message 
            });     
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.USERS_DELETE_FAIL, 
                msg: errMsg
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg: errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}

export const editUser = (userData) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.USERS_UPDATE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.put(`/api/users/${userData.id}`, userData,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.user) {
                dispatch({ 
                    type: actionTypes.USERS_UPDATE_SUCCESS, 
                    user: data.user,
                    msg: data.message, 
                });                            
            } else {                
                dispatch({ 
                    type: actionTypes.USERS_UPDATE_FAIL, 
                    msg: data.message 
                });  
            }  
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.USERS_UPDATE_FAIL, 
                msg: errMsg
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg: errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}
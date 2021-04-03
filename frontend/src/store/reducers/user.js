import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
import { setlocalStorageItem } from '../../shared/utility';

const initState = {
    page: null,
    pages: null,
    usersCount: null,
    loadMore: false,
    user: null,    
    signLoading: false,
    signError: false,
    signMsg: null,
    resultUser: null,
    loading: false,
    error: false,
    msg: null,
    updateLoading: false,
    updateError: false,
    updateMsg: null,
    users: [],
    usersLoading: true,
    usersError: false,
    usersMsg: null,
    deleteLoading: false,
    deleteError: false,
    deleteMsg: null,
};

const resetSignMsgError = (state) => {
    return updateObject(state, { 
        signError: false, 
        signMsg: null, 
    });
};

const signinStart = (state) => {
    return updateObject(state, { 
        signLoading: true, 
        user: null, 
        signError: false, 
        signMsg: null, 
    });
};

const signinSuccess = (state, action) => {
    window.scrollTo(0, 0);
    return updateObject(state, { signLoading: false, user: action.userData, signError: false, signMsg: action.msg, });
};

const signinFail = (state, action) => {
    return updateObject(state, { signLoading: false, user: null, signError: true, signMsg: action.msg, });
};

const registerStart = (state) => {
    return updateObject(state, { 
        signLoading: true, 
        user: null, 
        signError: false, 
        signMsg: null, });
};

const registerSuccess = (state, action) => {
    window.scrollTo(0, 0);
    return updateObject(state, { signLoading: false, user: action.userData, signError: false, signMsg: action.msg, });
};

const registerFail = (state, action) => {
    return updateObject(state, { signLoading: false, user: null, signError: true, signMsg: action.msg, });
};

const resetMsgError = (state) => {
    return updateObject(state, { 
        error: false, 
        msg: null, });
};

const userDetailsStart = (state) => {
    return updateObject(state, { 
        resultUser: null,
        loading: true, 
        error: false, 
        msg: null, 
    });
};

const userDetailsSuccess = (state, action) => {  
    window.scrollTo(0, 0);
    if(state.user && state.user._id === action.user._id) {
        const oldUser = { ...state.user };
        const newUser = { 
            _id: action.user._id,
            token: oldUser.token,
            name: action.user.name,
            email: action.user.email,
            isAdmin: action.user.isAdmin,
            isSeller: action.user.isSeller,
            sellerLogo: action.user.seller.logo,
            image: action.user.image,
        };
        setlocalStorageItem('userData', newUser);
        return updateObject(state, { loading: false, resultUser: action.user, user: newUser, error: false, msg: null, });
    } else {
        return updateObject(state, { loading: false, resultUser: action.user, error: false, msg: null, });
    }    
};

const userDetailsFail = (state, action) => {
    return updateObject(state, { resultUser: null, loading: false, error: true, msg: action.msg, });
};

const updateUserProfileResetMsgError = (state) => {
    return updateObject(state, { 
        updateError: false, 
        updateMsg: null, 
    });
};

const updateUserProfileStart = (state) => {
    return updateObject(state, { 
        updateLoading: true, 
        updateError: false, 
        updateMsg: null, 
    });
};

const updateUserProfileSuccess = (state, action) => {    
    const oldUser = { ...action.oldUser };
    const newUser = { ...action.user };    
    newUser.token = oldUser.token;
    delete newUser['seller']
    setlocalStorageItem('userData', newUser);
    return updateObject(state, { updateLoading: false, resultUser: action.user, user: newUser, updateError: false, updateMsg: action.msg, });
};

const updateUserProfileFail = (state, action) => {
    return updateObject(state, { updateLoading: false, updateError: true, updateMsg: action.msg, });
};

const signout = (state, action) => {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('userData');
    if(action.msg) {
        return updateObject(state, { user: null, signError: true, signMsg: action.msg,});
    } else {
        return updateObject(state, { user: null,});
    }    
};

const usersListStart = (state, action) => {
    let finalState = { 
        page: null,
        pages: null,
        usersCount: null,        
        users: [],
        usersLoading: true,
        usersError: false,
        usersMsg: null,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            loadMore: true,
        };
    }
    return updateObject(state, finalState);
};

const usersListSuccess = (state, action) => {
    let finalState = { 
        page: action.page,
        pages: action.pages,
        usersCount: action.usersCount,       
        users: action.users,
        usersLoading: false,
        usersError: false,
        usersMsg: null,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            page: action.page,
            pages: action.pages,
            usersCount: action.usersCount,       
            loadMore: false,
            users: action.users,
        };
    }
    return updateObject(state, finalState);
};

const usersListFail = (state, action) => {
    let finalState = { 
        page: null,
        pages: null,
        usersCount: null,        
        users: [],
        usersLoading: false,
        usersError: true,
        usersMsg: action.msg,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            loadMore: false,
            usersError: true,
            usersMsg: action.msg,
        };
    }
    return updateObject(state, finalState);
};

const deleteUserReset = (state) => {
    return updateObject(state, { 
        deleteError: false,
        deleteMsg: null,
    });
};

const deleteUserStart = (state) => {
    return updateObject(state, { 
        deleteLoading: true,
        deleteError: false,
        deleteMsg: null,
    });
};

const deleteUserSuccess = (state, action) => {
    if(state.users.length > 0) {
        const index = state.users.findIndex(userr => userr._id === action.userId);
        const users = state.users;
        if(index >= 0) {
            users.splice(index, 1);
        }
        return updateObject(state, { 
            users: users, 
            deleteLoading: false,
            deleteError: false,
            deleteMsg: action.msg,
        });
    } else {
        return updateObject(state, { 
            deleteLoading: true,
            deleteError: false,
            deleteMsg: action.msg,
        });
    }  
};

const deleteUserFail = (state, action) => {
    return updateObject(state, { 
        deleteLoading: false,
        deleteError: true,
        deleteMsg: action.msg,
    });
};

const editUserStart = (state) => {
    return updateObject(state, { 
        updateLoading: true,
        updateError: false,
        updateMsg: null,
    });
};

const editUserSuccess = (state, action) => {
    if(state.users.length > 0) {
        const index = state.users.findIndex(userr => userr._id === action.user._id);
        const users = state.users;
        if(index >= 0) {
            users[index] = action.user;
        }
        return updateObject(state, { 
            users: users, 
            updateLoading: false,
            updateError: false,
            updateMsg: action.msg,
        });
    } else {
        return updateObject(state, { 
            updateLoading: false,
            updateError: false,
            updateMsg: action.msg,
        });
    }  
};

const editUserFail = (state, action) => {
    return updateObject(state, { 
        updateLoading: false,
        updateError: true,
        updateMsg: action.msg,
    });
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.USER_SIGNIN_RESETSIGNMSGERROR: return resetSignMsgError(state);
        case actionTypes.USER_SIGNIN_START: return signinStart(state);
        case actionTypes.USER_SIGNIN_SUCCESS: return signinSuccess(state, action);
        case actionTypes.USER_SIGNIN_FAIL: return signinFail(state, action);    
        case actionTypes.USER_REGISTER_START: return registerStart(state);
        case actionTypes.USER_REGISTER_SUCCESS: return registerSuccess(state, action);
        case actionTypes.USER_REGISTER_FAIL: return registerFail(state, action);   
        case actionTypes.USER_SIGNIN_RESETMSGERROR: return resetMsgError(state);          
        case actionTypes.USER_DETILS_START: return userDetailsStart(state);
        case actionTypes.USER_DETILS_SUCCESS: return userDetailsSuccess(state, action);
        case actionTypes.USER_DETILS_FAIL: return userDetailsFail(state, action);             
        case actionTypes.USER_UPDATE_PROFILE_RESETMSGERROR: return updateUserProfileResetMsgError(state);    
        case actionTypes.USER_UPDATE_PROFILE_START: return updateUserProfileStart(state);
        case actionTypes.USER_UPDATE_PROFILE_SUCCESS: return updateUserProfileSuccess(state, action);
        case actionTypes.USER_UPDATE_PROFILE_FAIL: return updateUserProfileFail(state, action);
        case actionTypes.USERS_LIST_START: return usersListStart(state, action);
        case actionTypes.USERS_LIST_SUCCESS: return usersListSuccess(state, action);
        case actionTypes.USERS_LIST_FAIL: return usersListFail(state, action);
        case actionTypes.USERS_DELETE_RESET: return deleteUserReset(state);
        case actionTypes.USERS_DELETE_START: return deleteUserStart(state);
        case actionTypes.USERS_DELETE_SUCCESS: return deleteUserSuccess(state, action);
        case actionTypes.USERS_DELETE_FAIL: return deleteUserFail(state, action); 
        case actionTypes.USERS_UPDATE_START: return editUserStart(state);
        case actionTypes.USERS_UPDATE_SUCCESS: return editUserSuccess(state, action);
        case actionTypes.USERS_UPDATE_FAIL: return editUserFail(state, action);           
        case actionTypes.USER_SIGNOUT: return signout(state, action);    
        default: return state;
    }
};

export default reducer;
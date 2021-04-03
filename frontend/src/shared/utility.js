import * as actionTypes from '../store/actions/actionTypes';

import * as CryptoJS from 'crypto-js';
import dateFormat from 'dateformat';

export const updateObject = (oldObject, updatedPropertis) => {
    return {
        ...oldObject,
        ...updatedPropertis
    };
};

export const setHashString = (value, isJson = true) => {
    let resultStr = value;
    if(isJson) {
        resultStr = JSON.stringify(value);
    }
    const ciphertext = CryptoJS.AES.encrypt(resultStr, 'secret key 2021').toString();
    return ciphertext;
};

export const getHashString = (value, isJson = true) => {
    const bytes  = CryptoJS.AES.decrypt(value, 'secret key 2021');
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    let finalResult = originalText;
    if(isJson) {
        finalResult = JSON.parse(originalText);
    }    
    return finalResult;
};

export const setlocalStorageItem = (key, value, isJson = true) => {
    const result = setHashString(value, isJson);
    localStorage.setItem(key, result);
};

export const getlocalStorageItem = (key, isJson = true) => {
    const result = localStorage.getItem(key);
    if(!result) {
        return null;
    }
    const result2 = getHashString(result, isJson);
    return result2;
};

export const getDateFormat = (date, format) => {
    return dateFormat(date, format ? format : "dddd, mmmm dS yyyy, h:MM TT");
};

export const initAllLoading = (dispatch, key = '') => {
    if(!key.includes('intiHomeScreen')) {
        dispatch({ type: actionTypes.HOME_SCREEN_LIST_START});
    }
    if(!key.includes('intiOrders')) {
        dispatch({ type: actionTypes.ORDER_MINE_LIST_START});
    }
    if(!key.includes('intiOrderDetails')) {
        dispatch({ type: actionTypes.ORDER_DETAILS_START});
    }
    if(!key.includes('intiProducts')) {
        dispatch({ type: actionTypes.FETCH_PRODUCTS_START});
    }
    if(!key.includes('intiSellerProducts')) {
        dispatch({ type: actionTypes.FETCH_PRODUCTS_START, typee: 'seller'});
    }
    if(!key.includes('intiProductDetails')) {
        dispatch({ type: actionTypes.FETCH_ONEPRODUCT_START});
    }
    if(!key.includes('intiUserDetails')) {
        dispatch({ type: actionTypes.USER_DETILS_START});
    }
    if(!key.includes('intiUsersList')) {
        dispatch({ type: actionTypes.USERS_LIST_START});
    }
};

export const prices = [
    {
        name: 'All',
        min: 0,
        max: 0
    },
    {
        name: '$1 to $10',
        min: 1,
        max: 10
    },
    {
        name: '$10 to $100',
        min: 10,
        max: 100
    },
    {
        name: '$100 to $1000',
        min: 100,
        max: 1000
    },
    {
        name: '$1000 to $10000',
        min: 1000,
        max: 10000
    },
    {
        name: '$10000 to $100000',
        min: 10000,
        max: 100000
    },
    {
        name: '$100000 to $1000000',
        min: 100000,
        max: 1000000
    },
];

export const ratings = [
    {
        name: '0stars & up',
        rating: 0
    },
    {
        name: '1stars & up',
        rating: 1
    },
    {
        name: '2stars & up',
        rating: 2
    },    
    {
        name: '3stars & up',
        rating: 3
    },
    {
        name: '4stars & up',
        rating: 4
    },    
];
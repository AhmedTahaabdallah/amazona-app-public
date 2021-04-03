import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';

export const fetchProductStart = () => {
    return {
        type: actionTypes.FETCH_ONEPRODUCT_START
    };
};

export const fetchProductSuccess = (product) => {
    return {
        type: actionTypes.FETCH_ONEPRODUCT_SUCCESS,
        product: product
    };
};

export const fetchProductFail = (msg) => {
    return {
        type: actionTypes.FETCH_ONEPRODUCT_FAIL,
        msg: msg
    };
};

export const fetchProduct = (id) => {
    return async(dispatch) => {
        try{
            dispatch(fetchProductStart());
            const {data} = await axios.get('/api/products/' + id);
            dispatch(fetchProductSuccess(data));
        } catch(err) {
            dispatch(fetchProductFail(err.response && err.response.data.message ? err.response.data.message : err.message));
        }  
    };
};

export const createReviewReset = () => {
    return {
        type: actionTypes.REVIEW_CREATE_RESET
    };
};

export const createReview = (productId, review) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.REVIEW_CREATE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.post(`/api/products/${productId}/reviews`, review, 
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.reviews) {
                dispatch({ 
                    type: actionTypes.REVIEW_CREATE_SUCCESS, 
                    reviews: data.reviews, 
                    numReviews: data.numReviews, 
                    rating: data.rating, 
                    msg: data.message  
                });  
                dispatch({ type: actionTypes.HOME_SCREEN_LIST_RELOADING, value: true});
                dispatch({ type: actionTypes.SEARCH_RELOADING, value: true});
                dispatch({ type: actionTypes.SELLER_RELOADING, value: true});                             
            } else {
                dispatch({ 
                    type: actionTypes.REVIEW_CREATE_FAIL, 
                    msg: data.message 
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.REVIEW_CREATE_FAIL, 
                msg:  errMsg
            });
            if(err.response && err.response.status && err.response.status === 401) {                
                dispatch({
                    type: actionTypes.USER_SIGNOUT,
                    msg:  errMsg
                });
                dispatch({ 
                    type: actionTypes.CART_EMPTY_ITEM, 
                    isEmptyShippingAddres: true 
                });
            }            
        }  
    };
}
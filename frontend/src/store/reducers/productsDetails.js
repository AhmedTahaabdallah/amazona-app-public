import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initState = {
    product: null,  
    loading: false,
    error: false,
    msg: null,
    createReviewLoading: false,
    createReviewError: false,
    createReviewMsg: null,
};

const productStart = (state) => {
    return updateObject(state, { loading: true, product: null, error: false, msg: null, });
};

const productSuccess = (state, action) => {
    window.scrollTo(0, 0);
    return updateObject(state, { loading: false, product: action.product, error: false, msg: null, });
};

const productFail = (state, action) => {
    return updateObject(state, { loading: false, product: null, error: true, msg: action.msg, });
};

const createReviewStart = (state) => {
    return updateObject(state, { 
        createReviewLoading: true,
        createReviewError: false,
        createReviewMsg: null,
     });
};

const createReviewSuccess = (state, action) => {
    const oldProduct = state.product;
    if(oldProduct) {
        oldProduct.reviews = action.reviews;
        oldProduct.numReviews = action.numReviews;
        oldProduct.rating = action.rating;
    }
    return updateObject(state, { 
        product: oldProduct,
        createReviewLoading: false,
        createReviewError: false,
        createReviewMsg: action.msg, 
    });
};

const createReviewFail = (state, action) => {
    return updateObject(state, { 
        createReviewLoading: false,
        createReviewError: true,
        createReviewMsg: action.msg, 
    });
};

const createReviewReset = (state, action) => {
    return updateObject(state, { 
        createReviewError: false,
        createReviewMsg: null, 
    });
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_ONEPRODUCT_START: return productStart(state);
        case actionTypes.FETCH_ONEPRODUCT_SUCCESS: return productSuccess(state, action);
        case actionTypes.FETCH_ONEPRODUCT_FAIL: return productFail(state, action); 
        case actionTypes.REVIEW_CREATE_START: return createReviewStart(state);
        case actionTypes.REVIEW_CREATE_SUCCESS: return createReviewSuccess(state, action);
        case actionTypes.REVIEW_CREATE_FAIL: return createReviewFail(state, action);               
        case actionTypes.REVIEW_CREATE_RESET: return createReviewReset(state, action);               
        default: return state;
    }
};

export default reducer;
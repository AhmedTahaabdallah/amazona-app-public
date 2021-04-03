import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';

export const homScreenList = () => {
    return async(dispatch) => {
        try{
            dispatch({ type: actionTypes.HOME_SCREEN_LIST_START });
            const {data} = await axios.get(`/api/products/home-screen`);
            dispatch({ 
                type: actionTypes.HOME_SCREEN_LIST_SUCCESS,
                featuredProducts: data.featuredProducts,
                topSellers: data.topSellers,
            })
        } catch(err) {
            dispatch({ 
                type: actionTypes.HOME_SCREEN_LIST_FAIL,
                msg: err.message
            });
        }  
    };
};

export const fetchProductsStart = (typee, loadMore) => {
    return {
        type: actionTypes.FETCH_PRODUCTS_START,
        typee: typee,
        loadMore: loadMore
    };
};

export const fetchProductsSuccess = (data, typee, loadMore, listType, plusPageNumer) => {
    return {
        type: actionTypes.FETCH_PRODUCTS_SUCCESS,
        products: data.products,
        page: data.page,
        pages: data.pages,
        productsCount: data.count,
        typee: typee,
        loadMore: loadMore,
        listType: listType,
        plusPageNumer: plusPageNumer
    };
};

export const fetchProductsFail = (msg, typee, loadMore) => {
    return {
        type: actionTypes.FETCH_PRODUCTS_FAIL,
        msg: msg,
        typee: typee,
        loadMore: loadMore
    };
};

export const fetchAllProducts = ({ 
    seller = '', name = '', 
    category = '', min = 0,
    max = 0, rating = 0,
    order = '', pageNumber = 1,
    loadMore, listType = 'add',
    plusPageNumer = true
}) => {
    return async(dispatch) => {
        const type = seller.trim().length > 0 ? 'seller' 
        : order.trim().length > 0 ? 'search' : 'normal';
        try{           
            dispatch(fetchProductsStart(type, loadMore));
            const screenWidth = window.screen.width;
            const searchLoadingProducts = document.getElementById("searchLoadingProducts");
            if(searchLoadingProducts && screenWidth < 785 && type === 'search'){
                searchLoadingProducts.scrollIntoView();
            }
            const {data} = await axios.get(`/api/products?pageNumber=${pageNumber}&seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`);            
            dispatch(fetchProductsSuccess(data, type, loadMore, listType, plusPageNumer));
            const searchCutomerReviewProducts = document.getElementById("searchCutomerReviewProducts");
            if(searchCutomerReviewProducts && screenWidth < 785 && type === 'search'){
                searchCutomerReviewProducts.scrollIntoView();
            }
        } catch(err) {
            dispatch(fetchProductsFail(err.message, type, loadMore));
        }  
    };
};

export const createProductReset = () => {
    return {
        type: actionTypes.PRODUCT_CREATE_RESET
    };
};

export const createProduct = (product) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.PRODUCT_CREATE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.post('/api/products', product, 
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.product) {
                dispatch({ 
                    type: actionTypes.FETCH_PRODUCTS_RELOADING, 
                    value: true
                });  
                dispatch({ 
                    type: actionTypes.PRODUCT_CREATE_SUCCESS, 
                    product: data.product, 
                    msg: data.message  
                });                              
            } else {
                dispatch({ 
                    type: actionTypes.PRODUCT_CREATE_FAIL, 
                    msg: data.message 
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.PRODUCT_CREATE_FAIL, 
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

export const createdChangeStatus = () => {
    return {
        type: actionTypes.PRODUCT_CHANGE_STATUS
    };
};

export const updateProduct = (productId, product) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.PRODUCT_UPDATE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.put(`/api/products/${productId}`, product, 
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.product) {
                dispatch({ 
                    type: actionTypes.PRODUCT_UPDATE_SUCCESS, 
                    product: data.product, 
                    msg: data.message  
                });                              
            } else {
                dispatch({ 
                    type: actionTypes.PRODUCT_UPDATE_FAIL, 
                    msg: data.message 
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.PRODUCT_UPDATE_FAIL, 
                msg: errMsg
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

export const deleteProduct = (productId,) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.PRODUCT_DELETE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.delete(`/api/products/${productId}`, 
            {
                headers: {
                    Authorization: user.token
                }
            });
            dispatch({ 
                type: actionTypes.PRODUCT_DELETE_SUCCESS, 
                productId: productId, 
                msg: data.message  
            });         
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.PRODUCT_DELETE_FAIL, 
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
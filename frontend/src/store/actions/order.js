import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';

export const resetOrderMsgError = () => {
    return dispatch => {
        dispatch({ type: actionTypes.ORDER_CREATE_RESET });
    }
}

export const createOrder = (order) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_CREATE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.post('/api/orders', order,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.order) {
                dispatch({ 
                    type: actionTypes.ORDER_CREATE_SUCCESS, 
                    order: data.order, 
                    msg: data.message  
                });
                dispatch({ type: actionTypes.CART_EMPTY_ITEM, isEmptyShippingAddres: false });
                localStorage.removeItem('cartItems');                
            } else {
                dispatch({ 
                    type: actionTypes.ORDER_CREATE_FAIL, 
                    msg: data.message 
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_CREATE_FAIL, 
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

export const orderDetails = (orderId) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_DETAILS_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.get(`/api/orders/${orderId}`,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.message) {
                dispatch({ 
                    type: actionTypes.ORDER_DETAILS_FAIL, 
                    msg: data.message 
                });              
            } else {
                dispatch({ 
                    type: actionTypes.ORDER_DETAILS_SUCCESS, 
                    order: data,
                    msg: 'fetch orderDetails'
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_DETAILS_FAIL, 
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

export const resetOrderPayMsgError = () => {
    return dispatch => {
        dispatch({ type: actionTypes.ORDER_PAY_RESET });
    }
}

export const payOrder = (orderId, paymentResult) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_PAY_START });
        try{
            const { user: { user }} = getState();
            const url = paymentResult ? `/api/orders/${orderId}/pay` : `/api/orders/${orderId}/deliver`;
            const {data} = await axios.put(url, paymentResult && {},
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.order) {
                dispatch({ 
                    type: actionTypes.ORDER_PAY_SUCCESS, 
                    order: data.order,
                    msg: data.message
                });                          
            } else {                
                dispatch({ 
                    type: actionTypes.ORDER_PAY_FAIL, 
                    msg: data.message 
                });    
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_PAY_FAIL, 
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

export const listOrderMine = ({
    pageNumber = 1,
    loadMore
}) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_MINE_LIST_START, loadMore: loadMore });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.get(`/api/orders/mine?pageNumber=${pageNumber}`,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.message) {
                dispatch({ 
                    type: actionTypes.ORDER_MINE_LIST_FAIL, 
                    msg: data.message,
                    loadMore: loadMore
                });              
            } else {                
                dispatch({ 
                    type: actionTypes.ORDER_MINE_LIST_SUCCESS, 
                    allOrders: data.orders,
                    page: data.page,
                    pages: data.pages,
                    ordersCount: data.count,
                    loadMore: loadMore
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_MINE_LIST_FAIL, 
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

export const listOrder = ({ 
    seller = '',
    pageNumber = 1,
    loadMore
}) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_LIST_START, loadMore: loadMore });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.get(`/api/orders?seller=${seller}&pageNumber=${pageNumber}`,
            {
                headers: {
                    Authorization: user.token
                }
            });
            if(data.message) {
                dispatch({ 
                    type: actionTypes.ORDER_LIST_FAIL, 
                    msg: data.message, 
                    loadMore: loadMore
                });              
            } else {                
                dispatch({ 
                    type: actionTypes.ORDER_LIST_SUCCESS, 
                    allOrders: data.orders,
                    page: data.page,
                    pages: data.pages,
                    ordersCount: data.count,
                    loadMore: loadMore
                });
            }       
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_LIST_FAIL, 
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

export const resetDeleteOrderMsgError = () => {
    return dispatch => {
        dispatch({ type: actionTypes.ORDER_DELETE_RESET });
    }
}

export const deleteOrder = (orderId,) => {
    return async(dispatch, getState) => {
        dispatch({ type: actionTypes.ORDER_DELETE_START });
        try{
            const { user: { user }} = getState();
            const {data} = await axios.delete(`/api/orders/${orderId}`, 
            {
                headers: {
                    Authorization: user.token
                }
            });
            dispatch({ 
                type: actionTypes.ORDER_DELETE_SUCCESS, 
                orderId: orderId, 
                msg: data.message  
            });         
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.ORDER_DELETE_FAIL, 
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
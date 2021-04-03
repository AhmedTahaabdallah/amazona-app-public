import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initState = {
    page: null,
    pages: null,
    ordersCount: null,
    loadMore: false,
    allOrders: [],
    reloading: true,
    loading: true,
    error: false,
    msg: null,
    placeOrderOrder: null,
    placeOrderLoading: false,
    placeOrderError: false,
    placeOrderMsg: null,
    orderLoading: true,
    orderError: false,
    orderMsg: null,
    payLoading: false,
    payError: false,
    payMsg: null,
    deleteLoading: false,
    deleteError: false,
    deleteMsg: null,
};

const orderCreateStart = (state) => {
    return updateObject(state, { 
        placeOrderOrder: null,
        placeOrderLoading: true,
        placeOrderError: false,
        placeOrderMsg: null,
    });
};

const orderCreateSuccess = (state, action) => {
    return updateObject(state, { placeOrderLoading: false, placeOrderOrder: action.order, placeOrderError: false, placeOrderMsg: action.msg, });
};

const orderCreateFail = (state, action) => {
    return updateObject(state, { placeOrderLoading: false, placeOrderError: true, placeOrderMsg: action.msg, });
};

const orderCreateReset = (state) => {
    return updateObject(state, { placeOrderLoading: false, placeOrderOrder: null, placeOrderError: false, placeOrderMsg: null, });
};

const orderDetailsStart = (state) => {
    return updateObject(state, { 
        orderLoading: true, 
        orderError: false, 
        orderMsg: null, 
    });
};

const orderDetailsSuccess = (state, action) => {
    window.scrollTo(0, 0);
    return updateObject(state, { orderLoading: false, order: action.order, orderError: false, orderMsg: action.msg, });
};

const orderDetailsFail = (state, action) => {
    return updateObject(state, { orderLoading: false, orderError: true, orderMsg: action.msg, });
};

const orderPayStart = (state) => {
    return updateObject(state, { 
        payLoading: true,
        payError: false,
        payMsg: null,
    });
};

const orderPaySuccess = (state, action) => {
    if(state.allOrders.length > 0) {
        const index = state.allOrders.findIndex(order => order._id === action.order._id);
        const oldOrders = state.allOrders;
        if(index >= 0) {
            oldOrders[index] = action.order;
        }
        return updateObject(state, { payLoading: false, order: action.order, allOrders: oldOrders, payError: false, payMsg: action.msg, });
    } else {
        return updateObject(state, { payLoading: false, order: action.order, payError: false, payMsg: action.msg, });
    }    
};

const orderPayFail = (state, action) => {
    return updateObject(state, { payLoading: false, payError: true, payMsg: action.msg, });
};

const orderPayReset = (state) => {
    return updateObject(state, { payLoading: false, payError: false, payMsg: null, });
};

const mineOrdersReloading = (state, action) => {
    return updateObject(state, { 
        reloading: action.value, 
    });
};

const mineOrdersStart = (state, action) => {
    let finalState = { 
        page: null,
        pages: null,
        ordersCount: null,
        allOrders: [],
        reloading: true, 
        loading: true,
        error: false,
        msg: null,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            loadMore: true,
        };
    }
    return updateObject(state, finalState);
};

const mineOrdersSuccess = (state, action) => {    
    if(action.loadMore === undefined) {
        window.scrollTo(0, 0);
    }
    let finalState = { 
        page: action.page,
        pages: action.pages,
        ordersCount: action.ordersCount,
        allOrders: action.allOrders,
        loading: false,
        error: false,
        msg: null,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            loadMore: false,
            page: action.page,
            pages: action.pages,
            ordersCount: action.ordersCount,
            allOrders: action.allOrders,
        };
    }
    return updateObject(state, finalState);
};

const mineOrdersFail = (state, action) => {
    let finalState = { 
        page: null,
        pages: null,
        ordersCount: null,
        allOrders: [],
        loading: false,
        error: true,
        msg: action.msg,
    };
    if(action.loadMore !== undefined) {
        finalState = { 
            loadMore: false,
            error: true,
            msg: action.msg,
        };
    }
    return updateObject(state, finalState);
};

const deleteOrdersStart = (state) => {
    return updateObject(state, { 
        deleteLoading: true,
        deleteError: false,
        deleteMsg: null,
    });
};

const deleteOrdersSuccess = (state, action) => {
    if(state.allOrders.length > 0) {
        const index = state.allOrders.findIndex(order => order._id === action.orderId);
        const allOrders = state.allOrders;
        if(index >= 0) {
            allOrders.splice(index, 1);
        }
        return updateObject(state, {  
            allOrders: allOrders, 
            deleteLoading: false,
            deleteError: false,
            deleteMsg: action.msg,
        });
    } else {
        return updateObject(state, { 
            deleteLoading: false,
            deleteError: false,
            deleteMsg: action.msg,
        });
    }  
};

const deleteOrdersFail = (state, action) => {
    return updateObject(state, { 
        deleteLoading: false,
        deleteError: true,
        deleteMsg: action.msg, });
};

const deleteOrdersReset = (state) => {
    return updateObject(state, { 
        deleteError: false,
        deleteMsg: null, });
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.ORDER_CREATE_START: return orderCreateStart(state);             
        case actionTypes.ORDER_CREATE_SUCCESS: return orderCreateSuccess(state, action);             
        case actionTypes.ORDER_CREATE_FAIL: return orderCreateFail(state, action);                         
        case actionTypes.ORDER_CREATE_RESET: return orderCreateReset(state,);     
        case actionTypes.ORDER_DETAILS_START: return orderDetailsStart(state);             
        case actionTypes.ORDER_DETAILS_SUCCESS: return orderDetailsSuccess(state, action);             
        case actionTypes.ORDER_DETAILS_FAIL: return orderDetailsFail(state, action); 
        case actionTypes.ORDER_PAY_START: return orderPayStart(state);             
        case actionTypes.ORDER_PAY_SUCCESS: return orderPaySuccess(state, action);             
        case actionTypes.ORDER_PAY_FAIL: return orderPayFail(state, action);                    
        case actionTypes.ORDER_PAY_RESET: return orderPayReset(state);   
        case actionTypes.ORDER_MINE_LIST_RELOADING: return mineOrdersReloading(state, action);             
        case actionTypes.ORDER_MINE_LIST_START: return mineOrdersStart(state, action);             
        case actionTypes.ORDER_MINE_LIST_SUCCESS: return mineOrdersSuccess(state, action);                    
        case actionTypes.ORDER_MINE_LIST_FAIL: return mineOrdersFail(state, action);   
        case actionTypes.ORDER_LIST_START: return mineOrdersStart(state, action);             
        case actionTypes.ORDER_LIST_SUCCESS: return mineOrdersSuccess(state, action);                    
        case actionTypes.ORDER_LIST_FAIL: return mineOrdersFail(state, action); 
        case actionTypes.ORDER_DELETE_START: return deleteOrdersStart(state);             
        case actionTypes.ORDER_DELETE_SUCCESS: return deleteOrdersSuccess(state, action);                    
        case actionTypes.ORDER_DELETE_FAIL: return deleteOrdersFail(state, action);                    
        case actionTypes.ORDER_DELETE_RESET: return deleteOrdersReset(state);                    
        default: return state;
    }
};

export default reducer;
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initState = {
    cartItems: [], 
    shippingAddress: {},
    addressMap: null,
    paymentMethod: null
};

const addToCartItem = (state, action) => {
    const item = action.item;
    const existItem = state.cartItems.find(x => x.product === item.product);
    if(existItem) {
        return updateObject(state, { cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x) });
    } else {
        return updateObject(state, { cartItems: [...state.cartItems, item] });
    }    
};

const removFromCartItem = (state, action) => {
    return updateObject(state, { cartItems: state.cartItems.filter(x => x.product !== action.productId) });  
};

const emptyCartItem = (state, action) => {
    return updateObject(state, 
        action.isEmptyShippingAddres ? 
        { cartItems: [], shippingAddress: {}, paymentMethod: null, addressMap: null }
        : { cartItems: [], paymentMethod: null, addressMap: null });  
};

const saveShippingAddress = (state, action) => {
    return updateObject(state, { shippingAddress: action.shippingAddress });  
};

const addressMapConfirm = (state, action) => {
    return updateObject(state, { addressMap: action.address });  
};

const savePaymentMethod = (state, action) => {
    return updateObject(state, { paymentMethod: action.paymentMethod });  
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.CART_ADD_ITEM: return addToCartItem(state, action);             
        case actionTypes.CART_REMOVE_ITEM: return removFromCartItem(state, action);             
        case actionTypes.CART_EMPTY_ITEM: return emptyCartItem(state, action);             
        case actionTypes.CART_SAVE_SHIPPING_ADDRESS: return saveShippingAddress(state, action);             
        case actionTypes.USER_ADDRESS_MAP_CONFIRM: return addressMapConfirm(state, action);             
        case actionTypes.CART_SAVE_PAYMENT_METHOD: return savePaymentMethod(state, action);             
        default: return state;
    }
};

export default reducer;
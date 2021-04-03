import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';
import { setlocalStorageItem } from '../../shared/utility';

const addToCartFinish = (data, qty) => {
    return {
        type: actionTypes.CART_ADD_ITEM,
        item: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            seller: data.seller,
            qty
        }
    };
}; 

export const addToCart = (productId, qty) => {
    return async(dispatch, getState) => {
        const { data } = await axios.get(`/api/products/${productId}`);
        dispatch(addToCartFinish(data, qty));
        setlocalStorageItem('cartItems', getState().cart.cartItems);
    };
}

const removeFromCartFinish = (productId) => {
    return {
        type: actionTypes.CART_REMOVE_ITEM,
        productId: productId
    };
}; 

export const removeFromCart = (productId) => {
    return async(dispatch, getState) => {
        dispatch(removeFromCartFinish(productId));
        setlocalStorageItem('cartItems', getState().cart.cartItems);
    };
}

export const emptyCart = (isEmptyShippingAddres) => {
    return async(dispatch) => {
        dispatch({
            type: actionTypes.CART_EMPTY_ITEM,
            isEmptyShippingAddres: isEmptyShippingAddres
        });
    };
}

export const saveShippingAddress = (data) => {
    return async(dispatch) => {
        dispatch({
            type: actionTypes.CART_SAVE_SHIPPING_ADDRESS,
            shippingAddress: data
        });
        setlocalStorageItem('shippingAddress', data);
    };
}

export const savePaymentMethod = (data) => {
    return async(dispatch) => {
        dispatch({
            type: actionTypes.CART_SAVE_PAYMENT_METHOD,
            paymentMethod: data
        });
    };
}
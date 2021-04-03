import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';
import Order from '../../components/Order/Order';
import { initAllLoading } from '../../shared/utility';

const PlaceOrderScreen = props => {
    const [ isInitLoading, setIsInitLoading ] = useState(false); 

    const userData = useSelector(state => state.user);
    const { user } = userData;

    const cart = useSelector(state => state.cart);
    const { cartItems, shippingAddress, paymentMethod } = cart;

    const orderCreate = useSelector(state => state.order);
    const { placeOrderOrder, placeOrderLoading, placeOrderError, placeOrderMsg } = orderCreate;

    const dispatch = useDispatch();
    const onReseOrdertMsgError = useCallback(() => dispatch(actions.resetOrderMsgError()), [ dispatch ]);
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {       
        if(placeOrderError) {
            onShowErrorSnackbar(placeOrderMsg);
            onReseOrdertMsgError();
        } else if(!placeOrderError && placeOrderMsg) {
            onShowSuccessSnackbar(placeOrderMsg);
            onReseOrdertMsgError();
        }      
    });

    useEffect(() => {        
        if(!user) {
            props.history.push('/signin?redirect=shipping');
        } else if(placeOrderOrder){
            props.history.push(`/`);
        }  else if((!cartItems || cartItems.length === 0) && !placeOrderOrder){
            props.history.push('/cart')
        } else if(!shippingAddress.address && !placeOrderOrder){
            props.history.push('/shipping')
        } else if(!paymentMethod && !placeOrderOrder){
            props.history.push('/payment')
        }  
        if(!isInitLoading) {
            setIsInitLoading(true);
            initAllLoading(dispatch); 
        }      
    }, [user, props, cartItems, shippingAddress, dispatch, isInitLoading, paymentMethod, placeOrderOrder, onReseOrdertMsgError]);

    const toPrice = num => Number(num.toFixed(2));
    cart.itemPrice = toPrice(
        cartItems.reduce((a, c) => a + (c.qty * c.price), 0)
    );
    //cart.shippingPrice = cart.itemPrice > 1000 ? toPrice(0) : toPrice(10);
    cart.taxPrice = toPrice(0.15 * cart.itemPrice);
    cart.totalPrice = cart.itemPrice /*+ cart.shippingPrice*/ + cart.taxPrice;
    cart.orderItems = cartItems;

    const placeOrderHandler = () => {
        dispatch(actions.createOrder({ ...cart, orderItems: cart.cartItems }));
    };

    let comm = <Order 
    order={cart} 
    user={user}
    placeOrderHandler={placeOrderHandler} 
    loading={placeOrderLoading}/>;
    if(!user || (user && user.isAdmin) || (!cartItems || cartItems.length === 0)){
        comm = null;
    }
    return comm;
};

export default PlaceOrderScreen;

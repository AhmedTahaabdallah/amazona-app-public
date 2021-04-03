import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';
import Order from '../../components/Order/Order';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import axios from '../../amazon-axios';
import { initAllLoading } from '../../shared/utility';

const OrderScreen = props => {
    const orderId = props.match.params.id;
    const userData = useSelector(state => state.user);
    const { user } = userData;

    const [ isFetchOrderDetails, setIsFetchOrderDetails ] = useState(false);
    const [ isStartAddSdk, setIsStartAddSdk ] = useState(false);
    const [ sdkReady, setSdkReady ] = useState(false);
    const orderDetailss = useSelector(state => state.order);
    const { orderLoading, reloading, orderError, orderMsg, payLoading, payError, payMsg, order } = orderDetailss;

    const dispatch = useDispatch();
    const onReseOrdertMsgError = useCallback(() => dispatch(actions.resetOrderMsgError()), [ dispatch ]);
    const onOrderDetails = useCallback((orderId) => dispatch(actions.orderDetails(orderId)), [ dispatch ]);
    const onReseOrderPaytMsgError = () => dispatch(actions.resetOrderPayMsgError());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=order/${orderId}`);
        }  
        if(payError) {
            onShowErrorSnackbar(payMsg);
            onReseOrderPaytMsgError();
        } else if(!payError && payMsg) {
            onShowSuccessSnackbar(payMsg);
            onReseOrderPaytMsgError();
        }    
    });
    
    useEffect(() => {        
        const addPaypalScript = async() => {
            setIsStartAddSdk(true);
            const { data } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            script.onload = () => {     
                setSdkReady(true);
                document.body.appendChild(script);
            };
            
        };
        if(user) {
            if(!isFetchOrderDetails) {
                if(reloading) {
                    initAllLoading(dispatch);
                } else {
                    initAllLoading(dispatch, 'intiOrders');
                }            
                setIsFetchOrderDetails(true);
                onReseOrdertMsgError();
                onOrderDetails(orderId);   
            } else {
                if(orderMsg) {
                    if(order && !order.isPaid && !user.isAdmin){
                        
                        if(!window.paypal && !isStartAddSdk) {
                            addPaypalScript();
                        } else {
                            setSdkReady(true);
                        }
                    }
                }
            }
        }
    }, [ onOrderDetails,  dispatch, user, reloading, orderId, order, isFetchOrderDetails, orderMsg, orderLoading, isStartAddSdk, onReseOrdertMsgError ]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(actions.payOrder(orderId, paymentResult));
    };

    const successDeliverdHandler = () => {
        dispatch(actions.payOrder(orderId));
    };

    let orderDet = null;
    if(orderLoading || !order) {
        orderDet = <LoadingBox />;
    } else if(orderError && orderMsg) {
        orderDet = <MessageBox variant='danger'>{orderMsg}</MessageBox>;
    } else {
        orderDet = <Order 
        isShipping
        user={user}
        payLoading={payLoading}
        order={order} 
        sdkReady={sdkReady} 
        successPaymentHandler={successPaymentHandler}
        successDeliverdHandler={successDeliverdHandler}
        />;
    }

    return orderDet;
};

export default OrderScreen;

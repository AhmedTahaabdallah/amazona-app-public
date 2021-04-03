import React, { useState, useEffect } from 'react';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import * as actions from '../../store/actions/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { initAllLoading } from '../../shared/utility';

const PaymentMethodScreen = props => {
    const userData = useSelector(state => state.user);
    const { user } = userData;

    const shippingAddressData = useSelector(state => state.cart);
    const { cartItems, shippingAddress } = shippingAddressData;
    
    const dispatch = useDispatch();
    const onSavePaymentMethod = (data) => dispatch(actions.savePaymentMethod(data));

    const [ isInitLoading, setIsInitLoading ] = useState(false); 
    const [ paymentMethod, setPaymentMethod ] = useState('PayPal'); 

    useEffect(() => {         
        if(!user) {
            props.history.push('/signin?redirect=shipping');
        } else if(!cartItems || cartItems.length === 0){
            props.history.push('/cart')
        } else if(!shippingAddress.address) {
            props.history.push('/shipping');
        }
        if(!isInitLoading) {
            setIsInitLoading(true);
            initAllLoading(dispatch); 
        }
    }, [ user, props, cartItems, shippingAddress, dispatch, isInitLoading]);

    const sumitHandler = (e) => {
        e.preventDefault();
        onSavePaymentMethod(paymentMethod);
        props.history.push('/placeorder');
    };
    let comm = (
        <div >
            <CheckoutSteps step1 step2 step3 />
            <div className='parent2'>
                <form className='form' onSubmit={sumitHandler}>
                    <div>
                        <h1>Payment Method</h1>
                    </div>
                    <div>                    
                        <label htmlFor='paypal'>
                            <input                     
                            type='radio'
                            id='paypal'
                            value='Paypal'
                            name='paymentMethod'
                            required
                            checked
                            onChange={e => setPaymentMethod(e.target.value)} /> PayPal</label>
                    </div>
                    <div>
                        <label htmlFor='stripe'>
                            <input 
                            type='radio'
                            id='stripe'
                            value='Stripe'
                            name='paymentMethod'
                            required
                            onChange={e => setPaymentMethod(e.target.value)} /> Stripe</label>
                    </div>
                    <div>
                        <button 
                        className='primary'
                        type='submit'
                        >Continue</button>
                    </div>
                </form>
            </div>
        </div>
    );
    if(!user || (user && user.isAdmin) || (!cartItems || cartItems.length === 0)){
        comm = null;
    }
    return comm;
};

export default PaymentMethodScreen;

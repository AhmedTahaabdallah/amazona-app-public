import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import * as actions from '../../store/actions/index';
import './CartScreen.css';
import CartItemList from '../../components/CartItemList/CartItemList';
import { initAllLoading } from '../../shared/utility';

const CartScreen = props => {
    const userData = useSelector(state => state.user);
    const { user } = userData;
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const dispatch = useDispatch();
    const onAddToCart = (productId, qty) => dispatch(actions.addToCart(productId, qty));
    const onRemoveFromCart = productId => dispatch(actions.removeFromCart(productId));
    
    const removeFromCardHandler = (productId) => {
        onRemoveFromCart(productId);
    };

    useEffect(() => {
        initAllLoading(dispatch);
    }, [ dispatch ]);

    const checkoutHandler = () => {
        // function parseHttpHeaders(httpHeaders) {
        //     return httpHeaders.split("\n")
        //      .map(x=>x.split(/: */,2))
        //      .filter(x=>x[0])
        //      .reduce((ac, x)=>{ac[x[0]] = x[1];return ac;}, {});
        // }        
        // const req = new XMLHttpRequest();
        // req.open('GET', document.location, false);
        // req.send(null);
        // const headers = parseHttpHeaders(req.getAllResponseHeaders());
        // console.log('headers : ', headers);
        props.history.push('/shipping');
    };
    let fanilCart = <LoadingBox />;
    if(user && (user.isAdmin || user.isSeller)) {
        fanilCart = (<MessageBox>
            You Dont't have permison to show Cart, please login as normal user.
        </MessageBox>);
    } else if(cartItems.length === 0) {
        fanilCart = (<MessageBox>
            Cart is empty. <Link to='/'>Go Shopping</Link>
        </MessageBox>);
    } else {
        fanilCart = (<CartItemList cartItems={cartItems} addToCart={onAddToCart} removeFromCardHandler={removeFromCardHandler} />);
    }
    return (
        <div className='row top'>
            <div className='col-2'>
                <h1>Shoping Cart</h1>
                {fanilCart}
            </div>
            {cartItems.length > 0 && 
                <div className='col-1 cartcardEn'>
                    <div className='card card-body'>
                        <ul>
                            <li>
                                <h2>
                                    Subtotal ({cartItems.reduce((a, c) => a + Number(c.qty), 0)} items) : $
                                    {cartItems.reduce((a, c) => a + c.price * c.qty, 0)}
                                </h2>
                            </li>
                            <li>
                                <button
                                type='button'
                                onClick={checkoutHandler}
                                className='primary block'
                                disabled={cartItems.length === 0}>
                                    Procceed To Checkout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
};

export default CartScreen;

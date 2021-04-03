import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import CheckoutSteps from '../CheckoutSteps/CheckoutSteps';
import CartItemList from '../CartItemList/CartItemList';
import MessageBox from '../UI/MessageBox/MessageBox';
import { getDateFormat } from '../../shared/utility';
import { Link } from 'react-router-dom';
import { SELLER_RELOADING } from '../../store/actions/actionTypes';
 import './Order.css';
import { useDispatch } from 'react-redux';

const Order = props => {
    const dispatch = useDispatch();
    return (
        <div>
            {props.placeOrderHandler ? 
            <CheckoutSteps step1 step2 step3 step4 />
            : <h1>Order {props.order._id}</h1>}
            <div className='row top'>
                <div className='col-2'>
                <ul>
                    <li>
                        <div className='card card-body'>
                            <h2>Shipping</h2>
                            <div>
                                <strong>Name:</strong> {props.order.shippingAddress.fullName} <br />
                                <div style={{ marginTop: '0.6rem'}}></div>
                                <strong>Address:</strong> {props.order.shippingAddress.address}, {props.order.shippingAddress.city} 
                                , {props.order.shippingAddress.potalCode}, {props.order.shippingAddress.country}
                            </div>
                            {
                                props.order.shippingAddress.addressMap 
                                && props.order.shippingAddress.lat 
                                && props.order.shippingAddress.lng
                                && (
                                    <div>
                                        <div style={{ marginTop: '0.6rem', marginBottom: '1rem'}}>
                                            <strong>address Map:</strong> 
                                            <a className='address-map:hover' 
                                            href={`https://www.google.com/maps/@${props.order.shippingAddress.lat},${props.order.shippingAddress.lng},18z`} target='blank'
                                            >{` ${props.order.shippingAddress.addressMap}`}</a>
                                        </div>
                                    </div>
                                ) 
                            }
                            {props.placeOrderHandler ? 
                                null : props.order.isDeliverd ?
                                <MessageBox isNotCenter variant='success'>Deliverd At {getDateFormat(props.order.deliverdAt)}</MessageBox>
                                : <MessageBox isNotCenter variant='danger'>Not Deliverd</MessageBox>        
                            }
                        </div>
                    </li>
                    <li>
                        <div className='card card-body'>
                            <h2>Payment</h2>
                            <p>
                                <strong>Method:</strong> {props.order.paymentMethod}
                            </p>
                            {props.placeOrderHandler ? 
                                null : props.order.isPaid ?
                                <MessageBox isNotCenter variant='success'>Paid At {getDateFormat(props.order.paidAt)}</MessageBox>
                                : <MessageBox isNotCenter variant='danger'>Not Paid</MessageBox>        
                            }
                        </div>
                    </li>
                    {props.user && props.order.seller && props.order.seller._id !== props.user._id 
                    && props.order.seller.seller && <li>
                        <div className='card card-body'>
                            <h2>Seller </h2>
                            <div className='row start'>
                                <div>
                                    <img 
                                        src={props.order.seller.seller.logo} 
                                        alt={props.order.seller.seller.name} 
                                        style={{
                                            borderRadius: '0.3rem'
                                        }}
                                        className='small'
                                    />
                                </div>
                                <div>
                                    <h2 style={{
                                        paddingBottom: '2.5rem',
                                        paddingRight: '1rem',
                                        paddingLeft: '1rem',
                                    }}>
                                        <Link to={`/seller/${props.order.seller._id}`}
                                        onClick={() => {
                                            dispatch({ type: SELLER_RELOADING, value: true});
                                        }}>
                                            {props.order.seller.seller.name}
                                        </Link>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </li>}
                    <li>
                        <div className='card card-body'>
                            <h2>Order Items</h2>
                            <CartItemList cartItems={props.order.orderItems} />
                        </div>
                    </li>
                </ul>
                </div>
                <div className='col-1'>
                    <div className='card card-body'>
                        <ul>
                            <li>
                                <h2>Order Sumary</h2>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Items</div>
                                    <div>${props.order.itemPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            {props.isShipping && <li>
                                <div className='row'>
                                    <div>Shipping</div>
                                    <div>${props.order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>}
                            <li>
                                <div className='row'>
                                    <div>Tax</div>
                                    <div>${props.order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div><strong>Order Total</strong></div>
                                    <div><strong>${props.order.totalPrice.toFixed(2)}</strong></div>
                                </div>
                            </li>
                            <li>
                                {props.placeOrderHandler ? 
                                <button type='button'
                                className='primary block'
                                onClick={props.placeOrderHandler}>
                                    {props.loading ? <i className="fa fa-spinner fa-spin"></i> : 'Place Order'}
                                </button>
                                : null}
                            </li>
                            {!props.placeOrderHandler && !props.order.isPaid 
                            && props.user && !props.user.isAdmin && !props.user.isSeller && (
                                <li>
                                    {!props.sdkReady ? 
                                        <div style={{ textAlign: 'center', margin: '40px 0'}}><i className="fa fa-spinner fa-spin"></i></div>
                                        : (
                                            <>
                                                {props.payLoading && 
                                                <div style={{ textAlign: 'center', margin: '20px 0'}}><i className="fa fa-spinner fa-spin"></i></div>}
                                                <PayPalButton
                                                amount={props.order.totalPrice}
                                                onSuccess={props.successPaymentHandler}
                                                ></PayPalButton>
                                            </>
                                        )
                                    }
                                </li>
                            )}
                            {!props.placeOrderHandler && props.order.isPaid 
                            && !props.order.isDeliverd && props.user && 
                            (props.user.isAdmin || props.user.isSeller) && (
                                <li>
                                    <button
                                    className='primary block'
                                    type='button'
                                    onClick={props.successDeliverdHandler}
                                >{props.payLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Deliver Order'}</button>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
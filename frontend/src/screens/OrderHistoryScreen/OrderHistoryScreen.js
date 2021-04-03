import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import { ORDER_MINE_LIST_RELOADING } from '../../store/actions/actionTypes';

const OrderHistoryScreen = props => {
    const userData = useSelector(state => state.user);
    const { user } = userData;
    
    const orderList = useSelector(state => state.order);
    const {
        allOrders, reloading, loading, error, msg,
        loadMore, pages, page
    } = orderList;
    const [ currentPageNumber, setCurrentPageNumber ] = useState(page || 1);

    const dispatch = useDispatch();
    const onFetchAllMineOrders = useCallback((values) => dispatch(actions.listOrderMine(values)), [ dispatch ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=ordershistory`);
        }    
        if(error) {
            setCurrentPageNumber(page);
        }
    });

    useEffect(() => {    
        if(user && !user.isAdmin) {
            if(reloading) {
                initAllLoading(dispatch);
                onFetchAllMineOrders({});
            } else {
                initAllLoading(dispatch, 'intiOrders');
            }
        }            
    }, [ onFetchAllMineOrders, dispatch, reloading, user ]);
    
    let mineOrders = null;
    if(user && (user.isAdmin || user.isSeller)) {
        mineOrders = <MessageBox>You Dont't have permison to show Orders History, please login as normal user.</MessageBox>;
    } else if(loading && !loadMore) {
        mineOrders = <LoadingBox />;
    } else if(error && msg) {
        mineOrders = <MessageBox variant='danger'>{msg}</MessageBox>;
    } else if(allOrders.length === 0) {
        mineOrders = <MessageBox>There is no Orders.</MessageBox>;
    } else {
        mineOrders = (
            <div>
                <h1>Order History</h1>
                <table className='table order-history-table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {
                        loadMore ?
                        null                       
                        : (<tbody>
                            {allOrders.map(order => {
                                return (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>${order.totalPrice.toFixed(2)}</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}</td>
                                        <td>{order.isDeliverd ? order.deliverdAt.substring(0, 10) : 'NO'}</td>
                                        <td><button
                                        type='button'
                                        className='small edit'
                                        onClick={() => {
                                            dispatch({ type: ORDER_MINE_LIST_RELOADING, value: false});
                                            props.history.push(`/order/${order._id}`);
                                        }}
                                        >Details</button></td>
                                    </tr>
                                );
                            })}
                        </tbody>)
                    }
                </table>
                {
                    loadMore && (
                        <div
                        style={{
                            marginTop: '4.5rem',
                            marginBottom: '4.5rem'
                        }}
                        className='row center'>
                            <i className="fa fa-spinner fa-spin pagination-loading"></i>
                        </div>
                    )
                }
                <div 
                style={{
                    marginTop: '1.5rem'
                }}
                className='row center pagination'>
                    <div>
                        {
                            [...Array(pages).keys()].map(x => (
                                <button 
                                className={Number(x + 1) === Number(currentPageNumber) ? 'select-page' : ''}
                                key={x}
                                type='button'
                                onClick={() => {
                                    setCurrentPageNumber(x + 1);
                                    onFetchAllMineOrders({ 
                                        pageNumber: x + 1,
                                        loadMore:  true
                                    });                               
                                }}
                                >
                                    {x + 1}
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
    return mineOrders;
};

export default OrderHistoryScreen;
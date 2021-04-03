import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import { ORDER_MINE_LIST_RELOADING } from '../../store/actions/actionTypes';
import SweetAlert from 'react-bootstrap-sweetalert';

const OrderListScreen = props => {
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const [ deleteId, setDeleteId ] = useState(null);

    const userData = useSelector(state => state.user);
    const { user } = userData;
    
    const ordersList = useSelector(state => state.order);
    const { 
        allOrders, reloading, loading, error, msg,  
        deleteLoading, deleteError, deleteMsg,
        loadMore, pages, page
    } = ordersList;
    const [ isCurrentPageNumber, setIsCurrentPageNumber ] = useState(false);
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1);

    const dispatch = useDispatch();
    const onResetDeleteOrderMsgError = () => dispatch(actions.resetDeleteOrderMsgError());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=orderlist`);
        }    
        if(deleteError) {
            onShowErrorSnackbar(deleteMsg);
            setDeleteId(null);
            onResetDeleteOrderMsgError();
        } else if(!deleteError && deleteMsg) {
            onShowSuccessSnackbar(deleteMsg);
            setDeleteId(null);
            onResetDeleteOrderMsgError();
        } 
        if(error) {
            setCurrentPageNumber(page);
        }
    });

    useEffect(() => {    
        if(user && ( user.isAdmin || user.isSeller )) {
            if(reloading) {
                initAllLoading(dispatch, 'intiOrders');
                if(sellerMode) {
                    dispatch(actions.listOrder({ seller: sellerMode ? user._id : ''}));
                } else if(!sellerMode && user.isAdmin) {
                    dispatch(actions.listOrder({}));
                }
            } else {
                initAllLoading(dispatch, 'intiOrders');
            }            
        }            
    }, [ dispatch, reloading, user, sellerMode ]);

    const showDeleteDailogHandler = (productId) => {
        setDeleteId(productId);
    };

    const deleteHandler = () => {
        dispatch(actions.deleteOrder(deleteId));        
    };
    
    let mineOrders = null;
    if(user && (!user.isAdmin && !sellerMode)) {
        mineOrders = <MessageBox>You Dont't have permison to show Product List, please login as admin user.</MessageBox>;
    } else if(user && (!user.isAdmin && !user.isSeller)) {
        mineOrders = <MessageBox>You Dont't have permison to show Product List, please login as admin/seller user.</MessageBox>;
    } else if(loading && !loadMore) {
        mineOrders = <LoadingBox />;
        if(isCurrentPageNumber) {
            setIsCurrentPageNumber(false);                                
        }  
    } else if(error && msg) {
        mineOrders = <MessageBox variant='danger'>{msg}</MessageBox>;
    } else if(allOrders.length === 0) {
        mineOrders = <MessageBox>There is no Orders.</MessageBox>;
    } else {      
        if(page && !isCurrentPageNumber) {
            setIsCurrentPageNumber(true);
            setCurrentPageNumber(page);                                    
        }  
        mineOrders = (
            <div>
                {deleteId && <SweetAlert
                warning
                title="Order Delete"    
                onConfirm={() => {}} 
                onCancel={() => {}}
                customButtons={
                    <React.Fragment>
                      <button 
                      type='button' 
                      className='small edit'
                      onClick={() => {
                          setDeleteId(null);;
                      }}>Cancel</button>
                      <button 
                      style={{
                            margin: '0 8px'
                        }}
                      type='button' 
                      className='small delete'
                      onClick={deleteHandler}>
                          {deleteLoading ? <i style={{margin: '0 16px'}} className="fa fa-spinner fa-spin"></i> : 'Delete'}
                    </button>
                    </React.Fragment>
                  }        
                >
                Are you sure to delete this order ?
                </SweetAlert>}
                <div >
                    <h1>Orders</h1>
                </div>
                <table className='table list-orders-table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>User</th>
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
                        {allOrders.map((order, index) => {
                            if(allOrders.length -1 === index) {
                                
                            }
                            return (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.user.name}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>${order.totalPrice.toFixed(2)}</td>
                                    <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}</td>
                                    <td>{order.isDeliverd ? order.deliverdAt.substring(0, 10) : 'NO'}</td>
                                    <td>
                                        <button
                                        type='button'
                                        className='small edit'
                                        onClick={() => {
                                            dispatch({ type: ORDER_MINE_LIST_RELOADING, value: false});
                                            props.history.push(`/order/${order._id}`);
                                        }}
                                        >Details</button>
                                        <button
                                        type='button'
                                        className='small delete'
                                        onClick={() => showDeleteDailogHandler(order._id)}
                                        >Delete</button>                                        
                                    </td>
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
                            [...Array(pages).keys()].map(x => {
                                return (
                                <button 
                                className={Number(x + 1) === Number(currentPageNumber) ? 'select-page' : ''}
                                key={x}
                                type='button'
                                onClick={() => {
                                    setCurrentPageNumber(x + 1);
                                    dispatch(actions.listOrder({ 
                                        seller: sellerMode ? user._id : '',
                                        pageNumber: x + 1,
                                        loadMore:  true
                                    }));                                
                                }}
                                >
                                    {x + 1}
                                </button>
                            );
                        })
                        }
                    </div>
                </div>
            </div>
        );       
    }
    return mineOrders;
};

export default OrderListScreen;
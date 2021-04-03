import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import { FETCH_PRODUCTS_RELOADING, SELLER_RELOADING } from '../../store/actions/actionTypes';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router-dom';

const ProductListScreen = props => {
    const sellerMode = props.match.path.indexOf('/seller') >= 0;
    const [ deleteName, setDeleteName ] = useState(null);    

    const userData = useSelector(state => state.user);
    const { user } = userData;
    
    const productsList = useSelector(state => state.products);
    const { 
        products, reloading, loading, error, msg,  
        sellerProducts, sellerReloading, sellerLoading, sellerError, sellerMsg,  
        createdLoading, createdError, createdMsg,
        loadMore, pages, page,
        sellerLoadMore, sellerPages, sellerPage,
    } = productsList;
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1);

    const dispatch = useDispatch();
    const onCreateProductReset = () => dispatch(actions.createProductReset());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=productlist`);
        }    
        if(createdError) {
            onShowErrorSnackbar(createdMsg);
            setDeleteName(null);
            onCreateProductReset();
        } else if(!createdError && createdMsg) {
            onShowSuccessSnackbar(createdMsg);
            setDeleteName(null);
            onCreateProductReset();
        } 
        if(error || sellerError) {
            setCurrentPageNumber(sellerMode ? sellerPage : page)
        }
    });

    useEffect(() => {    
        if(user && ( user.isAdmin || user.isSeller )) {
            let newCurrentPageNumber = 1;
            if(sellerMode) {
                newCurrentPageNumber = sellerPage || 1;
            } else {
                newCurrentPageNumber = page || 1;
            }
            setCurrentPageNumber(newCurrentPageNumber);
            let newReloading = reloading;
            if(sellerMode) {
                newReloading = sellerReloading;
            }
            if(newReloading) {
                initAllLoading(dispatch,);
                if(sellerMode) {
                    dispatch(actions.fetchAllProducts({ 
                        listType: 'add', 
                        seller: sellerMode ? user._id : '',
                        plusPageNumer: false,
                    }));
                } else if(!sellerMode && user.isAdmin) {
                    dispatch(actions.fetchAllProducts({ listType: 'add', plusPageNumer: false, }));
                }                
            } else {
                initAllLoading(dispatch, sellerMode ? 'intiSellerProducts' : 'intiProducts');
            }
        }            
    }, [ dispatch, reloading, user, sellerMode, sellerReloading ]);

    const showDeleteDailogHandler = (productName) => {
        setDeleteName(productName);
    };

    const deleteHandler = () => {
        dispatch(actions.deleteProduct(deleteName.id));        
    };

    const createProductHandler = () => {
        if(sellerMode) {
            dispatch({ type: SELLER_RELOADING, value: false});
        } else {
            dispatch({ type: FETCH_PRODUCTS_RELOADING, value: false});
        }
        props.history.push('/product/add')
    };

    let newProducts = products;
    let newLoading = loading;
    let newError = error;
    let newMsg = msg;
    let newLoadMore = loadMore;
    let newPages = pages;

    if(sellerMode) {
        newProducts = sellerProducts;
        newLoading = sellerLoading;
        newError = sellerError;
        newMsg = sellerMsg;
        newLoadMore = sellerLoadMore;
        newPages = sellerPages;
    }
    
    let prodsList = null;
    if(user && (!user.isAdmin && !sellerMode)) {
        prodsList = <MessageBox>You Dont't have permison to show Product List, please login as admin user.</MessageBox>;
    } else if(user && (!user.isAdmin && !user.isSeller)) {
        prodsList = <MessageBox>You Dont't have permison to show Product List, please login as admin/seller user.</MessageBox>;
    } else if(newLoading && !newLoadMore) {
        prodsList = <LoadingBox />;
    } else if(newError && newMsg) {
        prodsList = <MessageBox variant='danger'>{newMsg}</MessageBox>;
    } else if(newProducts.length === 0) {
        prodsList = <MessageBox>There is no Products. <Link to='/product/add'>Create Product</Link></MessageBox>;
    } else {
        prodsList = (
            <div>
                {deleteName && <SweetAlert
                warning
                title="Product Delete"    
                onConfirm={() => {}} 
                onCancel={() => {}}
                customButtons={
                    <React.Fragment>
                      <button 
                      type='button' 
                      className='small edit'
                      onClick={() => {
                          setDeleteName(null);;
                      }}>Cancel</button>
                      <button 
                      style={{
                            margin: '0 8px'
                        }}
                      type='button' 
                      className='small delete'
                      onClick={deleteHandler}>
                          {createdLoading ? <i style={{margin: '0 16px'}} className="fa fa-spinner fa-spin"></i> : 'Delete'}
                    </button>
                    </React.Fragment>
                  }        
                >
                Are you sure to delete {deleteName.name} ?
                </SweetAlert>}
                <div className='row'>
                    <h1>Products</h1>
                    <button
                    type='button'
                    className='primary'
                    onClick={createProductHandler}
                    >Create Product</button>
                </div>
                <table className='table list-products-table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {                        
                        newLoadMore ?
                        null                       
                        : (<tbody>
                            {newProducts.map(product => {
                                return (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td><img src={product.image} alt={product.name} className='small-image'/></td>
                                        <td>{product.name}</td>
                                        <td>${product.price.toFixed(2)}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <button
                                            type='button'
                                            className='small edit'
                                            onClick={() => {
                                                if(sellerMode) {
                                                    dispatch({ type: SELLER_RELOADING, value: false});
                                                } else {
                                                    dispatch({ type: FETCH_PRODUCTS_RELOADING, value: false});
                                                }
                                                props.history.push(`/product/${product._id}/edit`);
                                            }}
                                            >Edit</button>
                                            <button
                                            type='button'
                                            className='small delete'
                                            onClick={() => showDeleteDailogHandler({id: product._id,name: product.name})}
                                            >Delete</button>                                        
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>)
                    }
                </table>
                {
                    newLoadMore && (
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
                            [...Array(newPages).keys()].map(x => (
                                <button 
                                className={Number(x + 1) === Number(currentPageNumber) ? 'select-page' : ''}
                                key={x}
                                type='button'
                                onClick={() => {
                                    setCurrentPageNumber(x + 1);
                                    if(sellerMode) {                                        
                                        dispatch(actions.fetchAllProducts({ 
                                            listType: 'add', 
                                            plusPageNumer: false,
                                            seller: sellerMode ? user._id : '',
                                            pageNumber: x + 1,
                                            loadMore:  true
                                        }));
                                    } else {
                                        dispatch(actions.fetchAllProducts({ 
                                            listType: 'add',                                             
                                            plusPageNumer: false,
                                            pageNumber: x + 1,
                                            loadMore:  true
                                        }));
                                    }
                                    
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
    return prodsList;
};

export default ProductListScreen;
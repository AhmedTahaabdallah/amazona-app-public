import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Rating from '../../components/Rating/Rating';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import Product from '../../components/Product/Product';
import { initAllLoading } from '../../shared/utility';

const SellerScreen = props => {
    const sellerId = props.match.params.id;

    const sellerDetails = useSelector(state => state.user);
    const { resultUser, loading,  error, msg } = sellerDetails;

    const productList = useSelector(state => state.products);
    const { 
        sellerLoading, 
        sellerReloading,
        sellerProducts, 
        sellerError, 
        sellerMsg,
        sellerLoadMore, 
        sellerPage, 
        sellerPages, 
        sellerProductsCount 
    } = productList;

    const dispatch = useDispatch();

    useEffect(() => {
        if(sellerReloading) {
            initAllLoading(dispatch, 'intiHomeScreen');
            dispatch(actions.userDetails(sellerId));
            dispatch(actions.fetchAllProducts({ seller: sellerId, listType: 'add', }));
        } else {
            initAllLoading(dispatch, 'intiHomeScreen intiProducts intiUserDetails');
        }  
        
    }, [ dispatch, sellerId, sellerReloading ]);

    let seller = null;
    if(loading || sellerLoading) {
        seller = <LoadingBox />;
    } else if(error && msg) {
        seller = <MessageBox variant='danger'>{msg}</MessageBox>;
    } else if(sellerError && sellerMsg) {
        seller = <MessageBox variant='danger'>{sellerMsg}</MessageBox>;
    } else {
        seller = (
            <div className='row top'>
                <div className='col-1'>
                    <ul className='card card-body'>
                        <li>
                            <div className='row start'>
                                <div>
                                    <img 
                                        src={resultUser.seller.logo} 
                                        alt={resultUser.seller.name} 
                                        style={{
                                            borderRadius: '0.1rem'
                                        }}
                                        className='small'
                                    />
                                </div>
                                <div>
                                    <h1 style={{
                                        paddingBottom: '5rem',
                                        paddingRight: '1rem',
                                        paddingLeft: '1rem',
                                    }}>
                                        {resultUser.seller.name}
                                    </h1>
                                </div>
                            </div>
                        </li>  
                        <li>
                            <Rating 
                                rating={resultUser.seller.rating} 
                                numReviews={resultUser.seller.numReviews} 
                            />
                        </li>
                        <li>
                            Products: {sellerProductsCount} Products
                        </li>
                        <li>
                            <a href={`mailto:${resultUser.email}`}>Contact Seller</a>
                        </li>
                        <li>
                            {resultUser.seller.description}
                        </li>                      
                    </ul>
                </div>
                <div className='col-3'>
                    <div>
                        {
                            sellerProducts.length === 0 ?
                            <MessageBox>There is no Products.</MessageBox>
                            : <div className='row center top'>
                                {sellerProducts.map(product => {
                                    return <Product key={product._id} product={product} type='sellerScreen' {...props} />;
                                })}
                            </div>
                        }
                    </div>
                    {
                            sellerPages >= sellerPage && !sellerError && !sellerLoading && (
                                <div style={{ textAlign: 'center' }}>
                                    <button 
                                    style={{
                                            margin: '2.5rem 1.5rem',
                                        }}
                                    type='button' 
                                    className='small primary'
                                    onClick={() => {
                                        dispatch(actions.fetchAllProducts({ 
                                            loadMore: true,
                                            listType: 'addMore',
                                            pageNumber: sellerPage,
                                            seller: sellerId
                                        }));
                                    }}>
                                        {sellerLoadMore ? <i className="fa fa-spinner fa-spin"></i> : 'More'}
                                    </button>
                                </div>
                            )
                        }
                </div>
            </div>
        );
    }
    return seller;
};

export default SellerScreen;
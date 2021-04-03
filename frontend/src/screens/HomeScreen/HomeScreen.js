import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../../components/Product/Product';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import { HOME_SCREEN_LIST_RELOADING, SELLER_RELOADING } from '../../store/actions/actionTypes';
import { Link } from 'react-router-dom';

const HomeScreen = (props) => {
    const productList = useSelector(state => state.products);
    const { 
        featuredProducts, topSellers, 
        homeScreenReloading, homeScreenLoading, 
        homeScreenError, homeScreenMsg
    } = productList;

    const dispatch = useDispatch();
    const onHomScreenList = useCallback(() => dispatch(actions.homScreenList()), [ dispatch ]);

    useEffect(() => {        
        if(homeScreenReloading) {
            initAllLoading(dispatch);
            onHomScreenList();
        } else {
            initAllLoading(dispatch, 'intiHomeScreen');
        }
    }, [ onHomScreenList , dispatch,homeScreenReloading]);
    
    let finalTopSellers = null;
    let finalFeaturedProducts = null;
    let finalHomeScreen = null;    
    if(homeScreenLoading) {
        finalHomeScreen = <LoadingBox />;
    } else if(homeScreenError && homeScreenMsg) {
        finalHomeScreen = <MessageBox variant='danger'>{homeScreenMsg}</MessageBox>;
    } else {        
        if(topSellers.length > 0) {
            finalTopSellers = (
                <Carousel 
                showArrows 
                autoPlay 
                showThumbs={false} 
                showStatus={false}>
                    {topSellers.map(seller => {
                        return (
                            <div key={seller._id}>
                                <Link to={`/seller/${seller._id}`} onClick={() => {
                                    dispatch({ type: HOME_SCREEN_LIST_RELOADING, value: false});
                                    dispatch({ type: SELLER_RELOADING, value: true});
                                }}>
                                    <img src={seller.seller.logo} alt={seller.seller.name}/>
                                    <p className='legend'>{seller.seller.name}</p>
                                </Link>
                            </div>
                        );
                    })}    
                </Carousel>
            );
        }
        if(featuredProducts.length > 0) {
            finalFeaturedProducts = (
                <div className="row center">
                    {featuredProducts.map(product => {
                    return <Product 
                    key={product._id} 
                    product={product} 
                    showSeller
                    type='homeScreen' 
                    {...props} />;
                    })}        
                </div>
            );
        }        
        finalHomeScreen = (
            <div>
                {
                    topSellers.length > 0 &&
                    <>
                        <div className='row'>
                            <h2>Top Sellers</h2>
                            <Link className='view-all' to='/search/category/all/name/*/min/0/max/0/rating/0/order/toprated'>View All</Link>
                        </div>
                        {finalTopSellers}
                    </>
                }
                {
                    featuredProducts.length > 0 ?
                    <>
                        <div className='row'>
                            <h2>Featured Products</h2>
                            <Link className='view-all' to='/search/category/all/name/*/min/0/max/0/rating/0/order/newest'>View All</Link>
                        </div>
                        {finalFeaturedProducts}
                    </>
                    : <MessageBox>There is no Featured Products.</MessageBox>
                }
                
            </div>
        );
    }
    return finalHomeScreen;
};

export default HomeScreen;

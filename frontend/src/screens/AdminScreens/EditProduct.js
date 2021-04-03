import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import ProductComponentt from '../../components/ProductComponent/ProductComponent';

const EditProduct = props => {
    const [ isFetch, setIsFetch ] = useState(false);
    const productId = props.match.params.id;
    const userData = useSelector(state => state.user);
    const { user } = userData;
    
    const productsList = useSelector(state => state.products);
    const { sellerProducts, sellerReloading, reloading } = productsList;

    const productsDetails = useSelector(state => state.productsDetails);
    const {product, loading, error, msg} = productsDetails;

    const dispatch = useDispatch();

    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=/product/${productId}/edit`);
        }    
    });

    useEffect(() => {    
        if(user && ( user.isAdmin || user.isSeller ) && !isFetch) {
            setIsFetch(true)
            let newInit = '';
            if(!reloading) {
                newInit = 'intiProducts';
            } else if(!sellerReloading) {
                newInit = 'intiSellerProducts';
            }  
            initAllLoading(dispatch, newInit);
            dispatch(actions.fetchProduct(productId));
        }            
    }, [ dispatch, reloading, user, productId, sellerProducts, sellerReloading, isFetch ]);

    
    const editProductHandler = (product) => {
        dispatch(actions.updateProduct(productId, product));
    };
    
    let oneProduct = null;
    if(user && ( !user.isAdmin && !user.isSeller )) {
        oneProduct = <MessageBox>You Dont't have permison to show Product List, please login as admin user.</MessageBox>;
    } else if(loading) {
        oneProduct = <LoadingBox />;
    } else if(error && msg) {
        oneProduct = <MessageBox variant='danger'>{msg}</MessageBox>;
    } else {
        oneProduct = <ProductComponentt 
        {...props}
        productId={productId}
        product={product} 
        isSeller={user ? user.isSeller : false} 
        editProductHandler={editProductHandler} />;
    }
    return oneProduct;
};

export default EditProduct;
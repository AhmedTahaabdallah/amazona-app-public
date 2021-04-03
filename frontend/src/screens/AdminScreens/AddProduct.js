import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import ProductComponentt from '../../components/ProductComponent/ProductComponent';

const AddProduct = props => {
    const userData = useSelector(state => state.user);
    const { user } = userData;

    const dispatch = useDispatch();

    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=/product/add`);
        }    
    });

    
    const createProductHandler = (order) => {
        dispatch(actions.createProduct(order)); 
    };
    
    let oneProduct = null;
    if(user && ( user && !user.isAdmin && !user.isSeller )) {
        oneProduct = <MessageBox>You Dont't have permison to show Product List, please login as admin user.</MessageBox>;
    } else {
        oneProduct = <ProductComponentt 
        {...props}
        isSeller={user ? user.isSeller : false} 
        createProductHandler={createProductHandler} />;
    }
    return oneProduct;
};

export default AddProduct;
import React from 'react';

import Rating from '../Rating/Rating';
import './Product.css';
import { useDispatch } from 'react-redux';
import { 
  HOME_SCREEN_LIST_RELOADING, 
  SEARCH_RELOADING,
  SELLER_RELOADING
} from '../../store/actions/actionTypes';
import { Link } from 'react-router-dom';

const Product = (props) => {
    const { product } = props;
    const dispatch = useDispatch();

    const cardClickHandler = () => {
      
      if(props.type === 'homeScreen') {
        dispatch({ type: HOME_SCREEN_LIST_RELOADING, value: false});
      } else if(props.type === 'searchScreen') {
        dispatch({ type: SEARCH_RELOADING, value: false});
      } else if(props.type === 'sellerScreen') {
        dispatch({ type: SELLER_RELOADING, value: false});
      }      
      props.history.push(`/product/${product._id}`);
    };

    return (
        <div className="card">
          <img onClick={cardClickHandler} className="medium pointer" src={product.image} alt={product.name} />
          <div className="card-body">
              <h2 onClick={cardClickHandler}  className="pointer">{product.name}</h2>
              <Rating rating={product.rating} numReviews={product.numReviews} />
              <div className='row'>
                <div className="price">
                    ${product.price}
                </div>
                {props.showSeller && <div>
                  <Link to={`/seller/${product.seller._id}`} onClick={() => {
                    if(props.type === 'homeScreen') {
                      dispatch({ type: HOME_SCREEN_LIST_RELOADING, value: false});
                    } else if(props.type === 'searchScreen') {
                      dispatch({ type: SEARCH_RELOADING, value: false});
                    } else if(props.type === 'sellerScreen') {
                      dispatch({ type: SELLER_RELOADING, value: true});
                    }      
                  }}>
                    {product.seller.seller.name}
                  </Link>
                </div>}
              </div>
          </div>
        </div>
      );
};

export default Product;

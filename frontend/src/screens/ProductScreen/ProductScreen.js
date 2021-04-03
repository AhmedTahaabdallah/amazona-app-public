import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ProductScreen.css';
import Rating from '../../components/Rating/Rating';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import { Link } from 'react-router-dom';
import { SELLER_RELOADING } from '../../store/actions/actionTypes';

const ProductScreen = (props) => {
    const [ isFetch, setIsFetch ] = useState(false);
    const [ rating, setRating ] = useState(0);
    const [ comment, setComment ] = useState('');

    const userData = useSelector(state => state.user);
    const { user } = userData;
    const products = useSelector(state => state.products);
    const { homeScreenReloading } = products;
    const productsDetails = useSelector(state => state.productsDetails);
    const {
        product, loading, error, msg,
        createReviewLoading, createReviewError, createReviewMsg,
    } = productsDetails;
    const [ qty, setQty ] = useState(1);

    const dispatch = useDispatch();
    const onFetchProduct = useCallback((id) => dispatch(actions.fetchProduct(id)), [ dispatch ]);        
    const onCreateReviewReset = () => dispatch(actions.createReviewReset());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    const prId = props.match.params.id;

    const clearAllInputs = () => {
        setComment('');
        setRating(0);
    };

    useEffect(() => {
        if(createReviewError) {
            onShowErrorSnackbar(createReviewMsg);
            onCreateReviewReset();
        } else if(!createReviewError && createReviewMsg) {
            onShowSuccessSnackbar(createReviewMsg);
            onCreateReviewReset();
            clearAllInputs();
        }
    });

    useEffect(() => {          
        if(!isFetch) {
            setIsFetch(true);
            if(homeScreenReloading) {
                initAllLoading(dispatch, 'intiProducts intiUserDetails'); 
            } else {
                initAllLoading(dispatch, 'intiHomeScreen intiProducts intiUserDetails'); 
            }  
            onFetchProduct(prId);
        }           
    }, [ onFetchProduct, prId, dispatch, homeScreenReloading, isFetch ]);

    const addToCartHandler = () => {
        const onAddToCart = (productId, qty) => dispatch(actions.addToCart(productId, qty));
        onAddToCart(prId, qty);
        props.history.push(`/cart`);
    };

    const submitHandler = e => {
        e.preventDefault();
        if(rating === 0) {
            onShowErrorSnackbar('select rating number.');
            document.getElementById("rating").focus();
            return;
        }
        if(comment.trim().length <= 2) {
            onShowErrorSnackbar('please write comment.');
            document.getElementById("comment").focus();
            return;
        }
        dispatch(actions.createReview(prId, { 
            rating, 
            comment, 
        }));
    }

    let oneProduct = null;
    if(loading) {
        oneProduct = <LoadingBox />;
    } else if(error && msg) {
        oneProduct = <MessageBox variant='danger'>{msg}</MessageBox>;
    } else if(product && product.error) {
        oneProduct = <MessageBox variant='danger'>{product.error}</MessageBox>;
    } else if(!product) {
        oneProduct = <MessageBox>product Not Found</MessageBox>;
    } else {
        oneProduct = (
            <div className='row top'>
                <div className='col-2'>
                    <img className='large' src={product.image} alt={product.name} />
                </div>
                <div className='col-1 info-area'>
                    <ul>
                        <li>
                            <h1>{product.name}</h1>
                        </li>
                        <li>
                            <Rating rating={product.rating} numReviews={product.numReviews} />
                        </li>
                        <li>Price : ${product.price}</li>
                        <li>Description : 
                            <p>{product.description}</p>
                        </li>
                        <li>
                        <div>
                            <h2 id='reviews'>Reviews</h2>
                            {
                                product.reviews.length === 0 && <div>
                                    <MessageBox isNotCenter>There is no reviews</MessageBox>
                                </div>
                            }
                             <ul>
                                {
                                    product.reviews.map(review => (
                                        <li key={review._id} className='card card-body'>
                                            <div className='row' style={{ padding: "0"}}>
                                                <div className='row' style={{ padding: '0'}}>
                                                    <img className="small-avater" src={review.userId.image} alt={review.userId.name} /> 
                                                    <div>
                                                        <strong>{review.userId.name}</strong>                                                    
                                                        <div style={{ marginBottom: '0.2rem'}}></div>
                                                        <Rating rating={review.rating} caption=' '></Rating>
                                                    </div>
                                                </div>
                                                <span>{review.dateTime}</span>
                                            </div>    
                                            <p style={{ padding: '0 1.0rem'}}>{review.comment}</p>
                                        </li>
                                    ))
                                }
                                <li>
                                    {
                                        user ? 
                                        (
                                            <form style={{ width: 'auto'}} className='form' onSubmit={submitHandler}>
                                                <div>
                                                    <h2>Write a customer review</h2>
                                                </div>
                                                <div>
                                                    <label htmlFor='rating'>Rating</label>
                                                    <select
                                                    id='rating'
                                                    value={rating}
                                                    onChange={e => setRating(e.target.value)}
                                                    >
                                                        <option value=''>Select Rating....</option>
                                                        <option value='1'>1- Poor</option>
                                                        <option value='2'>2- Fair</option>
                                                        <option value='3'>3- Good</option>
                                                        <option value='4'>4- Very Good</option>
                                                        <option value='5'>5- Excelent</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor='comment'>Comment</label>
                                                    <textarea
                                                    rows='3'
                                                    id='comment'
                                                    value={comment}
                                                    onChange={e => setComment(e.target.value)}
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label/>
                                                    <button className='primary' type='submit'>
                                                    {createReviewLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Review'}
                                                    </button>
                                                </div>
                                            </form>
                                        )
                                        : (
                                            <MessageBox isNotCenter>
                                                Please <Link to={`/signin?redirect=product/${prId}`}>Sign In</Link> to write a review
                                            </MessageBox>
                                        )
                                    }
                                </li>
                            </ul>
                        </div>
                        </li>
                    </ul>
                </div>
                <div className='col-1'>
                    <div className='card card-body'>
                        <ul>
                            <li>
                                Seller{' '}
                                <h2>
                                    <Link to={`/seller/${product.seller._id}`}
                                    onClick={() => {
                                        dispatch({ type: SELLER_RELOADING, value: true});
                                    }}>
                                    {product.seller.seller.name}
                                    </Link>
                                </h2>
                                <Rating rating={product.seller.seller.rating} 
                                numReviews={product.seller.seller.numReviews} />
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Price</div>
                                    <div className='price'>${product.price}</div>
                                </div>
                            </li>
                            <li>
                                <div className='row'>
                                    <div>Status</div>
                                    <div>
                                        {product.countInStock > 0 ?
                                        <span className='success'>In Stock</span>
                                        : <span className='danger'>Unavailable</span>}
                                    </div>
                                </div>
                            </li>
                            {product.countInStock > 0 ? 
                            (
                                <>
                                    <li>
                                        <div className='row'>
                                            <div>Qty</div>
                                            <div>
                                                {
                                                    user && ( user.isAdmin || user.isSeller ) ?
                                                    <div>{product.countInStock} Items</div>
                                                    : <select value={qty} onChange={e => setQty(e.target.value)}>
                                                        {[...Array(product.countInStock).keys()].map(
                                                            x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                }
                                            </div>
                                        </div>
                                    </li>
                                    {user && ( user.isAdmin || user.isSeller ) ?
                                    null 
                                    : <li>
                                        <button onClick={addToCartHandler} className='primary block'>Add To Cart</button>
                                    </li>}
                                </>
                            ) : null}                            
                        </ul>
                    </div>
                </div>                
            </div>
          );
    }

    return oneProduct;
};

export default ProductScreen;

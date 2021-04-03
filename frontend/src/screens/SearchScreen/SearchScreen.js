import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import Product from '../../components/Product/Product';
import { initAllLoading, prices, ratings } from '../../shared/utility';
import Rating from '../../components/Rating/Rating';
import { SEARCH_RELOADING } from '../../store/actions/actionTypes';

const SearchScreen = props => {
    const { 
        name = '*', 
        category = 'all',
        min = 0,
        max = 0,
        rating = 0,
        order = 'newest',
    } = useParams();

    const categoriesList = useSelector(state => state.categories);
    const { allCategories, loading: categoriesLoading, error: categoriesError, msg: categoriesMsg } = categoriesList;

    const productsList = useSelector(state => state.products);
    const { 
        searchProducts, searchLoading, searchReloading, searchError, searchMsg,
        searchLoadMore, searchPage, searchPages, searchProductsCount 
    } = productsList;

    const dispatch = useDispatch();

    useEffect(() => {
        if(searchReloading) {
            initAllLoading(dispatch);
            dispatch(actions.fetchAllProducts({ 
                listType: 'add',
                name: name !== '*' ? name : '',
                category: category !== 'all' ? category : '',
                min,
                max,
                rating,
                order
            }));
        } else {
            initAllLoading(dispatch, 'intiProducts');
        }        
    }, [ dispatch, name, category, min, max, rating, order, searchReloading ]);

    const getFilterUrl = filter => {
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        const filterRating = filter.rating ? filter.rating : filter.rating === 0 ? 0 : rating;
        const sortOrder = filter.order || order;
        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
    };

    let prodsList = null;
    prodsList = (
        <div>
            <div>
                <div className='row'>
                    <div>
                        <div style={{ display: 'inline'}}>{searchProductsCount} Results For '{name}'</div>
                        { (category !== 'all' || max > 0 || rating !== 0) 
                        && <button 
                        style={{
                                margin: '0.5rem 1.5rem',
                                padding: '4px '
                            }}
                        type='button' 
                        className='small delete'
                        onClick={() => {
                            props.history.push(`/search/name/${name}`);
                            dispatch({ type: SEARCH_RELOADING, value: true});
                        }}>
                            Remove Filter
                        </button>}
                    </div>                    
                    <div>
                        Sort by{' '}
                        <select
                        value={order}
                        onChange={e => {
                            props.history.push(getFilterUrl({ order: e.target.value }));
                            dispatch({ type: SEARCH_RELOADING, value: true});
                        }}
                        >
                            <option value='newest'>Newest Arraivals</option>
                            <option value='oldest'>Oldest Arraivals</option>
                            <option value='lowest'>price: Low to High</option>
                            <option value='highest'>price: High to Low</option>
                            <option value='lowrated'>Avg Cutomer Review Low</option>
                            <option value='toprated'>Avg Cutomer Review Top</option>                            
                        </select>
                    </div>
                </div>
                <div className='row top'>
                    <div className='col-1'>
                        <h3>Categories</h3>
                        <div>
                            {
                                categoriesLoading ?
                                <i className="fa fa-spinner fa-spin"></i> 
                                : categoriesError && categoriesMsg ?
                                <MessageBox isNotCenter variant='danger'>{categoriesMsg}</MessageBox>
                                : <ul>
                                    <li key='all'>
                                        <Link
                                            className={'all' === category ? 'category-active' : 'category-not-active'}
                                            to={getFilterUrl({ category: 'all' })}
                                            onClick={() => {
                                                dispatch({ type: SEARCH_RELOADING, value: true});
                                            }}
                                            >
                                            All
                                        </Link>
                                    </li>
                                    {allCategories.map(c => (
                                        <li key={c}>
                                            <Link
                                            className={c === category ? 'category-active' : 'category-not-active'}
                                            to={getFilterUrl({ category: c })}
                                            onClick={() => {
                                                dispatch({ type: SEARCH_RELOADING, value: true});
                                            }}
                                            >
                                            {c}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            }      
                        </div>   
                        <h3>Price</h3>  
                        <div>
                            <ul>
                                {prices.map(p => (
                                    <li key={p.name}>
                                        <Link
                                        to={getFilterUrl({ min: p.min, max: p.max})}
                                        className={`${p.min}-${p.max}` === `${min}-${max}` ? 'category-active' : 'category-not-active'}
                                        onClick={() => {
                                            dispatch({ type: SEARCH_RELOADING, value: true});
                                        }}
                                        >
                                        {p.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>  
                        <h3>Avg Cutomer Review</h3>  
                        <div id='searchCutomerReviewProducts'>
                            <ul>
                                {ratings.map(r => (
                                    <li key={r.name}>
                                        <Link
                                        to={getFilterUrl({ rating: r.rating })}
                                        className={`${r.rating}` === `${rating}` ? 'rating-active' : 'category-not-active'}
                                        onClick={() => {
                                            dispatch({ type: SEARCH_RELOADING, value: true});
                                        }}
                                        >
                                        <Rating caption={' & up'} rating={r.rating} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>    
                        <div id='searchLoadingProducts'>
                        {
                            searchLoading ?
                            <div className='search-visible-2'
                            style={{ position: 'relative', textAlign: 'center',
                            margin: '10rem 2rem'}}><LoadingBox /></div>
                            : searchError && searchMsg ?
                            <div className='search-visible-2'><MessageBox isNotCenter variant='danger'>{searchMsg}</MessageBox></div>
                            : searchProducts.length === 0 ?
                            <div className='search-visible-2'><MessageBox isNotCenter>No Product Found.</MessageBox></div>
                            : null
                        } 
                        </div>            
                    </div>
                    <div style={{ marginTop: '1rem' }} className='col-3'>                            
                        {
                            searchLoading ?
                            <div className='search-visible'><LoadingBox /></div>
                            : searchError && searchMsg ?
                            <div className='search-visible'><MessageBox variant='danger'>{searchMsg}</MessageBox></div>
                            : searchProducts.length === 0 ?
                            <div className='search-visible'><MessageBox>No Product Found.</MessageBox></div>
                            : <div className="row center">
                                {searchProducts.map(product => {
                                return <Product 
                                key={product._id} 
                                product={product} 
                                showSeller
                                type='searchScreen' {...props} />;
                                })}        
                            </div>
                        }
                        {
                            searchPages >= searchPage && !searchError && !searchLoading && (
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
                                            pageNumber: searchPage,
                                            name,
                                            category,
                                            min,
                                            max,
                                            rating,
                                            order
                                        }));
                                    }}>
                                        {searchLoadMore ? <i className="fa fa-spinner fa-spin"></i> : 'More'}
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );

    return prodsList;
};

export default SearchScreen;
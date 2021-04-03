import React, { Suspense, useState, useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './App.css';
import './/font-awesome-4.7.0/css/font-awesome.min.css';
import ProductScreen from './screens/ProductScreen/ProductScreen';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import CartScreen from './screens/CartScreen/CartScreen';
import SigninScreen from './screens/SigninScreen/SigninScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen';
import * as actions from './store/actions/index';
import { ORDER_MINE_LIST_RELOADING, FETCH_PRODUCTS_RELOADING, SEARCH_RELOADING } from './store/actions/actionTypes';

import ShowSnackbar from './components/UI/ShowSnackbar/ShowSnackbar';
import ShippingAddressScreen from './screens/ShippingAddressScreen/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import NotFound from './components/NotFound/NotFound';
import ProductListScreen from './screens/AdminScreens/ProductListScreen';
import EditProduct from './screens/AdminScreens/EditProduct';
import AddProduct from './screens/AdminScreens/AddProduct';
import OrderListScreen from './screens/AdminScreens/OrderListScreen';
import UsertListScreen from './screens/AdminScreens/UsertListScreen';
import SellerScreen from './screens/SellerScreen/SellerScreen';
import SearchScreen from './screens/SearchScreen/SearchScreen';

import SearchBox from './components/SearchBox/SearchBox';
import MessageBox from './components/UI/MessageBox/MessageBox';
import MapScreen from './screens/MapScreen/MapScreen';

const App = () => {
  const [ sidebarIsOpen, setSidebarIsOpen ] = useState(false);

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;
  
  const userData = useSelector(state => state.user);
  const { user } = userData;

  const categoriesList = useSelector(state => state.categories);
    const { allCategories, loading: categoriesLoading, error: categoriesError, msg: categoriesMsg } = categoriesList;

  const dispatch = useDispatch();
  const onSignout = () => dispatch(actions.signout());
  const onEmptyCart = (val) => dispatch(actions.emptyCart(val));

  const singoutHandler = () => {
    setSidebarIsOpen(false);
    onSignout();
    onEmptyCart(true);
  };  

  const orderHandler = () => {
    dispatch({ type: ORDER_MINE_LIST_RELOADING, value: true});
  };

  const productsHandler = () => {
    dispatch({ type: FETCH_PRODUCTS_RELOADING, value: true});
  };

  useEffect(() => {
    // window.onscroll = () => {
    //   const header = document.getElementById("myHeader");
    //   const endheader = document.getElementById("endheader");
    //   const sticky = 1;
    //   if (window.pageYOffset > sticky) {
    //     header.classList.add("sticky");
    //     endheader.classList.add("end-header");
    //   } else {
    //     header.classList.remove("sticky");
    //     endheader.classList.remove("end-header");
    //   }
    // };
  });

  useEffect(() => {
    dispatch(actions.listCategories());
  }, [ dispatch ]);

  return (
    <>
    <div className={sidebarIsOpen ? 'sidebar-backdrop' : ''}></div>
    <div className={sidebarIsOpen ? 'backdrop-not-scroll grid-container' : 'grid-container'}>
      
        <header id='myHeader' className='sticky'>
            <div className="row">
              <div>
              <button
                type='button'
                className='open-sidebar'
                onClick={() => setSidebarIsOpen(true)}>
                  <i className='fa fa-bars'></i>
              </button>
              <Link to='/' className="brand" onClick={() => dispatch(actions.homScreenList())}>
                    Amazona
              </Link>
              </div>
              <div id='serch-box'>
                <Route
                render={({history, match}) => <SearchBox match={match} history={history}></SearchBox>}
                ></Route>
              </div>
              <div className="row header-visible">
                {user && (user.isAdmin || user.isSeller) ?
                null
                : <Link to='/cart'>Cart
                {cartItems.length > 0 && (
                  <span className='badge'>{cartItems.length}</span>
                )}
                </Link>}
                {user ?
                (
                  <div className='dropdown'>
                    <Link className='row center' style={{ padding: "0"}} to='#'>
                      <img className="small-avater" src={user.image} alt={user.name} /> 
                      <div>
                      {user.name} <i className='fa fa-caret-down'></i> {' '}
                      </div>
                    </Link>
                    <ul className='dropdown-content' style={{ marginTop: '0'}}>
                      <li>
                        <Link to='/profile' onClick={() => {}}>User Profile</Link>
                      </li>
                      {user && (user.isAdmin || user.isSeller) ?
                      null
                      : <li>
                        <Link to='/ordershistory' onClick={() => {}}>Orders History</Link>
                      </li>}
                      <li>
                        <Link to='#signout' onClick={singoutHandler}>Sign Out</Link>
                      </li>
                    </ul>
                  </div>
                )
                : (<Link to='/signin'>Sign In</Link>)
                }
                {user && user.isSeller &&
                (
                  <div className='dropdown'>
                    <Link to='#'>
                    Seller <i className='fa fa-caret-down'></i> {' '}</Link>
                    <ul className='dropdown-content'>
                      <li>
                        <Link to='/productlist/seller' onClick={productsHandler}>Products</Link>
                      </li>
                      <li>
                        <Link to='/orderlist/seller' onClick={orderHandler}>Orders</Link>
                      </li>
                    </ul>
                  </div>
                )}   
                {user && user.isAdmin &&
                (
                  <div className='dropdown'>
                    <Link to='#'>
                      Admin <i className='fa fa-caret-down'></i> {' '}</Link>
                    <ul className='dropdown-content'>
                      <li>
                        <Link to='/dashboard' onClick={() => {}}>Dashboard</Link>
                      </li>
                      <li>
                        <Link to='/productlist' onClick={productsHandler}>Products</Link>
                      </li>
                      <li>
                        <Link to='/orderlist' onClick={orderHandler}>Orders</Link>
                      </li>
                      <li>
                        <Link to='/userlist' onClick={() => {}}>Users</Link>
                      </li>
                    </ul>
                  </div>
                )}   
                <div id='endheader' className='end-header'></div>           
              </div>
            </div>
        </header>
        
        <aside className={sidebarIsOpen ? 'open' : ''}>            
            <ul className='categories'>
              <li className='aside-visible'>
                {user ?
                (
                  <div>
                    <div className='row' style={{ padding: "0"}}>
                      <div className='row' style={{ padding: '0'}}>
                        <img className="small-avater" src={user.image} alt={user.name} /> 
                        <div>
                          {user.name}
                        </div>
                      </div>
                      <button
                      type='button'
                      className='close-sidebar-2'
                      onClick={() => setSidebarIsOpen(false)}>
                        <i className='fa fa-close'></i>
                      </button>
                    </div>
                    {user && (user.isAdmin || user.isSeller) ?
                    null
                    : <div style={{ marginTop: '1.2rem', marginBottom: '0', padding: '0'}} className='linkk'>
                      <Link to='/cart'
                      onClick={() => setSidebarIsOpen(false)}>Cart
                      {cartItems.length > 0 && (
                        <span className='badge'>{cartItems.length}</span>
                      )}</Link>
                    </div>}
                    <div style={{ marginTop: '1.2rem', marginBottom: '0'}} className='linkk'>
                      <Link to='/profile' 
                      onClick={() => setSidebarIsOpen(false)}>User Profile</Link>
                    </div>
                    {user && (user.isAdmin || user.isSeller) ?
                    null
                    : <div style={{ marginTop: '1.2rem', marginBottom: '0'}} className='linkk'>
                      <Link to='/ordershistory' 
                      onClick={() => setSidebarIsOpen(false)}>Orders History</Link>
                    </div>}
                    
                    <div style={{ marginTop: '1.2rem', marginBottom: '0'}} className='linkk'>
                      <Link style={{ color: '#f02020'}} to='#signout' onClick={singoutHandler}>Sign Out</Link>
                    </div>
                  </div>
                )
                : <div>
                  {user && (user.isAdmin || user.isSeller) ?
                  null
                  : <div style={{ marginTop: '1.0rem', marginBottom: '0', padding: '0'}} className='row linkk'>
                    <Link to='/cart'
                    onClick={() => setSidebarIsOpen(false)}>Cart
                    {cartItems.length > 0 && (
                      <span className='badge'>{cartItems.length}</span>
                    )}</Link>
                    <button
                      type='button'
                      className='close-sidebar-2'
                      onClick={() => setSidebarIsOpen(false)}>
                        <i className='fa fa-close'></i>
                      </button>
                  </div>}
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/signin'
                    onClick={() => setSidebarIsOpen(false)}>Sign In</Link>
                  </div>
                </div>
                }
                {user && user.isSeller &&
                <div style={{ marginTop: '2rem'}}>
                  <strong>Seller</strong>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/productlist/seller'
                    onClick={() => setSidebarIsOpen(false)}>Products</Link>
                  </div>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/orderlist/seller'
                    onClick={() => setSidebarIsOpen(false)}>Orders</Link>
                  </div>
                </div>
                }
                {user && user.isAdmin &&
                <div style={{ marginTop: '2rem'}}>
                  <strong>Admin</strong>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/dashboard'
                    onClick={() => setSidebarIsOpen(false)}>Dashboard</Link>
                  </div>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/productlist'
                    onClick={() => setSidebarIsOpen(false)}>Products</Link>
                  </div>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/orderlist'
                    onClick={() => setSidebarIsOpen(false)}>Orders</Link>
                  </div>
                  <div style={{ marginTop: '1.0rem', marginBottom: '0'}} className='linkk'>
                    <Link to='/userlist'
                    onClick={() => setSidebarIsOpen(false)}>Users</Link>
                  </div>
                </div>
                }
              </li>
              <li>
                <strong>Categories</strong>
                <button
                type='button'
                className='close-sidebar'
                onClick={() => setSidebarIsOpen(false)}>
                  <i className='fa fa-close'></i>
                </button>
              </li>
              {
                  categoriesLoading ?
                  <i className="fa fa-spinner fa-spin"></i> 
                  : categoriesError && categoriesMsg ?
                  <MessageBox isNotCenter variant='danger'>{categoriesMsg}</MessageBox>
                  : <ul style={{ margin: '0 1.5rem', padding: '0'}}>
                      {allCategories.map(c => (
                          <li key={c} style={{ margin: '0', padding: '0'}} className='linkk'>
                              <Link
                              style={{ padding: '0', marginTop: '0.5rem', marginBottom: '0.5rem'}}
                              to={`/search/category/${c}`}
                              onClick={() => {
                                setSidebarIsOpen(false);
                                dispatch({ type: SEARCH_RELOADING, value: true});
                              }}>
                              {c}
                              </Link>
                          </li>
                      ))}
                  </ul>
              } 
            </ul>
        </aside> 
               
        <main className='content'>        
        <div>
          <Suspense fallback={<p>Loading....</p>}>
              <ShowSnackbar />
              <Switch>
                <Route path='/productlist' component={ProductListScreen} exact />  
                <Route path='/orderlist' component={OrderListScreen} exact />              
                <Route path='/userlist' component={UsertListScreen} />    
                <Route path='/productlist/seller' component={ProductListScreen} />  
                <Route path='/orderlist/seller' component={OrderListScreen} />            
                <Route path='/seller/:id' component={SellerScreen} />              
                <Route path='/cart' component={CartScreen} />              
                <Route path='/product/add' component={AddProduct} />  
                <Route path='/product/:id' component={ProductScreen} exact/>
                <Route path='/product/:id/edit' component={EditProduct}  />                
                <Route path='/signin' component={SigninScreen} />
                <Route path='/register' component={RegisterScreen} />
                <Route path='/shipping' component={ShippingAddressScreen} />
                <Route path='/map' component={MapScreen} />
                <Route path='/payment' component={PaymentMethodScreen} />
                <Route path='/placeorder' component={PlaceOrderScreen} />                
                <Route path='/ordershistory' component={OrderHistoryScreen} />
                <Route path='/search/name/:name?' component={SearchScreen} exact />
                <Route path='/search/category/:category' component={SearchScreen} exact />
                <Route path='/search/category/:category/name/:name' component={SearchScreen} exact />
                <Route path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order' component={SearchScreen} exact />
                <Route path='/order/:id' component={OrderScreen} />
                <Route path='/profile' component={ProfileScreen} />
                <Route path='/' component={HomeScreen} exact />
                <Route path="" component={NotFound} />
                <Route path="*" component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </div>
        </main>
        <footer className="row center sticky-footer">
            All rights reserved to <a className='website-owner' 
            href='https://www.linkedin.com/in/ahmed-taha-2a0241178/' target='blank'
            >Ahmed Taha</a>
        </footer>
    </div>
    </>
  );
}

export default App;

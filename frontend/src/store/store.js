import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import productsStore from './reducers/products';
import productsDetails from './reducers/productsDetails';
import categories from './reducers/category';
import user from './reducers/user';
import cart from './reducers/cart';
import order from './reducers/order';
import uiReducer from './reducers/uiReducer';
import { getlocalStorageItem } from '../shared/utility';

const initState = {
    cart: {
        cartItems: getlocalStorageItem('cartItems') ? getlocalStorageItem('cartItems') : [],
        shippingAddress: getlocalStorageItem('shippingAddress') ? getlocalStorageItem('shippingAddress') : {},
        paymentMethod: null,
        addressMap: null,
    },
    user: {
        users: [],
        usersLoading: true,
        usersError: false,
        usersMsg: null,
        updateLoading: false,
        updateError: false,
        updateMsg: null,
        deleteLoading: false,
        deleteError: false,
        deleteMsg: null,
        resultUser: null,
        loading: false,
        error: false,
        msg: null,
        user: getlocalStorageItem('userData') ? getlocalStorageItem('userData') : null,
    }
};

const reducer = combineReducers({
    categories: categories,
    products: productsStore,
    productsDetails: productsDetails,
    cart: cart,
    order: order,
    user: user,
    uiReducer: uiReducer,
});

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;

const store = createStore(
    reducer, 
    initState,
    composeEnhancers(applyMiddleware(thunk))    
);

export default store;
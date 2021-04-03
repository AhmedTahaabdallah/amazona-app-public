import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initState = {
    page: null,
    pages: null,
    productsCount: null,
    loadMore: false,
    sellerPage: null,
    sellerPages: null,
    sellerProductsCount: null,
    sellerLoadMore: false,
    searchPage: null,
    searchPages: null,
    searchProductsCount: null,
    searchLoadMore: false,
    products: [],    
    reloading: true,
    loading: true,
    error: false,
    msg: null,
    sellerProducts: [],   
    sellerReloading: true,
    sellerLoading: true,
    sellerError: false,
    sellerMsg: null,
    searchProducts: [],    
    searchReloading: true,
    searchLoading: true,
    searchError: false,
    searchMsg: null,
    createdProduct: null,    
    createdLoading: false,
    createdError: false,
    createdMsg: null,
    createdStatus: 'notdone',
    featuredProducts: [],    
    topSellers: [],    
    homeScreenReloading: true,
    homeScreenLoading: true,
    homeScreenError: false,
    homeScreenMsg: null,
};

const allProductsReloading = (state, action) => {
    return updateObject(state, { 
        reloading: action.value, 
    });
};

const sellerReloading = (state, action) => {
    return updateObject(state, { 
        sellerReloading: action.value, 
    });
};

const searchReloading = (state, action) => {
    return updateObject(state, { 
        searchReloading: action.value, 
    });
};

const allProductsStart = (state, action) => {
    let finalSt = {};
    if(action.typee === 'seller') {
        if(action.loadMore === undefined) {
            finalSt = { 
                sellerPage: null,
                sellerPages: null,
                sellerProductsCount: null,
                sellerProducts: [],   
                sellerReloading: true,
                sellerLoading: true,
                searchLoading: false,
                loading: false, 
                sellerError: false,
                sellerMsg: null,
                createdStatus: 'notdone',
            };
        } else {            
            finalSt = { sellerLoadMore: true };
        }
    } else if(action.typee === 'search') {
        if(action.loadMore === undefined) {
            finalSt = { 
                searchPage: null,
                searchPages: null,
                searchProductsCount: null,
                searchProducts: [],   
                searchReloading: true,
                searchLoading: true,
                sellerLoading: false,
                loading: false, 
                searchError: false,
                searchMsg: null,
                createdStatus: 'notdone',
            };
        } else {            
            finalSt = { searchLoadMore: true };
        }
    } else {
        if(action.loadMore === undefined) {
            finalSt = { 
                page: null,
                pages: null,
                productsCount: null, 
                products: [],
                loading: true,
                searchLoading: false,
                sellerLoading: false,
                reloading: true,            
                error: false, 
                msg: null, 
                createdStatus: 'notdone',
            };
        } else {            
            finalSt = { loadMore: true };
        }
    }
    return updateObject(state, finalSt);
};

const allProductsSuccess = (state, action) => {
    if(action.loadMore === undefined && action.typee !== 'search') {
        window.scrollTo(0, 0);
    }
    let finalSt = {};
    if(action.typee === 'seller') {       
        if(action.loadMore === undefined) {
            finalSt = { 
                sellerPage: action.plusPageNumer === true ? Number(action.page) + 1 : action.page,
                sellerPages: action.pages,
                sellerProductsCount: action.productsCount,
                sellerLoading: false, 
                sellerProducts: action.products, 
                sellerError: false, 
                sellerMsg: null, 
            };
        } else { 
            let finalProducts = state.sellerProducts;      
            if(action.listType === 'add') {
                finalProducts = action.products;
            } else {
                for(let i = 0; i < action.products.length; i++) {
                    finalProducts.push(action.products[i]);
                }
            }
            finalSt = { 
                sellerLoadMore: false,
                sellerPage: action.plusPageNumer ? Number(action.page) + 1 : action.page,
                sellerPages: action.pages,
                sellerProductsCount: action.productsCount,
                sellerProducts: finalProducts
            };
        }
    } else if(action.typee === 'search') {        
        if(action.loadMore === undefined) {
            finalSt = { 
                searchPage: action.plusPageNumer ? Number(action.page) + 1 : action.page,
                searchPages: action.pages,
                searchProductsCount: action.productsCount,
                searchLoading: false, 
                searchProducts: action.products, 
                searchError: false, 
                searchMsg: null, 
            };
        } else {       
            let finalProducts = state.searchProducts;      
            if(action.listType === 'add') {
                finalProducts = action.products;
            } else {
                for(let i = 0; i < action.products.length; i++) {
                    finalProducts.push(action.products[i]);
                }
            }
            finalSt = { 
                searchLoadMore: false,
                searchPage: action.plusPageNumer ? Number(action.page) + 1 : action.page,
                searchPages: action.pages,
                searchProductsCount: action.productsCount,
                searchProducts: finalProducts
            };
        }
    } else {
        if(action.loadMore === undefined) {
            finalSt = { 
                page: action.plusPageNumer === true ? Number(action.page) + 1 : action.page,
                pages: action.pages,
                productsCount: action.productsCount,
                loading: false, 
                products: action.products, 
                error: false, 
                msg: null, 
            };
        } else {       
            let finalProducts = state.products;      
            if(action.listType === 'add') {
                finalProducts = action.products;
            } else {
                for(let i = 0; i < action.products.length; i++) {
                    finalProducts.push(action.products[i]);
                }
            }
            finalSt = { 
                loadMore: false,
                page: action.plusPageNumer ? Number(action.page) + 1 : action.page,
                pages: action.pages,
                productsCount: action.productsCount,
                products: finalProducts
            };
        }
    }
    return updateObject(state, finalSt);
};

const allProductsFail = (state, action) => {
    let finalSt = {};
    if(action.typee === 'seller') {        
        if(action.loadMore === undefined) {
            finalSt = { 
                sellerPage: null,
                sellerPages: null,
                sellerProductsCount: null,
                sellerLoading: false, 
                sellerProducts: [], 
                sellerError: true, 
                sellerMsg: action.msg, 
            };
        } else {            
            finalSt = { sellerLoadMore: false };
        }
    } else if(action.typee === 'search') {
        if(action.loadMore === undefined) {
            finalSt = { 
                searchPage: null,
                searchPages: null,
                searchProductsCount: null,
                searchLoading: false, 
                searchProducts: [], 
                searchError: true, 
                searchMsg: action.msg,  
            };
        } else {            
            finalSt = { searchLoadMore: false };
        }
    } else {
        if(action.loadMore === undefined) {
            finalSt = { 
                page: null,
                pages: null,
                productsCount: null,
                loading: false, 
                products: [], 
                error: true, 
                msg: action.msg,  
            };
        } else {            
            finalSt = { loadMore: false };
        }
    }
    return updateObject(state, finalSt);
};

const createProductStart = (state) => {
    return updateObject(state, { 
        createdProduct: null,    
        createdLoading: true,
        createdError: false,
        createdMsg: null,
        createdStatus: 'notdone',
    });
};

const createProductSuccess = (state, action) => {
    return updateObject(state, { 
        createdLoading: false, 
        createdProduct: action.product, 
        createdError: false, 
        createdMsg: action.msg, 
        createdStatus: 'done', 
    });
};

const createProductFail = (state, action) => {
    return updateObject(state, { 
        createdLoading: false, 
        createdProduct: null, 
        createdError: true, 
        createdMsg: action.msg, 
        createdStatus: 'notdone', 
    });
};

const createProductReset = (state) => {
    return updateObject(state, { createdError: false, createdMsg: null, });
};

const updateProductStart = (state) => {
    return updateObject(state, { 
        createdProduct: null,    
        createdLoading: true,
        createdError: false,
        createdMsg: null,
        createdStatus: 'notdone',
    });
};

const updateProductSuccess = (state, action) => {
    const oldProducts = state.sellerProducts.length > 0 ? state.sellerProducts : state.products;
    if(oldProducts.length > 0) {
        const index = oldProducts.findIndex(product => product._id === action.product._id);
        const products = oldProducts;
        if(index >= 0) {
            products[index] = action.product;
        }
        return updateObject(state, { 
            createdLoading: false, 
            products: state.sellerProducts.length > 0 ? [] : products, 
            sellerProducts: state.sellerProducts.length > 0 ? products : [], 
            createdProduct: action.product, 
            createdError: false, 
            createdMsg: action.msg, 
            createdStatus: 'done', 
        });
    } else {
        return updateObject(state, { 
            createdLoading: false, 
            createdProduct: action.product, 
            createdError: false, 
            createdMsg: action.msg, 
            createdStatus: 'done', 
        });
    }     
};

const updateProductFail = (state, action) => {
    return updateObject(state, { 
        createdLoading: false, 
        createdProduct: null, 
        createdError: true, 
        createdMsg: action.msg, 
        createdStatus: 'notdone', 
    });
};

const createdChangeStatus = (state) => {
    return updateObject(state, { 
        createdStatus: 'notdone', 
    });
};

const deleteProductStart = (state) => {
    return updateObject(state, { 
        createdLoading: true,
        createdError: false,
        createdMsg: null,
    });
};

const deleteProductSuccess = (state, action) => {
    if(state.products.length > 0) {
        const index = state.products.findIndex(product => product._id === action.productId);
        const products = state.products;
        if(index >= 0) {
            products.splice(index, 1);
        }
        return updateObject(state, { 
            createdLoading: false, 
            products: products, 
            createdError: false, 
            createdMsg: action.msg, 
        });
    } else {
        return updateObject(state, { 
            createdLoading: false, 
            createdError: false, 
            createdMsg: action.msg
        });
    }     
};

const deleteProductFail = (state, action) => {
    return updateObject(state, { 
        createdLoading: false, 
        createdError: true, 
        createdMsg: action.msg, 
    });
};

const homeScreenReloading = (state, action) => {
    return updateObject(state, { 
        homeScreenReloading: action.value, 
    });
};

const homeScreenStart = (state) => {
    return updateObject(state, { 
        featuredProducts: [],    
        topSellers: [],    
        homeScreenReloading: true,
        homeScreenLoading: true,
        homeScreenError: false,
        homeScreenMsg: null,
    });
};

const homeScreenSuccess = (state, action) => {
    return updateObject(state, { 
        featuredProducts: action.featuredProducts,    
        topSellers: action.topSellers,    
        homeScreenLoading: false,
        homeScreenError: false,
        homeScreenMsg: null,
    });
};

const homeScreenFail = (state, action) => {
    return updateObject(state, { 
        featuredProducts: [],    
        topSellers: [],    
        homeScreenLoading: false,
        homeScreenError: true,
        homeScreenMsg: action.msg,
    });
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_PRODUCTS_RELOADING: return allProductsReloading(state, action);
        case actionTypes.SELLER_RELOADING: return sellerReloading(state, action);
        case actionTypes.SEARCH_RELOADING: return searchReloading(state, action);
        case actionTypes.FETCH_PRODUCTS_START: return allProductsStart(state, action);
        case actionTypes.FETCH_PRODUCTS_SUCCESS: return allProductsSuccess(state, action);
        case actionTypes.FETCH_PRODUCTS_FAIL: return allProductsFail(state, action);    
        case actionTypes.PRODUCT_CREATE_START: return createProductStart(state);
        case actionTypes.PRODUCT_CREATE_SUCCESS: return createProductSuccess(state, action);
        case actionTypes.PRODUCT_CREATE_FAIL: return createProductFail(state, action);             
        case actionTypes.PRODUCT_CREATE_RESET: return createProductReset(state);      
        case actionTypes.PRODUCT_UPDATE_START: return updateProductStart(state);
        case actionTypes.PRODUCT_UPDATE_SUCCESS: return updateProductSuccess(state, action);
        case actionTypes.PRODUCT_UPDATE_FAIL: return updateProductFail(state, action);       
        case actionTypes.PRODUCT_CHANGE_STATUS: return createdChangeStatus(state);  
        case actionTypes.PRODUCT_DELETE_START: return deleteProductStart(state);
        case actionTypes.PRODUCT_DELETE_SUCCESS: return deleteProductSuccess(state, action);
        case actionTypes.PRODUCT_DELETE_FAIL: return deleteProductFail(state, action);            
        case actionTypes.HOME_SCREEN_LIST_RELOADING: return homeScreenReloading(state, action);  
        case actionTypes.HOME_SCREEN_LIST_START: return homeScreenStart(state);
        case actionTypes.HOME_SCREEN_LIST_SUCCESS: return homeScreenSuccess(state, action);
        case actionTypes.HOME_SCREEN_LIST_FAIL: return homeScreenFail(state, action);            
        default: return state;
    }
};

export default reducer;
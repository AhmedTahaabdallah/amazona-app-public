import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initState = {
    allCategories: [],  
    loading: false,
    error: false,
    msg: null,
};

const categoriesStart = (state) => {
    return updateObject(state, { loading: true, allCategories: [], error: false, msg: null, });
};

const categoriesSuccess = (state, action) => {
    window.scrollTo(0, 0);
    return updateObject(state, { loading: false, allCategories: action.allCategories, error: false, msg: null, });
};

const categoriesFail = (state, action) => {
    return updateObject(state, { loading: false, allCategories: [], error: true, msg: action.msg, });
};

const reducer = (state = initState, action) => {
    switch(action.type) {
        case actionTypes.CATEGORY_LIST_START: return categoriesStart(state);
        case actionTypes.CATEGORY_LIST_SUCCESS: return categoriesSuccess(state, action);
        case actionTypes.CATEGORY_LIST_FAIL: return categoriesFail(state, action);               
        default: return state;
    }
};

export default reducer;
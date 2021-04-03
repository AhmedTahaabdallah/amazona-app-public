import * as actionTypes from './actionTypes';
import axios from '../../amazon-axios';

export const listCategories = () => {
    return async(dispatch) => {
        dispatch({ type: actionTypes.CATEGORY_LIST_START });
        try{
            const {data} = await axios.get(`/api/categories`);
            dispatch({ 
                type: actionTypes.CATEGORY_LIST_SUCCESS, 
                allCategories: data
            });     
        } catch(err) {
            const errMsg = err.response && err.response.data && err.response.data.message ?
            err.response.data.message : err.message;
            dispatch({ 
                type: actionTypes.CATEGORY_LIST_FAIL, 
                msg: errMsg
            });                   
        }  
    };
}

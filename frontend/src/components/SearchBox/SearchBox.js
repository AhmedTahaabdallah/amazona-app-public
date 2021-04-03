import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SEARCH_RELOADING } from '../../store/actions/actionTypes';

const SearchBox = (props) => {
    const [ name, setName ] = useState('');
    const dispatch = useDispatch();
    
    const submitHandler = (e) => {
        e.preventDefault();
        props.history.push(`/search/name/${name}`);
        dispatch({ type: SEARCH_RELOADING, value: true});
        setName('');
    }

    return (
        <form className='search' onSubmit={submitHandler}>
            <div>
                <input 
                    type='text'
                    name='q'
                    id='q'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button className='primary' type='submit'>
                    <i className='fa fa-search'></i>
                </button>
            </div>
        </form>
      );
};

export default SearchBox;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';

const SigninScreen = props => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const redirect = props.location.search ? props.location.search.split('=')[1] : '/';

    const userData = useSelector(state => state.user);
    const { user, signLoading, signError, signMsg } = userData;
    const dispatch = useDispatch();

    useEffect(() => {
        initAllLoading(dispatch); 
        if (user) {
            props.history.push(redirect);
        }
    }, [user, redirect, props.history, dispatch]);
    
    const onResetSignMsgError = () => dispatch(actions.resetSignMsgError());
    const onSinin = (email, password) => dispatch(actions.signin(email, password));
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {
        if(signError) {
            onShowErrorSnackbar(signMsg);
            onResetSignMsgError();
        } else if(!signError && signMsg) {
            onShowSuccessSnackbar(signMsg);
            onResetSignMsgError();
        }
    });

    const sumitHandler = (e) => {
        e.preventDefault();
        if(signLoading) {
            return;
        }
        const isEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
        if(!isEmail.test(email)) {
            onShowErrorSnackbar('invailed email.');
            document.getElementById("email").focus();
            return;
        }
        if(password.trim().length <= 5) {
            onShowErrorSnackbar('password must be more than 5 characters.');
            document.getElementById("password").focus();
            return;
        }
        onSinin(email, password);
    };

    return (
        <div className='parent'>
            <form className='form' onSubmit={sumitHandler}>
                <div>
                    <h1>Sign In</h1>
                </div>
                <div>
                    <label htmlFor='email'>Email address</label>
                    <input 
                    type='email'
                    id='email'
                    value={email}
                    placeholder='Enter Email'
                    onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                    type='password'
                    id='password'
                    value={password}
                    placeholder='Enter password'
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button 
                    className='primary'
                    type='submit'
                    >{signLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Sign In'}</button>
                </div>
                <div>
                    <div>
                        New Customer? <Link to={`/register?redirect=${redirect}`}>Create Your Account</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default SigninScreen;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';

const RegisterScreen = props => {
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const redirect = props.location.search ? props.location.search.split('=')[1] : '/';

    const userData = useSelector(state => state.user);
    const { user, signLoading, signError, signMsg } = userData;

    const dispatch = useDispatch();

    useEffect(() => {
        initAllLoading(dispatch); 
        if (user) {
            props.history.push(redirect);
        }
    }, [user, redirect, props.history, dispatch ]);

    
    const onResetMsgError = () => dispatch(actions.resetSignMsgError());
    const onRegister = (name, email, password) => dispatch(actions.register(name, email, password));
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {
        if(signError) {
            onShowErrorSnackbar(signMsg);
            onResetMsgError();
        } else if(!signError && signMsg) {
            onShowSuccessSnackbar(signMsg);
            onResetMsgError();
        }
    });

    const sumitHandler = (e) => {
        e.preventDefault();
        if(signLoading) {
            return;
        }
        if(name.trim().length <= 5) {
            onShowErrorSnackbar('name must be more than 5 characters.');
            document.getElementById("name").focus();
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
        if(password !== confirmPassword) {
            onShowErrorSnackbar('password and confirm Passowrd are not match');
            document.getElementById("confirmPassword").focus();
            return;
        }
        onRegister(name, email, password);
    };

    return (
        <div className='parent'>
            <form className='form' onSubmit={sumitHandler}>
                <div>
                    <h1>Create Account</h1>
                </div>
                <div>
                    <label htmlFor='name'>User Name</label>
                    <input 
                    type='text'
                    id='name'
                    value={name}
                    placeholder='Enter Name'
                    onChange={e => setName(e.target.value)}
                    />
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
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input 
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    placeholder='Enter Confirm Password'
                    onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button 
                    className='primary'
                    type='submit'
                    >{signLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Register'}</button>
                </div>
                <div>
                    <div>
                        Already have an account? <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RegisterScreen;
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../store/actions/index';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import { initAllLoading } from '../../shared/utility';

const ProfileScreen = props => {    
    const userData = useSelector(state => state.user);
    const { resultUser, loading, error, msg, updateLoading, updateError,updateMsg, user } = userData;

    const [ isFetchUserDetails, setIsFetchUserDetails ] = useState(false);
    const [ name, setName ] = useState('');
    const [ image, setImage ] = useState('');
    const [ imageUploaded, setImageeUploaded ] = useState(null);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ sellerName, setSellerName ] = useState('');
    const [ sellerLogo, setSellerLogo ] = useState('');
    const [ logoUploaded, setLogoUploaded ] = useState(null);
    const [ sellerDescription, setSellerDescription ] = useState('');

    const dispatch = useDispatch();
    const onUserDetails = useCallback((userId) => dispatch(actions.userDetails(userId)), [ dispatch ]);
    const onResetUpdateUserProfileMsgError = useCallback(() => dispatch(actions.resetUpdateUserProfileMsgError()), [ dispatch ]);
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=profile`);
        }  
        if(updateError) {
            onShowErrorSnackbar(updateMsg);
            onResetUpdateUserProfileMsgError();
        } else if(!updateError && updateMsg) {
            onShowSuccessSnackbar(updateMsg);
            onResetUpdateUserProfileMsgError();
        }    
    });
    
    useEffect(() => {     
        initAllLoading(dispatch, 'intiUserDetails'); 
        if(!isFetchUserDetails) {
            onResetUpdateUserProfileMsgError();
            setIsFetchUserDetails(true);
            onUserDetails(user._id);
        }     
        if(resultUser) {
            setName(resultUser.name);      
            setImage(resultUser.image);      
            setEmail(resultUser.email);
            if(resultUser.isSeller) {
                setSellerName(resultUser.seller && resultUser.seller.name ? resultUser.seller.name : '');    
                setSellerLogo(resultUser.seller && resultUser.seller.logo ? resultUser.seller.logo : '');    
                setSellerDescription(resultUser.seller && resultUser.seller.description ? resultUser.seller.description : '');    
            }
        }      
    }, [ onUserDetails, resultUser, user, dispatch, isFetchUserDetails, onResetUpdateUserProfileMsgError ]);

    function uploadFileHandler(input, typee) {
        if (input && input.target.files && input.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                if(typee === 'logo') {
                    setLogoUploaded(input.target.files[0]);
                    document.getElementById("logo-avater").src=  e.currentTarget.result;
                } else {
                    setImageeUploaded(input.target.files[0]);
                    document.getElementById("image-avater").src=  e.currentTarget.result;
                }                
            };

            reader.readAsDataURL(input.target.files[0]);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(updateLoading) {
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
        if(password.trim() !== '' && password.trim().length <= 5) {
            onShowErrorSnackbar('password must be more than 5 characters.');
            document.getElementById("password").focus();
            return;
        }
        if(password.trim() !== '' && password !== confirmPassword) {
            onShowErrorSnackbar('password and confirm Passowrd are not match');
            document.getElementById("confirmPassword").focus();
            return;
        }
        if(user.isSeller && sellerName.trim().length <= 5) {
            onShowErrorSnackbar('Seller Name must be more than 5 characters.');
            document.getElementById("sellerName").focus();
            return;
        }
        if(user.isSeller && sellerDescription.trim().length <= 10) {
            onShowErrorSnackbar('Seller Description must be more than 10 characters.');
            document.getElementById("sellerDescription").focus();
            return;
        }
        const bodyFormData = new FormData();
        bodyFormData.append('userId', user._id);
        bodyFormData.append('name', name);
        bodyFormData.append('email', email);
        bodyFormData.append('password', password);
        if(imageUploaded && !user.isSeller) {
            bodyFormData.append('files', imageUploaded);
            bodyFormData.append('fileType', 'image');
        }
        if(user.isSeller) {
            bodyFormData.append('sellerName', sellerName);
            bodyFormData.append('sellerDescription', sellerDescription);
            if(imageUploaded && logoUploaded) {
                bodyFormData.append('files', imageUploaded);
                bodyFormData.append('files', logoUploaded);
                bodyFormData.append('fileType', 'both');
            } else if(!imageUploaded && logoUploaded) {
                bodyFormData.append('files', logoUploaded);
                bodyFormData.append('fileType', 'logo');
            } else if(imageUploaded && !logoUploaded) {
                bodyFormData.append('files', imageUploaded);
                bodyFormData.append('fileType', 'image');
            }
        }
        dispatch(actions.updateUserProfile(bodyFormData));
    };

    return (<div>
        {loading ?
        <LoadingBox /> 
        : error && msg ?
        <MessageBox variant='danger'>{msg}</MessageBox>
        : <div className='parent'>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
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
                {imageUploaded ? 
                <img id='image-avater' src='' alt=''/>
                : <img 
                style={user && !user.isAdmin && !user.isSeller ?
                    {
                        maxHeight: '34%'
                    } : {}}
                className='image' src={image} alt={name} />}
                <div>
                    <input 
                    type='file' 
                    id='file' 
                    onChange={e => uploadFileHandler(e, 'image')} 
                    accept="image/*"
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
                    placeholder='Enter password'
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input 
                    type='password'
                    id='confirmPassword'
                    placeholder='Enter Confirm Password'
                    onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                {user && user.isSeller && (
                    <>
                        <h1>Seller</h1>
                        <div>
                            <label htmlFor='sellerName'>Seller Name</label>
                            <input 
                            type='text'
                            id='sellerName'
                            placeholder='Enter Seller Name'
                            value={sellerName}
                            onChange={e => setSellerName(e.target.value)}
                            />
                        </div>
                        {logoUploaded ? 
                        <img id='logo-avater' src='' alt=''/>
                        : <img className='image' src={sellerLogo} alt={sellerName} />}
                        <div>
                            <input 
                            type='file' 
                            id='file1' 
                            onChange={e => uploadFileHandler(e, 'logo')} 
                            accept="image/*"
                            />
                        </div>
                        <div>
                            <label htmlFor='sellerDescription'>Seller Description</label>
                            <textarea
                            rows='3'  
                            type='text'
                            id='sellerDescription'
                            placeholder='Enter Seller Description'
                            value={sellerDescription}
                            onChange={e => setSellerDescription(e.target.value)}
                            />
                        </div>
                    </>
                )}
                <div style={{ margin: '2.5rem 1rem 0 1rem' }}>
                    <button 
                    className='primary'
                    type='submit'
                    >{updateLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Update'}</button>
                </div>
            </form>
        </div>}
    </div>);
};

export default ProfileScreen;

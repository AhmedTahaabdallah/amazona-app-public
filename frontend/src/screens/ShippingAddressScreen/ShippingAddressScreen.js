import React, { useState, useEffect } from 'react';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import * as actions from '../../store/actions/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { initAllLoading } from '../../shared/utility';
import SweetAlert from 'react-bootstrap-sweetalert';

const ShippingAddressScreen = props => {

    const userData = useSelector(state => state.user);
    const { user } = userData;
    
    const shippingAddressData = useSelector(state => state.cart);
    const { cartItems, shippingAddress, addressMap } = shippingAddressData;
    const [ isInitLoading, setIsInitLoading ] = useState(false);    
    const [ fullName, setFullName ] = useState(shippingAddress.fullName ?? '');    
    const [ country, setCountry ] = useState(shippingAddress.country ?? '');
    const [ city, setCity ] = useState(shippingAddress.city ?? '');
    const [ address, setAddress ] = useState(shippingAddress.address ?? '');
    const [ potalCode, setPotalCode ] = useState(shippingAddress.potalCode ?? '');
    const [ continuePayment, setContinuePayment ] = useState(false);

    
    
    const dispatch = useDispatch();
    const onSaveShippingAddress = (data) => dispatch(actions.saveShippingAddress(data));
    //const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {          
        if(!user) {
            props.history.push('/signin?redirect=shipping')
        } else if(!cartItems || cartItems.length === 0){
            props.history.push('/cart')
        }
        if(!isInitLoading) {
            setIsInitLoading(true);
            initAllLoading(dispatch); 
        }
    }, [ user, cartItems, props, dispatch, isInitLoading]);

    const sumitHandler = (e) => {
        e.preventDefault();
        if(fullName.trim().length <= 5) {
            onShowErrorSnackbar('Full Name must be more than 5 characters.');
            document.getElementById("fullName").focus();
            return;
        }
        if(country.trim().length <= 1) {
            onShowErrorSnackbar('Country must be more than 5 characters.');
            document.getElementById("country").focus();
            return;
        }
        if(city.trim().length <= 1) {
            onShowErrorSnackbar('City must be more than 5 characters.');
            document.getElementById("city").focus();
            return;
        }
        if(address.trim().length <= 5) {
            onShowErrorSnackbar('Address must be more than 5 characters.');
            document.getElementById("address").focus();
            return;
        }
        if(potalCode.trim().length !== 6) {
            onShowErrorSnackbar('PotalCode must be 6 numbers.');
            document.getElementById("potalCode").focus();
            return;
        }
        // const newLat = addressMap ? addressMap.lat : lat;
        // const newLng = addressMap ? addressMap.lng : lng;
        if(addressMap) {
            goToPaymentScreen();
        } else {
            setContinuePayment(true);
        }        
    };

    const goToPaymentScreen = () => {
        onSaveShippingAddress({ 
            fullName, address, city, potalCode, country, 
            addressMap: addressMap ? addressMap.addressMap : null, 
            lat: addressMap ? addressMap.lat : null, 
            lng: addressMap ? addressMap.lng : null 
        });
        props.history.push('/payment');
    };

    const chooseOnMap = () => {
        onSaveShippingAddress({ 
            fullName, address, city, potalCode, country, 
            addressMap: addressMap ? addressMap.addressMap : null, 
            lat: addressMap ? addressMap.lat : null, 
            lng: addressMap ? addressMap.lng : null  
        });
        props.history.push('/map');
    }

    let comm = (
        <div >
            <CheckoutSteps step1 step2 />
            {continuePayment && <SweetAlert
                warning
                title="Location"    
                onConfirm={() => {}} 
                onCancel={() => {}}
                customButtons={
                    <React.Fragment>
                      <button 
                      type='button' 
                      className='small edit'
                      onClick={() => {
                          setContinuePayment(false);;
                      }}>Cancel</button>
                      <button 
                      style={{
                            margin: '0 8px'
                        }}
                      type='button' 
                      className='small delete'
                      onClick={() => {
                          setContinuePayment(false);
                          goToPaymentScreen();
                      }}>
                          Continue
                    </button>
                    </React.Fragment>
                  }        
                >
                You didn't set your location on map. Continue?
                </SweetAlert>}
            <div className='parent2'>
                <form className='form' onSubmit={sumitHandler}>
                    <div>
                        <h1>Shipping Address</h1>
                    </div>
                    <div>
                        <label htmlFor='fullName'>Full Name</label>
                        <input 
                        type='text'
                        id='fullName'
                        value={fullName}
                        placeholder='Enter Full Name'
                        onChange={e => setFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='country'>Country</label>
                        <input 
                        type='text'
                        id='country'
                        value={country}
                        placeholder='Enter Country'
                        onChange={e => setCountry(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='city'>City</label>
                        <input 
                        type='text'
                        id='city'
                        value={city}
                        placeholder='Enter City'
                        onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input 
                        type='text'
                        id='address'
                        value={address}
                        placeholder='Enter Address'
                        onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='potalCode'>PotalCode</label>
                        <input 
                        type='number'
                        id='potalCode'
                        value={potalCode}
                        placeholder='Enter PotalCode'
                        onChange={e => setPotalCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='chooseOnMap'>Location</label>
                        <button 
                        onClick={chooseOnMap}
                        type='button'
                        >Choose On Map</button>
                    </div>
                    <div>
                        <button 
                        className='primary'
                        type='submit'
                        >Continue</button>
                    </div>
                </form>
            </div>
        </div>
    );
    if(!user || (user && user.isAdmin) || (!cartItems || cartItems.length === 0)){
        comm = null;
    }
    return comm;
};

export default ShippingAddressScreen;

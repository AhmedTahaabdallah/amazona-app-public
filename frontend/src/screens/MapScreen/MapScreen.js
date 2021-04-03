import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    LoadScript,
    GoogleMap,
    StandaloneSearchBox,
    Marker
 } from '@react-google-maps/api';
import './MapScreen.css';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import axios from '../../amazon-axios';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions/index';
import { USER_ADDRESS_MAP_CONFIRM } from '../../store/actions/actionTypes';
import markerIcon from '../../assets/images/marker.jpeg';

const libs = [ 'places' ];
const defaultLocation = { lat: 30.064137, lng: 31.248448 }

const MapScreen = props => {
    const [ isFetch, setIsFetch ] = useState(false);
    const [ googleApiKey, setGoogleApiKey ] = useState('');
    const [ center, setCenter ] = useState(defaultLocation);
    const [ location, setLocation ] = useState(center);
    const [ address, setAddress ] = useState('');
    const [ newAddress, setNewAddress ] = useState({
        lat: null,
        lng: null,
        addressMap: null,
    });

    const shippingAddressData = useSelector(state => state.cart);
    const { shippingAddress, addressMap } = shippingAddressData;

    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

    const dispatch = useDispatch();
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = useCallback((msg) => dispatch(actions.showErrorSnackbar(msg)), [ dispatch ]);

    const onLoad = map => {
        mapRef.current = map;
    };

    const onMarkerLoad = marker => {
        markerRef.current = marker;
    };

    const onLoadPlaces = place => {
        placeRef.current = place;
    };

    const onIdle = () => {
        setCenter({
            lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng(),
        });
        setLocation({
            lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng(),
        });
    };

    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        const newAddress = placeRef.current.getPlaces()[0].formatted_address;
        setCenter({ lat: place.lat(), lng: place.lng() });
        setLocation({ lat: place.lat(), lng: place.lng() });
        setNewAddress({
            lat: place.lat(),
            lng: place.lng(),
            addressMap: newAddress,
        });
    };

    const onConfirm = () => {
        if(newAddress.addressMap && newAddress.lat && newAddress.lng){    
            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                address: {
                    lat: location.lat,
                    lng: location.lng,
                    addressMap: address,
                }
            });
            onShowSuccessSnackbar('location selected succesfully.');
            props.history.push('/shipping');
        } else {
            onShowErrorSnackbar('please enter your address.');
        }
    };

    const onGoogleMapClickedHandler = async(location) => {
        const newLat = location.latLng.lat();
        const newLng = location.latLng.lng();
        setCenter({ 
            lat: newLat, 
            lng: newLng
        });
        setLocation({ 
            lat: newLat, 
            lng: newLng
        });
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=${googleApiKey}`);
        if(data.status === 'OK') {
            setAddress(data.results[0].formatted_address);
            setNewAddress({
                lat: newLat,
                lng: newLng,
                addressMap: data.results[0].formatted_address,
            });
        }

    };

    const getUserCurrentLocation = useCallback(() => {
        if(!navigator.geolocation) {
            onShowErrorSnackbar('Get Your Current Location is not supported by this browser, So select your address.');
        } else {
            navigator.geolocation.getCurrentPosition(position => {
                setCenter({ 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                });
                setLocation({ 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude
                });
            });
        }
    }, [ onShowErrorSnackbar ]);

    useEffect(() => {
        if(!isFetch) {
            setIsFetch(true)
            const fetch = async() => {
                const { data } = await axios.get('/api/config/google');
                setGoogleApiKey(data);
                if(shippingAddress && shippingAddress.lat 
                && shippingAddress.lng && shippingAddress.addressMap) {
                    setCenter({ 
                        lat: shippingAddress.lat, 
                        lng: shippingAddress.lng
                    });
                    setLocation({ 
                        lat: shippingAddress.lat, 
                        lng: shippingAddress.lng
                    });
                    setAddress(shippingAddress.addressMap);
                    setNewAddress({
                        lat: shippingAddress.lat,
                        lng: shippingAddress.lng,
                        addressMap: shippingAddress.addressMap,
                    });
                } else if(addressMap && addressMap.lat 
                    && addressMap.lng && addressMap.addressMap) {
                        setCenter({ 
                            lat: addressMap.lat, 
                            lng: addressMap.lng
                        });
                        setLocation({ 
                            lat: addressMap.lat, 
                            lng: addressMap.lng
                        });
                        setAddress(addressMap.addressMap);
                        setNewAddress({
                            lat: addressMap.lat,
                            lng: addressMap.lng,
                            addressMap: addressMap.addressMap,
                        });
                    } else {
                    getUserCurrentLocation();
                }            
            };
            fetch();
        }        
    }, [ getUserCurrentLocation, shippingAddress, addressMap, isFetch ]);

    return googleApiKey ? 
    (
        <div className='full-container'>
            <LoadScript
                libraries={libs}
                googleMapsApiKey={googleApiKey}
            >
                <GoogleMap
                    id='sample-map'
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}
                    onClick={onGoogleMapClickedHandler}
                >
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <div className='map-input-box'>
                            <input type='text' placeholder='Enter Your Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                            <button
                                type='button'
                                className='primary'
                                onClick={onConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </StandaloneSearchBox>
                    <Marker 
                        position={location}
                        onLoad={onMarkerLoad}
                        /*icon={{
                            url: markerIcon,
                            size: new window.google.maps.Size(32, 32)
                          }}*/
                    />
                </GoogleMap>
            </LoadScript>
        </div>
    )
    : <LoadingBox />;
};

export default MapScreen;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/actions/index';

const ProductComponentt = props => {
    const [ name, setName ] = useState(props.product && props.product.name ? props.product.name : '');
    const [ price, setPrice ] = useState(props.product && props.product.price ? props.product.price : '0');
    const [ image ] = useState(props.product && props.product.image ? props.product.image : '');
    const [ imageUploaded, setImageeUploaded ] = useState(null);
    const [ category, setCategory ] = useState(props.product && props.product.category ? props.product.category : '');
    const [ countInStock, setCountInStock ] = useState(props.product && props.product.countInStock ? props.product.countInStock : '0');
    const [ brand, setBrand ] = useState(props.product && props.product.brand ? props.product.brand : '');
    const [ description, setDescription ] = useState(props.product && props.product.description ? props.product.description : '');

    const editProductt = useSelector(state => state.products);
    const { sellerProducts, createdLoading, createdError, createdMsg, createdStatus } = editProductt;

    const dispatch = useDispatch();
    const onCreateProductReset = () => dispatch(actions.createProductReset());
    const onCreateChangeStatus = () => dispatch(actions.createdChangeStatus());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    useEffect(() => {
        if(createdError) {
            onShowErrorSnackbar(createdMsg);
            onCreateProductReset();
        } else if(!createdError && createdMsg) {
            onShowSuccessSnackbar(createdMsg);
            onCreateProductReset();
        }     
        if(createdStatus === 'done') {         
            if(sellerProducts.length > 0) {
                props.history.push('/productlist/seller');
            } else {
                props.history.push('/productlist');
            }
            onCreateChangeStatus();
        }
    });

    function uploadFileHandler(input) {
        if (input && input.target.files && input.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                setImageeUploaded(input.target.files[0]);
                document.getElementById("image").src=  e.currentTarget.result;
            };

            reader.readAsDataURL(input.target.files[0]);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if(name.trim().length <= 5) {
            onShowErrorSnackbar('name must be more than 5 characters.');
            document.getElementById("name").focus();
            return;
        }
        if(Number(price) === 0) {
            onShowErrorSnackbar('please enter price.');
            document.getElementById("price").focus();
            return;
        }
        if(!props.productId && !imageUploaded) {
            onShowErrorSnackbar('select product image.');
            return;
        }
        if(category.trim().length <= 5) {
            onShowErrorSnackbar('category must be more than 5 characters.');
            document.getElementById("category").focus();
            return;
        }
        if(brand.trim().length <= 5) {
            onShowErrorSnackbar('brand must be more than 5 characters.');
            document.getElementById("brand").focus();
            return;
        }
        if(description.trim().length <= 10) {
            onShowErrorSnackbar('description must be more than 10 characters.');
            document.getElementById("description").focus();
            return;
        }
        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('price', Number(price));
        bodyFormData.append('category', category);
        bodyFormData.append('brand', brand);
        bodyFormData.append('countInStock', Number(countInStock));
        bodyFormData.append('description', description);        
        if(props.productId) {
            // edit
            if(imageUploaded) {
                bodyFormData.append('files', imageUploaded);
            }
            props.editProductHandler(bodyFormData);
        } else {
            // add
            bodyFormData.append('files', imageUploaded);
            props.createProductHandler(bodyFormData);
        }
    };

    return (
        <div className='parent'>
            <form className='form' onSubmit={submitHandler}>
                <div>
                    <h1>{props.productId ? 'Edit' : 'Add'} Product</h1>
                </div>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input 
                    type='text'
                    id='name'
                    value={name}
                    placeholder='Enter Name'
                    onChange={e => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='price'>Price</label>
                    <input 
                    type='number'
                    id='price'
                    value={price}
                    placeholder='Enter Price'
                    onChange={e => setPrice(e.target.value)}
                    />
                </div>
                {props.productId ? 
                imageUploaded ? 
                <img id='image' src='' alt=''/>
                : <img className='image' src={image} alt={name} />
                : imageUploaded ? 
                <img id='image' src='' alt=''/>
                : null}
                <div>
                    <input 
                    type='file' 
                    id='file' 
                    onChange={e => uploadFileHandler(e)} 
                    accept="image/*"
                    />
                    {/*<input 
                    type='file' 
                    id='file' 
                    onChange={e => uploadFileHandler(e)} 
                    accept="image/*,audio/*,video/*"
                    multiple
                    />*/}
                </div>
                <div>
                    <label htmlFor='category'>Category</label>
                    <input 
                    type='text'
                    id='category'
                    value={category}
                    placeholder='Enter Category'
                    onChange={e => setCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='brand'>Brand</label>
                    <input 
                    type='text'
                    id='brand'
                    value={brand}
                    placeholder='Enter Brand'
                    onChange={e => setBrand(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='countInStock'>Count In Stock</label>
                    <input 
                    type='number'
                    id='countInStock'
                    value={countInStock}
                    placeholder='Enter Count In Stock'
                    onChange={e => setCountInStock(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='description'>Description</label>
                    <textarea
                    rows='3' 
                    type='text'
                    id='description'
                    value={description}
                    placeholder='Enter Description'
                    onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <button 
                    className='primary'
                    type='submit'
                    >{createdLoading ? <i className="fa fa-spinner fa-spin"></i> : props.productId ? 'Edit' : 'Add'}</button>
                </div>
            </form>
        </div>
    );
};

export default ProductComponentt;
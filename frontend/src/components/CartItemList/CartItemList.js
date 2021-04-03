import React from 'react';
import { Link } from 'react-router-dom';

const CartItemList = props => {
    return (
        <ul>
        {
            props.cartItems.map((item, index) => (
                <li key={item.product}>
                    <div className='row'>
                        <div>
                            <img src={item.image} alt={item.name} className='small'/>
                        </div>
                        <div className='min-30'>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>
                        <div>
                            {props.addToCart &&
                                <select value={item.qty}
                                onChange={e => props.addToCart(item.product, Number(e.target.value))}>
                                    {[...Array(item.countInStock).keys()].map(
                                            x => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            )
                                        )}
                                </select>
                            }
                        </div>
                        {props.addToCart ?
                            <div>${item.price}</div>
                            : <div>{item.qty} x ${item.price} = ${item.qty * item.price}</div>
                        }
                        {props.addToCart &&
                            <div>
                                <button
                                className='small delete'
                                type='button'
                                onClick={() => props.removeFromCardHandler(item.product)}>
                                    Delete
                                </button>
                            </div>
                        }
                    </div>
                    {props.cartItems.length - 1 !== index && <hr></hr>}
                </li>
            ))
        }
    </ul>
    );
}

export default CartItemList;
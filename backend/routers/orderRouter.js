const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const data = require('../data');
const { mailgun, payOrderEmailTemplate } = require('../shared/utils');
const { isAuth, isAdmin, isSellerOrAdmin, } = require('../shared/utils');

const orderRouter = express.Router();

orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res, next) => {
    const pageSize = 3;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const count = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);
    res.send({ 
        orders: orders, 
        page: pageNumber, 
        pages: Math.ceil(count / pageSize),
        count: count
    });
}));

orderRouter.post('/', isAuth, expressAsyncHandler(async(req, res, next) => {
    if(req.body.orderItems.length === 0) {
        res.status(400).send({ message: 'Cart Is Empty.'});
    } else {        
        const orderItems = req.body.cartItems;
        let sellersItems = {};
        for(let i = 0; i < orderItems.length; i++) {
            let cartItems = [];
            let oneSeller = {};
            if(sellersItems[orderItems[i].seller._id] && sellersItems[orderItems[i].seller._id].orderItems) {
                cartItems = sellersItems[orderItems[i].seller._id].orderItems;
            }
            cartItems.push(orderItems[i]);
            const toPrice = num => Number(num.toFixed(2));
            oneSeller.itemPrice = toPrice(
                cartItems.reduce((a, c) => a + (c.qty * c.price), 0)
            );
            oneSeller.seller = orderItems[i].seller;
            oneSeller.shippingPrice = oneSeller.itemPrice > 500 ? toPrice(0) : toPrice(10);
            oneSeller.taxPrice = toPrice(0.15 * oneSeller.itemPrice);
            oneSeller.totalPrice = oneSeller.itemPrice + oneSeller.shippingPrice + oneSeller.taxPrice;
            oneSeller.orderItems = cartItems;
            sellersItems[orderItems[i].seller._id] = oneSeller;
        }
        let createdOrder = null;
        for (var key in sellersItems) {        
            var oneOrder = sellersItems[key];
            const order = new Order({
                seller: oneOrder.seller,
                orderItems: oneOrder.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemPrice: oneOrder.itemPrice,
                shippingPrice: oneOrder.shippingPrice,
                taxPrice: oneOrder.taxPrice,
                totalPrice: oneOrder.totalPrice,
                user: req.user._id,
            });
            createdOrder = await order.save();
        }
        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    }
}));

orderRouter.get('/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'seller',
        'seller.name seller.logo'
    );
    if(order) {
        res.send(order);
    } else {
        res.status(404).send({ message: 'order not found' });
    }
}));

orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'email  name');
    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = { 
            id: req.body.id, 
            status: req.body.status, 
            update_time: req.body.update_time, 
            email_address: req.body.email_address, 
        };
        const updateOrder = await order.save();
        mailgun().messages().send({
            from: 'Amazona <amazona@amazona-apps.herokuapp.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New Order ${order._id}`,
            html: payOrderEmailTemplate(order)
        }, (error, body) => {
            if(error) {
                //console.log('error : ', error)
            } else {
                //console.log('body : ', body)
            }
        });
        res.send({ message: 'Order Paid', order: updateOrder });
    } else {
        res.status(404).send({ message: 'order not found' });
    }
}));

orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async(req, res, next) => {
    const pageSize = 3;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const count = await Order.countDocuments({ ...sellerFilter });
    const orders = await Order.find({ ...sellerFilter })
    .populate('user', 'name').sort({ createdAt: -1 })
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);
    const newOrders = orders.filter(order => order.user);
    res.send({
            orders: newOrders, 
            page: pageNumber, 
            pages: Math.ceil(count / pageSize),
            count: count
        });
}));

orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    const ordertId = req.params.id;
    const order = await Order.findById(ordertId);
    if(order) {        
        await order.remove();      
        res.send({ message: 'order Delete' });
    } else {
        res.status(404).send({ message: 'order not found' });
    }
}));

orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isDeliverd = true;
        order.deliverdAt = Date.now();
        const user = await User.findById(order.user);
        const updateOrder = await order.save();
        const ord = {...updateOrder};
        const ord2 = ord._doc;
        ord2.user = {
            _id: user._id,
            name: user.name
        };
        res.send({ message: 'Order Delivered', order: ord2 });
    } else {
        res.status(404).send({ message: 'order not found' });
    }
}));

module.exports = orderRouter;
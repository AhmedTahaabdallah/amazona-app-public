const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

const categoryRouter = express.Router();

categoryRouter.get('/', expressAsyncHandler(async(req, res, next) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));

module.exports = categoryRouter;
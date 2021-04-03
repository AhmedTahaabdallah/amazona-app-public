const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const data = require('../data');
const { isAuth, isAdmin, isSellerOrAdmin, uploadFile, deleteFile, getProductReviewsTimeAgoArray } = require('../shared/utils');

const productRouter = express.Router();

productRouter.get('/', expressAsyncHandler(async(req, res, next) => {
    const pageSize = 3;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const category = req.query.category || '';
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const name = req.query.name ? req.query.name !== '*' ? req.query.name : '' : '';
    const nameFilter = name ? { name: {$regex: name, $options: 'i'} } : {};
    const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const priceFilter = min && max ? {price: {$gte: min, $lte: max}} : {};
    const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;
    const ratingFilter = rating ? {rating: {$gte: rating}} : {};
    const order = req.query.order || '';
    const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest' ? { price: -1 } 
    : order === 'lowrated' ? { rating: 1 } : order === 'toprated' ? { rating: -1 } 
    : order === 'oldest' ? { _id: 1 } : { createdAt: -1 };
    const count = await Product.countDocuments({ 
        ...sellerFilter, ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter
     });
    const products = await Product.find({ 
        ...sellerFilter, ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter
     }).populate(
        'seller',
        'seller.name seller.logo'
    )
    .sort(sortOrder)
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);   
    const prods = [...products];
    const newProducts = [];
    if(prods.length > 0) {
        for(let i = 0; i < prods.length; i++) {
            const prod = {...prods[i]};
            const prod2 = prod._doc;
            delete prod2['cloudinary_id'];
            newProducts.push(prod2);
        }
    }
    res.send({ 
        products: newProducts, 
        page: pageNumber, 
        pages: Math.ceil(count / pageSize),
        count: count
    });
}));

productRouter.get('/home-screen', expressAsyncHandler(async(req, res, next) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};
    const products = await Product.find({...sellerFilter}).populate(
        'seller',
        'seller.name seller.logo'
    )
    .sort({ createdAt: -1 })
    .limit(5);
    const prods = [...products];
    const newProducts = [];
    if(prods.length > 0) {
        for(let i = 0; i < prods.length; i++) {
            const prod = {...prods[i]};
            const prod2 = prod._doc;
            delete prod2['cloudinary_id'];
            newProducts.push(prod2);
        }
    }
    const topSellers = await User.find({ isSeller: true })
    .sort({ 'seller.rating': -1 })
    .limit(3);
    res.send({featuredProducts: newProducts, topSellers: topSellers});
}));

productRouter.get('/seed', expressAsyncHandler(async(req, res, next) => {
    const data1 = data.products;
    await Product.remove({});
    const seller = await User.findOne({ isSeller: true });
    if(seller) {
        const products = data1.map(product => ({
            ...product,
            seller: seller._id
        }));
        const createProducts = await Product.insertMany(products);
        res.send({ createProducts });
    } else {
        res.status(500).send({ message: 'No Seller Found. first run /api/users/seed' });
    }    
}));

productRouter.get('/:id', expressAsyncHandler(async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate(
        'seller',
        'seller.name seller.logo seller.rating seller.numReviews'
    ).populate(
        'reviews.userId',
        'name image'
    );
    if(product){
        const prod = {...product};
        const prod2 = prod._doc;
        delete prod2['cloudinary_id'];
        prod2.reviews = getProductReviewsTimeAgoArray(prod2.reviews);
        //prod2.reviews = prod2.reviews.reverse();
        prod2.reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        res.send(prod2);
    } else {
        res.status(404).send({ message: 'Product Not Found'});
    }
}));

productRouter.post('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async(req, res, next) => {
    const { name, price, category, brand, countInStock, description } = req.body;
    if(!name || name.trim().length <= 5) {
        res.status(422).send({ message: 'name must be more than 5 characters.' });
        return;
    }
    if(!price || Number(price.trim()) === 0) {
        res.status(422).send({ message: 'please enter price.' });
        return;
    }
    if(!req.files) {
        res.status(500).json({ msg: 'image not selected' });
        return;
    }
    if(!category || category.trim().length <= 5) {
        res.status(422).send({ message: 'category must be more than 5 characters.' });
        return;
    }
    if(!brand || brand.trim().length <= 5) {
        res.status(422).send({ message: 'brand must be more than 5 characters.' });
        return;
    }
    if(!description || description.trim().length <= 10) {
        res.status(422).send({ message: 'description must be more than 10 characters.' });
        return;
    }
    const imageUploaded = await uploadFile(req.files[0], 'products');
    if(imageUploaded.mssage) {
        res.status(500).send({ message: imageUploaded.mssage });
        return;
    }
    const product = new Product({
        name: name,
        seller: req.user._id,
        image: imageUploaded.url,
        cloudinary_id: imageUploaded.cloudinary_id,
        price: Number(price),
        category: category,
        brand: brand,
        countInStock: Number(countInStock),
        rating: 0,
        numReviews: 0,
        description: description,
        //reviews: []
    });
    const createProduct = await product.save();
    const prod = {...createProduct};
    const prod2 = prod._doc;
    delete prod2['cloudinary_id'];
    res.send({ message: 'product Created', product: prod2 });
}));

productRouter.put('/:id', isAuth, isSellerOrAdmin, expressAsyncHandler(async(req, res, next) => {
    const { name, price, category, brand, countInStock, description } = req.body;
    if(!name || name.trim().length <= 5) {
        res.status(422).send({ message: 'name must be more than 5 characters.' });
        return;
    }
    if(!price || Number(price.trim()) === 0) {
        res.status(422).send({ message: 'please enter price.' });
        return;
    }
    if(!category || category.trim().length <= 5) {
        res.status(422).send({ message: 'category must be more than 5 characters.' });
        return;
    }
    if(!brand || brand.trim().length <= 5) {
        res.status(422).send({ message: 'brand must be more than 5 characters.' });
        return;
    }
    if(!description || description.trim().length <= 10) {
        res.status(422).send({ message: 'description must be more than 10 characters.' });
        return;
    }
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {
        product.name = name;
        product.price = Number(price);
        //product.image = image;
        product.category = category;
        product.brand = brand;
        product.countInStock = Number(countInStock);
        product.description = description;
        if(req.files && req.files[0]) {
            const imageUploaded = await uploadFile(req.files[0], 'products');
            if(imageUploaded.url) {
                const cloudinary_id = product.cloudinary_id;
                product.image = imageUploaded.url;
                product.cloudinary_id = imageUploaded.cloudinary_id;
                deleteFile(cloudinary_id);
            }
        }        
        const updatedProduct = await product.save();
        const prod = {...updatedProduct};
        const prod2 = prod._doc;
        delete prod2['cloudinary_id'];
        res.send({ message: 'product Updated', product: prod2 });
    } else {
        res.status(404).send({ message: 'product not found' });
    }
}));

productRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {        
        const cloudinary_id = product.cloudinary_id;
        await product.remove();        
        deleteFile(cloudinary_id);   
        res.send({ message: 'product Delete' });
    } else {
        res.status(404).send({ message: 'product not found' });
    }
}));

productRouter.post('/:id/reviews', isAuth, expressAsyncHandler(async(req, res, next) => {
    const { rating, comment } = req.body;
    if(!rating || Number(rating) === 0) {
        res.status(422).send({ message: 'select rating number.' });
        return;
    }
    if(!comment || comment.trim().length <= 2) {
        res.status(422).send({ message: 'please write comment.' });
        return;
    }
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(product) {
        const newReview = {
            userId: req.user._id,
            rating: Number(rating),
            comment: comment
        };
        const oldReviews = product.reviews || [];
        if(oldReviews.length === 0) {
            oldReviews.push(newReview);
        } else {
            const index = oldReviews.findIndex(review => {
                return review.userId.toString() === newReview.userId.toString();
            });

            if(index >= 0) {
                oldReviews[index] = newReview;
            } else {
                oldReviews.push(newReview);
            }
        }
        product.reviews = oldReviews;
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / 
        product.reviews.length;
        const updatedProduct = await product.save();
        const product2 = await Product.findById(productId).populate(
            'reviews.userId',
            'name image'
        );
        const prod = {...product2};
        const prod2 = prod._doc;
        delete prod2['cloudinary_id'];
        prod2.reviews = getProductReviewsTimeAgoArray(prod2.reviews);
        //prod2.reviews = prod2.reviews.reverse();
        prod2.reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        res.status(201).send({ 
            message: 'Review Created.', 
            reviews: prod2.reviews,
            numReviews: prod2.numReviews,
            rating: prod2.rating,
        });
    } else {
        res.status(404).send({ message: 'Review Not Created.' });
    }
}));

module.exports = productRouter;
const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const data = require('../data');
const { createUserToken, isAdmin } = require('../shared/utils');
const { isAuth, uploadFile, deleteFile } = require('../shared/utils');

const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async(req, res, next) => {
    const data1 = data.users;
    await User.remove({});
    const createUsers = await User.insertMany(data1);
    res.send({ createUsers });
}));

userRouter.post('/signin', expressAsyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(user) {
        if(bcrypt.compareSync(req.body.password, user.password)){
            const token = await createUserToken(user._id, user.email);
            user.token = token.slice(7, token.length);
            const updatedUser = await user.save();
            res.send({ 
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                isSeller: updatedUser.isSeller,
                sellerLogo: updatedUser.seller.logo,
                image: updatedUser.image,
                token: token,
             });
             return;
        }
    }  
    res.status(401).send({ message: 'Invalid email or password'});
}));

userRouter.post('/register', expressAsyncHandler(async(req, res, next) => {
    const user = await User({ 
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616510857/amazona/avater_lv9mv4.png',        
        cloudinary_id: 'null',  
        token: 'null'      
    });
    const createUser = await user.save();
    const token = await createUserToken(createUser._id, createUser.email);
    const user2 = await User.findOne({ email: req.body.email });
    user2.token = token.slice(7, token.length);
    const updatedUser = await user2.save();
    res.send({ 
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: updatedUser.isSeller,
        sellerLogo: updatedUser.seller.logo,
        image: updatedUser.image,
        token: token,
     });
}));

userRouter.get('/:id', expressAsyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);                
    if(user) {
        res.send(user);                   
    } else {
        res.status(401).send({ message: 'user not found' });
    }
}));

userRouter.put('/profile', isAuth, expressAsyncHandler(async(req, res, next) => {
    const user = req.user;
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password.trim().length >= 5) {
            user.password = bcrypt.hashSync(req.body.password, 8);
        }
        if(req.files && req.files[0] && 
        (req.body.fileType === 'image' || req.body.fileType === 'both')) {
            const imageUploaded = await uploadFile(req.files[0], 'users', true);
            if(imageUploaded.url) {
                const cloudinary_id = user.cloudinary_id;
                user.image = imageUploaded.url;
                user.cloudinary_id = imageUploaded.cloudinary_id;
                deleteFile(cloudinary_id);
            }
        } 
        if(user.isSeller) {
            user.seller.name = req.body.sellerName || user.seller.name;
            user.seller.description = req.body.sellerDescription || user.seller.description;
            let logoFile = null;
            if(req.files && req.files[1] && req.body.fileType === 'both') {
                logoFile = req.files[1];
            } else if(req.files && req.files[0] && req.body.fileType === 'logo') {
                    logoFile = req.files[0];
                }
            if(logoFile) {
                const logoUploaded = await uploadFile(logoFile, 'users/sellers');
                if(logoUploaded.url) {
                    const cloudinary_id = user.seller.cloudinary_id;
                    user.seller.logo = logoUploaded.url;
                    user.seller.cloudinary_id = logoUploaded.cloudinary_id;
                    deleteFile(cloudinary_id);
                }
            } 
        }
        const updatedUser = await user.save();
        res.send({ 
            user: { 
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                isSeller: updatedUser.isSeller,
                sellerLogo: updatedUser.seller.logo,
                image: updatedUser.image,
                seller: {
                    name: updatedUser.seller.name,
                    logo: updatedUser.seller.logo,
                    description: updatedUser.seller.description,
                }
            }, 
            message: 'user profile updated.'
        });
    } else {
        res.status(404).send({ message: 'user not found' });
    }
}));

userRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    const pageSize = 3;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const count = await User.countDocuments({});
    const users = await User.find({})
    .sort({ createdAt: -1 })
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);
    res.send({ 
        users: users, 
        page: pageNumber, 
        pages: Math.ceil(count / pageSize),
        count: count
    });
}));

userRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    if(req.body.isAdmin  === true && req.body.isSeller  === true) {
        res.status(400).send({ message: 'you can use only is Admin or is Seller.' });
        return;
    }
    const user = await User.findById(req.params.id);
    if(user) {
        user.isAdmin = req.body.isAdmin  !== undefined ? req.body.isAdmin :  user.isAdmin;       
        user.isSeller = req.body.isSeller !== undefined ? req.body.isSeller : user.isSeller;    
        const updatedUser = await user.save();
        res.send({ message: 'User Updated.', user: updatedUser });
    } else {
        res.status(401).send({ message: 'User not found.' });
    }
}));

userRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.email === 'admin@admin.com') {
            res.status(400).send({ message: 'Can Not Delete Admin User ' });
        } else {
            await user.remove();
            res.send({ message: 'User Deleted.' });
        }        
    } else {
        res.status(401).send({ message: 'User not found.' });
    }
}));

module.exports = userRouter;
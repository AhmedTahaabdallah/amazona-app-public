const jwt = require('jsonwebtoken');
const scretData = require('../secrts');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
const mg = require('mailgun-js');

cloudinary.config({
    cloud_name: scretData.CLOUD_NAME,
    api_key: scretData.API_KEY,
    api_secret: scretData.API_SECRET,
});

exports.createUserToken = async function(id, email) {
    const token = jwt.sign({
            _id: id,
            email: email
        },
        scretData.JWS_SECRET,
        { expiresIn: '8760h'}
    );
    return `Bearer ${token}`;
};

exports.isAuth = (req, res, next) => {    
    const authorization = req.headers.authorization;    
    if (authorization) {
        const token = authorization.slice(7, authorization.length); // Bearer xxxx
        jwt.verify(token, scretData.JWS_SECRET, async(err, decode) => {
            if(err) {
                res.status(401).send({ message: 'Invalid Token, So Signin again.'});
            } else {
                const user = await User.findById(decode._id);                
                if(user) {
                    if(user.token === token) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).send({ message: 'Your Token is expired, So Signin again.' });
                    }                    
                } else {
                    res.status(401).send({ message: 'user not found' });
                }
            }
        });
    } else {
        res.status(401).send({ message: 'Not Authorization, So Signin again.'});
    }
};

exports.isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token, So Signin again.'});
    }
}; 

exports.isSeller = (req, res, next) => {
    if(req.user && req.user.isSeller) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Seller Token, So Signin again.'});
    }
}; 

exports.isSellerOrAdmin = (req, res, next) => {
    if(req.user && (req.user.isSeller || req.user.isAdmin)) {
        next();
    } else {
        res.status(401).send({ message: 'Invalid Seller/Admin Token, So Signin again.'});
    }
};

exports.uploadFile = async(file, path = '', isAvater = false) => {
    try {
        const fileSizeMb = file.size / 1024 / 1024;
        if(fileSizeMb < 100 ) {
            let index = 0;
            if(file.mimetype.includes('application')) {
                index = 1;
            }
            let fileType = file.mimetype.split('/')[index];
            if(file.mimetype.includes('.rar')) {
                fileType = 'zip';
            }
            const optionss = {
                upload_preset: 'amazona',
                folder: `amazona/${fileType}s/${path}/`,
                resource_type: fileType === 'image' ? 'image' 
                : fileType === 'video' || fileType === 'audio' ? 'video' : 'auto' //"auto"
            };
            if(fileType === 'image') {
                optionss.width = 679;
                optionss.height = 829;
                optionss.quality = 80;
            }
            if(fileType === 'image' && isAvater) {
                optionss.width = 200;
                optionss.height = 200;
                optionss.radius = "max";
                optionss.crop = "fill";
                optionss.quality = 80;
            }
            
            const uploadResponse = await cloudinary.uploader.upload(file.path, 
                optionss
            );
            if(uploadResponse) {
                return {
                    fileName: file.originalname,
                    cloudinary_id: uploadResponse.public_id, 
                    url: uploadResponse.secure_url
                };
            } else {
                return {
                    fileName: file.originalname,
                    mssage: 'this file size is biger than 100mb'
                };
            }
        } else {
            return {
                fileName: file.originalname,
                mssage: 'this file size is biger than 100mb'
            };
        }  
    } catch(err) {
    return {
        fileName: file.originalname,
        mssage: err.message
    };
    }    
};

exports.uploadFiles = async(allFiles, path = '', isAvater = false) => {
    try {
        const newFils = [];
        for(let i = 0; i < allFiles.length; i++) {
            const fileSizeMb = allFiles[i].size / 1024 / 1024;
            if(fileSizeMb < 100 ) {
                let index = 0;
                if(allFiles[i].mimetype.includes('application')) {
                    index = 1;
                }
                let fileType = allFiles[i].mimetype.split('/')[index];
                if(allFiles[i].mimetype.includes('.rar')) {
                    fileType = 'zip';
                }
                const optionss = {
                    upload_preset: 'amazona',
                    folder: `amazona/${fileType}s/${path}/`,
                    resource_type: fileType === 'image' ? 'image' 
                    : fileType === 'video' || fileType === 'audio' ? 'video' : 'auto' //"auto"
                };
                if(fileType === 'image') {
                    optionss.width = 679;
                    optionss.height = 829;
                    optionss.quality = 80;
                }
                if(fileType === 'image' && isAvater) {
                    optionss.width = 200;
                    optionss.height = 200;
                    optionss.radius = "max";
                    optionss.crop = "fill";
                    optionss.quality = 80;
                }
                
                const uploadResponse = await cloudinary.uploader.upload(allFiles[i].path, 
                    optionss
                );
                if(uploadResponse) {
                    newFils.push({
                        fileName: allFiles[i].originalname,
                        cloudinary_id: uploadResponse.public_id, 
                        url: uploadResponse.secure_url
                    });
                } else {
                    newFils.push({
                        fileName: allFiles[i].originalname,
                        mssage: 'this file size is biger than 100mb'
                    });
                }
            } else {
                newFils.push({
                    fileName: allFiles[i].originalname,
                    mssage: 'this file size is biger than 100mb'
                });
            }  
        }
        return { 'allFiles': newFils};
    } catch(err) {
    return [{
        fileName: file.originalname,
        mssage: err.message
    }];
    }    
};

exports.deleteFile = async(cloudinary_id) => {
    if(cloudinary_id) {
        let resourceType = 'raw';
        if( cloudinary_id.includes('images/') ) {
            resourceType = 'image';
        } else if( cloudinary_id.includes('videos/') 
        || cloudinary_id.includes('audios/'))  {
            resourceType = 'video';
        }
        const uploadResponse = await cloudinary.uploader.destroy(cloudinary_id, { 
            invalidate: true, 
            resource_type: resourceType 
        });
        if( uploadResponse ) {
            return { msg: uploadResponse.result === 'ok' ? 'file deleted' : 'file not deleted' };
        } else {
            return { msg: 'error' };
        } 
    } else {
        return { msg: 'cloudinary_id not entered' };
    }
};

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
const timeAgo = new TimeAgo('en-US');

const getTimeAgo = dateTime => {    
    const time = timeAgo.format(dateTime);
    return time;
};

exports.getTimeAgo = getTimeAgo;

exports.getProductReviewsTimeAgoArray = dateTimeArray => {
    const newDateTimeArray = [];
    if(dateTimeArray && dateTimeArray.length > 0) {
        dateTimeArray.forEach(review => {
            let newReview = review;
            if(newReview.updatedAt) {
                //newReview['dateTime'] = getTimeAgo(newReview.createdAt);
                //Object.assign({ dateTime: getTimeAgo(newReview.createdAt) }, newReview);
                newReview = {
                    _id: review._id,
                    userId: review.userId,
                    rating: review.rating,
                    comment: review.comment,
                    dateTime: getTimeAgo(newReview.updatedAt),
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    
                };
            }      
            newDateTimeArray.push(newReview);
        });        
    }    
    return newDateTimeArray;
};

exports.mailgun = () => mg({
    apiKey: scretData.MAILGUN_API_KEY, 
    domain: scretData.MAILGUN_DOMIAN
});

exports.payOrderEmailTemplate = (order) => {
    return `<h1>Thanks for shopping with us</h1>
    <p>
    Hi ${order.user.name},</p>
    <p>We have finished processing your order.</p>
    <h2>[Order ${order._id}] Paid At (${order.createdAt.toString().substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>Product</strong></td>
    <td><strong>Quantity</strong></td>
    <td><strong align="right">Price</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
      <tr>
      <td>${item.name}</td>
      <td align="center">${item.qty}</td>
      <td align="right"> $${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join('\n')}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Items Price:</td>
    <td align="right"> $${order.itemPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Tax Price:</td>
    <td align="right"> $${order.taxPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Shipping Price:</td>
    <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>Total Price:</strong></td>
    <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">Payment Method:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    </table>
    <h2>Shipping address</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.country},<br/>
    ${order.shippingAddress.potalCode}<br/>
    </p>
    <hr/>
    <p>
    Thanks for shopping with us.
    </p>
    `;
  };
  
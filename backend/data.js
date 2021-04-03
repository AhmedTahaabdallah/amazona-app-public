const bcrypt = require('bcrypt');

const data  = {
    users: [
        {
            name: 'Ahmed',
            email: 'admin@admin.com',
            password: bcrypt.hashSync('123456', 8),
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616510857/amazona/avater_lv9mv4.png',
            cloudinary_id: 'null',
            token: 'null',
            isAdmin: true,
            isSeller: true,
            seller: {
                name: 'ahmed',
                logo: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616510857/amazona/avater_lv9mv4.png',
                cloudinary_id: 'null',
                description: 'best seller',
                rating: 4.5,
                numReviews: 12,
            }
        },
        {
            name: 'Yousef',
            email: 'test1@test.com',
            password: bcrypt.hashSync('123456', 8),
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616510857/amazona/avater_lv9mv4.png',
            cloudinary_id: 'null',
            token: 'null',
            isAdmin: false,
        }
    ],
    products: [
        {
            name: 'Nike Slim Shirt',
            category: 'Shirts',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496652/amazona/images/products/fs1te00ks58vcxkvliwz.jpg',
            cloudinary_id: 'amazona/images/products/fs1te00ks58vcxkvliwz',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 2.5,
            numReviews: 10,
            description: 'hieh quilty product'
        },
        {
            name: 'Adidas Fit Shirt',
            category: 'Shirts',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496677/amazona/images/products/onk1kgmzupqxqkqhklec.jpg',
            cloudinary_id: 'amazona/images/products/onk1kgmzupqxqkqhklec',
            price: 100,
            countInStock: 20,
            brand: 'Adidas',
            rating: 3.0,
            numReviews: 10,
            description: 'hieh quilty product'
        },
        {
            name: 'Lacoste Free Shirt',
            category: 'Shirts',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496693/amazona/images/products/mlq6wl445rww1znhwm3e.jpg',
            cloudinary_id: 'amazona/images/products/mlq6wl445rww1znhwm3e',
            price: 220,
            countInStock: 0,
            brand: 'Lacoste',
            rating: 4.8,
            numReviews: 17,
            description: 'hieh quilty product'
        },
        {
            name: 'Nike Slim Pant',
            category: 'Pants',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496718/amazona/images/products/drvca2eajeek1a54esil.jpg',
            cloudinary_id: 'amazona/images/products/drvca2eajeek1a54esil',
            price: 78,
            countInStock: 15,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 14,
            description: 'hieh quilty product'
        },
        {
            name: 'Puma Slim Pant',
            category: 'Pants',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496740/amazona/images/products/hhycjcpazm9zpx6ry0wf.jpg',
            cloudinary_id: 'amazona/images/products/hhycjcpazm9zpx6ry0wf',
            price: 65,
            countInStock: 5,
            brand: 'Puma',
            rating: 4.5,
            numReviews: 10,
            description: 'hieh quilty product'
        },
        {
            name: 'Adidas Slim Pant',
            category: 'Pants',
            image: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616496754/amazona/images/products/yeifrw3lmvyzyc1zlgbv.jpg',
            cloudinary_id: 'amazona/images/products/yeifrw3lmvyzyc1zlgbv',
            price: 139,
            countInStock: 12,
            brand: 'Adidas',
            rating: 4.5,
            numReviews: 15,
            description: 'hieh quilty product'
        }
    ]
};

module.exports = data;
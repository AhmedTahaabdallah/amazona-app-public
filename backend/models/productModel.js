const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        comment: { type: String },
        rating: { type: Number },
    },
    {
        timestamps: true
    }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true},
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        image: { type: String, required: true },
        cloudinary_id: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        numReviews: { type: Number, required: true },
        reviews: [reviewsSchema]
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
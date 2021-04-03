const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: { type: String, required: true },
        cloudinary_id: { type: String, required: true },
        token: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        isSeller: { type: Boolean, default: false, required: true },
        seller: {
            name: String,
            logo: { type: String, default: 'https://res.cloudinary.com/ahmedtaha/image/upload/v1616510857/amazona/avater_lv9mv4.png', required: true },
            cloudinary_id: { type: String, default: 'null', required: true },
            description: String,
            rating: { type: Number, default: 0, required: true },
            numReviews: { type: Number, default: 0, required: true },
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
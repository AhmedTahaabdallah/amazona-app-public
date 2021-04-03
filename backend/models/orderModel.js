const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true},
                qty: { type: Number, required: true},
                image: { type: String, required: true},
                price: { type: Number, required: true},
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
            }
        ],
        shippingAddress: {
            fullName: { type: String, required: true},
            country: { type: String, required: true},
            city: { type: String, required: true},
            address: { type: String, required: true},
            potalCode: { type: String, required: true},
            addressMap: String,
            lat: Number,
            lng: Number,
        },
        paymentMethod: { type: String, required: true},
        paymentResult: { 
            id: String, 
            status: String, 
            update_time: String, 
            email_address: String, 
        },
        itemPrice: { type: Number, required: true},
        shippingPrice: { type: Number, required: true},
        taxPrice: { type: Number, required: true},
        totalPrice: { type: Number, required: true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        isPaid: { type: Boolean, default: false},
        paidAt: { type: Date},
        isDeliverd: { type: Boolean, default: false},
        deliverdAt: { type: Date},
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
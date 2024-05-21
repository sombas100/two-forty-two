const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

const Order = mongoose.model('order', OrderSchema);

module.exports = Order
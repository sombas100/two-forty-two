const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product
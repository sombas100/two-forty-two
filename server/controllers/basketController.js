const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const addToBasket = async (req, res) => {
    const { productId, quantity } = req.body;
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        user.basket.push({ productId, quantity });
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('basket.productId')
        res.status(200).json({ items: updatedUser.basket });
    } catch (error) {
        console.error('Error adding item to basket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getBasketItems = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('basket.productId', 'name price image');
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        res.status(200).json({ basket: user.basket });
    } catch (error) {
        console.error('Error fetching basket items:', error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const deleteBasketItem = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    console.log("Received productId:", productId);


    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stringProductId = productId.toString();

        user.basket = user.basket.filter(item => item.productId.toString() !== stringProductId);
        await user.save();

        res.status(200).json({ message: 'Item has been successfully removed from the basket' });
    } catch (error) {
        console.error('Error removing item from basket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addToBasket,
    getBasketItems,
    deleteBasketItem
}
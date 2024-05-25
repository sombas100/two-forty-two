const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

const getBasketCount = async (req, res) => {
    const userId = req.user.id;
}

module.exports = {
    addToBasket,
}
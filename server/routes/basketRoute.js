const express = require('express');
const router = express.Router();
const { addToBasket, getBasketItems, deleteBasketItem } = require('../controllers/basketController');
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/', verifyToken, addToBasket);

router.get('/', verifyToken, getBasketItems);

router.delete('/:productId', verifyToken, deleteBasketItem);

module.exports = router;
const express = require('express');
const router = express.Router();
const { addToBasket } = require('../controllers/basketController');
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/', verifyToken, addToBasket);

module.exports = router;
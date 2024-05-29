const express = require('express')
const router = express.Router()
const { createPaymentIntent, createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, handlePaymentConfirmation} = require('../controllers/orderController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/', verifyToken, createPaymentIntent, createOrder);
router.post('/payment/confirm-payment', verifyToken, handlePaymentConfirmation);
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.put('/:id',verifyToken, updateOrderById);
router.delete('/:id', verifyToken, deleteOrderById);



module.exports = router;
const Order = require('../models/Order');
const stripe = require('../utils/stripe');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
    const { products, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId; 

    try {
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            totalAmount += product.price * item.quantity;
        }

        const newOrder = new Order({
            userId, 
            products,
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        const savedOrder = await newOrder.save();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'gbp',
            payment_method_types: ['card'],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: savedOrder._id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const handlePaymentConfirmation = async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            const order = await Order.findById(orderId);
            if (order) {
                order.status = 'completed';
                await order.save();
                res.status(200).json({ message: 'Payment successful and order completed', order});   

            } else {
            res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Payment unsuccessful'});
        }
    } catch (error) {
        console.error('Error handling payment confirmation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('userId', ['name', 'email'])
        .populate('products.productId', ['name', 'price']);
    res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', ['name', 'email'])
            .populate('products.productId', ['name', 'price']);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'objectId') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).send('Internal Server Error');
    }
}

const updateOrderById = async (req, res) => {
    const { userId, products, totalAmount, shippingAddress, paymentMethod} = req.body;
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'order not found' })
        }

        order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { userId, products, totalAmount, shippingAddress, paymentMethod }},
            { new: true }
        );

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'objectId') {
            return res.status(404).json({ message: 'order not found' });
        }
        return res.status(500).send('Internal Server Error');
    }
}

const deleteOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.remove();

        res.json({ message: 'Order has been successfully removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'objectId') {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    createOrder,
    handlePaymentConfirmation,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById
}
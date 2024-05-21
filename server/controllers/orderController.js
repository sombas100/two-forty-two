const Order = require('../models/Order')

const createOrder = async (req, res) => {
    const { user, products, totalAmount, shippingAddress, paymentMethod} = req.body

    try {
        const newOrder = new Order({
            user,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod,
        })

        const order = await newOrder.save()
        res.json(order)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Internal Server Error')
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', ['name', 'email', ]).populate('products.product', ['name', 'price']);
        res.json(orders)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error');
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', ['name', 'email', ]).populate('products.product', ['name', 'price']);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.json(order)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found' })
        }
        res.status(500)
    }
}

const updateOrderById = async (req, res) => {
    const { user, products, totalAmount, shippingAddress, paymentMethod} = req.body
    try {
        
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' })
        }

        order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: { user, products, totalAmount, shippingAddress, paymntMethod}},
            { new: true }
        );

        res.json(order);
    } catch (err) {
        console.error(err.message)
        if ( err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).send('Internal Server Error')
    }
};

const deleteOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({ message: 'Order not found'})
        }

        await order.remove()

        res.json({ message: 'Order has been successfully removed' })
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found'})
        }
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById,
}
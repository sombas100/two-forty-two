const Order = require('../models/Order');
const stripe = require('../utils/stripe')


const createPaymentIntent = async (req, res) => {
    try {
      const { totalAmount } = req.body;
  
      if (isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
      }
     const amountInCents = Math.round(totalAmount * 100);
    
     const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
      });
  
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const createOrder = async (req, res) => {
    try {
      const { products, paymentIntentId } = req.body;
      const userId = req.user._id;
  
      const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  
      const order = new Order({ userId, products, totalAmount, paymentIntentId });
      await order.save();
  
      res.json({
        orderId: order._id,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
    createPaymentIntent,
    createOrder,
    handlePaymentConfirmation,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById
}
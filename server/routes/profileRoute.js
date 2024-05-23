const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../models/User')

router.get('/', authMiddleware.verifyToken, async (req, res) => {
    try {
       const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
       res.json({
        user: {
            email: user.email,
            image: user.image,
        }
       })
    } catch (error) {
        console.error('Error fetching user profile', error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
});

module.exports = router
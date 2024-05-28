const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, email: user.email, basket: user.basket },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const verifyToken = async (req, res, next) => {
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'Authorization denied, user not found'})
        }
        req.userId = decoded.id;
        next()
    } catch (error) {
        console.error('Auth middleware error:' , error)
        res.status(401).json({ message: 'Token is not valid' })
    }
};

module.exports = {
    generateToken,
    verifyToken
}
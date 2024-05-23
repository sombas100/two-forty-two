const express = require('express');
const { generateToken, verifyToken} = require('../middleware/authMiddleware')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const admin = require('../firebaseAdmin');

const register = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ error: 'User already exists'})
        }

    const hashedPassword = bcrypt.hashSync(password, 10)

    user = new User({
        email,
        password: hashedPassword
    })

    await user.save()
    const token = generateToken(user)

    res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials'})
        }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({message: 'Invalid Credentials' })
    }

    const token = generateToken(user)

    res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal server Error')
    }
}

const GoogleAuth = async (req, res) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                password: 'GOOGLE_AUTH'

            })
            await user.save()
        }
        const token = generateToken(user);

        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = {
    register,
    login,
    GoogleAuth
}
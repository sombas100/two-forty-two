const express = require('express')
const { generateToken, verifyToken} = require('../middleware/authMiddleware')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

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

module.exports = {
    register,
    login
}
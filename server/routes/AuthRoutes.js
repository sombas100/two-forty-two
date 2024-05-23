const express = require('express')
const router = express.Router()
const { login, register, GoogleAuth } = require('../controllers/authController')


router.post('/login',  login)

router.post('/register', register)

router.post('/google', GoogleAuth);

module.exports = router
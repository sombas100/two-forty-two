require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const session = require('express-session')
const jwt = require('jsonwebtoken')


const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, expires: 60000 }
}))

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
.then(() => {
    console.log('MongoDB connected')
})
.catch((err) => {console.log(err)})

const orderRoutes = require('./routes/OrderRoutes');
const productRoutes = require('./routes/ProductRoutes')
const authRoutes = require('./routes/AuthRoutes');



app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {console.log(`Server is listening on port: ${PORT}`)})

app.get('/test',(req, res) => {
    console.log('API is running!')
    res.send('WORKING')
})                  
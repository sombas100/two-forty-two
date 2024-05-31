const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: ['http://localhost:5173', 'https://two-forty-two.netlify.app'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, expires: 60000 }
}));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const orderRoutes = require('./routes/OrderRoutes');
const productRoutes = require('./routes/ProductRoutes');
const profileRoute = require('./routes/profileRoute');
const basketRoute = require('./routes/basketRoute');
const authRoutes = require('./routes/AuthRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/profile', profileRoute);
app.use('/api/basket', basketRoute);
app.use('/api/auth', authRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

app.get('/test', (req, res) => {
  console.log('API is running!');
  res.send('WORKING');
});


app.use((err, req, res, next) => {
  console.error('An error occurred:', err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

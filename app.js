require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const todoRoutes = require('./routes/todoRoutes')
const authRoutes = require('./routes/authRoutes')

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Connect to MongoDB when the application starts up
mongoose.connect(process.env.MONGO_URL)
.catch(err => console.error('Error connecting to MongoDB:', err));

//Routes of the app
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);

module.exports=app
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const userSchema = require('./model/models');
const getUser=require('./middleware/getuser')
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Connect to MongoDB when the application starts up
mongoose.connect(process.env.MONGO_URL)
.catch(err => console.error('Error connecting to MongoDB:', err));

const User = mongoose.model('User', userSchema);

// Create User
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read single User
app.get('/api/users/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Update User
app.patch('/api/users/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User
app.delete('/api/users/:id', getUser, async (req, res) => {
  try {
    await User.deleteOne(res.user);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports=app
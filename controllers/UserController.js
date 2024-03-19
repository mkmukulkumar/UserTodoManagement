// controllers/UserController.js

const User = require('../model/User');
const bcrypt = require('bcryptjs');

//Add user to the database, hash password, check if already exist
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//get all the users from the database and sends
exports.getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};

// get the user whose id match with the id given (runs after getuser middleware)
exports.getSingleUser = async (req, res) => {
  res.json(res.user);
};

// get the user whose id match with the id given and upadates it(runs after getuser middleware)
exports.updateUser = async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (req.body.username != null) {
        res.user.username = username;
      }
    if (req.body.email != null) {
      res.user.email = email;
    }
    if (req.body.password != null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      res.user.password = hashedPassword;
    }
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};


// get the user whose id match with the id given and deletes it(runs after getuser middleware)
exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne(res.user);
        res.json({ message: 'User deleted' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

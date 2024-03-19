// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const getuser=require('../middleware/getuser')

router.post('/', UserController.createUser);
router.get('/', UserController.getUser);
router.get('/:id',getuser, UserController.getSingleUser);
router.patch('/:id',getuser, UserController.updateUser);
router.delete('/:id',getuser, UserController.deleteUser);

module.exports = router;

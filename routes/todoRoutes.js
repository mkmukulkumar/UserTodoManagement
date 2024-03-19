// routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController.js');
const gettodo = require('../middleware/gettodo.js');

router.post('/', TodoController.createTodo);
router.get('/', TodoController.getTodo);
router.get('/:id',gettodo, TodoController.getSingleTodo);
router.patch('/:id', gettodo, TodoController.updateTodo);
router.delete('/:id', gettodo, TodoController.deleteTodo);

module.exports = router;

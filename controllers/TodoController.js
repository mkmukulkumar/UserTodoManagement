// controllers/TodoController.js

const Todo = require('../model/Todo');

exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTodo = async (req, res) => {
  try {
    let { page, limit, title } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    const skip = (page - 1) * limit;
    const todos = await Todo.find(filter)
    .limit(limit)
    .skip(skip)
    .exec();

    const totalTodos = await Todo.countDocuments(filter);
    
    res.json({
      totalPages: Math.ceil(totalTodos / limit),
      currentPage: page,
      todos
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSingleTodo = async (req, res) => {
  res.json(res.todo);
};

exports.updateTodo = async (req, res) => {
    if (req.body.title != null) {
        res.todo.title = req.body.title;
      }
    if (req.body.description != null) {
      res.todo.description = req.body.description;
    }

  try {
    const updatedtodo = await res.todo.save();
    res.json(updatedtodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await Todo.deleteOne(res.todo);
        res.json({ message: 'Todo deleted' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

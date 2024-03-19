const Todo = require('../model/Todo');
async function gettodo(req, res, next) {
    let todo;
    try {
      todo = await Todo.findById(req.params.id);
      if (todo == null) {
        return res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.todo = todo;
    next();
}
module.exports=gettodo;
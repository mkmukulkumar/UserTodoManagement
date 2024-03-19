const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Todo = require('../model/Todo')

jest.setTimeout(20000);
// Connect to MongoDB before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  // Close the MongoDB database connection after running all tests
  await mongoose.connection.close();
});

describe('Todo List API', () => {
    let todoId;
  
    // Test case for creating a user
    it('should create a new todo', async () => {
      const newTodo = {
        title: 'Hello World',
        description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
      };
  
      const res = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(200);
  
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(newTodo.title);
      expect(res.body.description).toBe(newTodo.description);
      expect(res.body).toHaveProperty('createdAt');
      todoId = res.body._id;
    });
  
    // Test case for getting all todos
    it('should get all todos', async () => {
      const todos = [
        { title: 'Todo56298 1', description: 'Description for Todo 1' },
        { title: 'Todo56298 2', description: 'Description for Todo 2' },
        { title: 'Another Todo56298', description: 'Description for Another Todo' },
      ];
      await Todo.insertMany(todos);
  
      const res = await request(app)
        .get('/api/todos')
        .query({ page: 1, limit: 2, title: 'Todo56298' })
        .expect(200);
  
      expect(Array.isArray(res.body.todos)).toBe(true);
      expect(res.body.totalPages).toBe(2); // Assuming there are 3 todos with 'Todo' in the title
      expect(res.body.currentPage).toBe(1);
  
      await Todo.deleteMany({ title: { $in: ['Todo56298 1', 'Todo56298 2', 'Another Todo56298'] } });
    });
  
    // Test case for getting a single todo
    it('should get a single todo', async () => {
      const res = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);
  
      expect(res.body._id).toBe(todoId);
    });
  
    // Test case for updating a todo
    it('should update a todo', async () => {
      const updatedTodo = {
        title: 'Todo Item',
        description: 'The things we need to do'
      };
  
  
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send(updatedTodo)
        .expect(200);
  
      expect(res.body.title).toBe(updatedTodo.title);
      expect(res.body.description).toBe(updatedTodo.description);
    });
  
    // Test case for deleting a todo
    it('should delete a todo', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(200);
  
      // Verify the todo is deleted
      const res = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404);
  
      expect(res.body.message).toBe('Todo not found');
    });
  });


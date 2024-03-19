const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
jest.setTimeout(20000);
// Connect to MongoDB before running tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  // Close the MongoDB database connection after running all tests
  await mongoose.connection.close();
});

describe('User Management API', () => {
  let userId;

  // Test case for creating a user
  it('should create a new user', async () => {
    const newUser = {
      username: "johntest",
      email: "john@example.com",
      password:"temppass1"
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.email).toBe(newUser.email);
    const isPasswordMatch = await bcrypt.compare(newUser.password, res.body.password);
    expect(isPasswordMatch).toBe(true);
    userId = res.body._id;
  });

  // Test case for getting all users
  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test case for getting a single user
  it('should get a single user', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(res.body._id).toBe(userId);
  });

  // Test case for updating a user
  it('should update a user', async () => {
    const updatedUser = {
      username: 'Updated Name',
      email: 'updated@example.com',
      password:'updatedtemppass1'
    };

    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(res.body.username).toBe(updatedUser.username);
    expect(res.body.email).toBe(updatedUser.email);
    const isPasswordMatch = await bcrypt.compare(updatedUser.password, res.body.password);
    expect(isPasswordMatch).toBe(true);
  });

  // Test case for deleting a user
  it('should delete a user', async () => {
    await request(app)
      .delete(`/api/users/${userId}`)
      .expect(200);

    // Verify the user is deleted
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .expect(404);

    expect(res.body.message).toBe('User not found');
  });
});


describe('Auth API', () => {
  let authuseremail;
  afterEach(async () => {
    if (authuseremail) {
      const user = await User.findOne({ email: authuseremail });
      if (user) {
        await User.findByIdAndDelete(user._id);
      }
    }
  });

  it('should register a new user', async () => {
    const newauthUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(newauthUser)
      .expect(200);

      expect(res.body.message).toBe('User created successfully');
      authuseremail = newauthUser.email;
  });

  it('should log in an existing user', async () => {
    // First, register a user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
    };
    const newUser=new User(userData)
    await newUser.save(userData);

    // Then, try to log in with the registered user credentials
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
    .post('/api/auth/login')
    .send(loginData)
    .expect(200);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    authuseremail = userData.email;
  });

  it('should not log in with invalid credentials', async () => {
    // Try to log in with incorrect credentials
    const loginData = {
      email: 'invalid@example.com',
      password: 'invalidpassword',
    };

    const res = await request(app)
    .post('/api/auth/login')
    .send(loginData)
    .expect(404);
    expect(res.body.message).toBe('User not found');
  });

})



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
    const res = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
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
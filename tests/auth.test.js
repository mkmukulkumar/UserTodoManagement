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
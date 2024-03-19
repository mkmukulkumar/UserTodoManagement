const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
const request = require('supertest');
const app = require('../app');

jest.setTimeout(20000);

describe('User Management API', () => {
  let server;
  
  beforeAll(done => {
    server = app.listen(3000, () => {
      console.log('Server started');
      done();
    });
  });

  afterAll(done => {
    server.close(() => {
      console.log('Server closed');
      done();
    });
  });


  let userId;

//   // Test case for creating a user
  it('should create a new user', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const res = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(200);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newUser.name);
    expect(res.body.email).toBe(newUser.email);
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
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(res.body.name).toBe(updatedUser.name);
    expect(res.body.email).toBe(updatedUser.email);
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

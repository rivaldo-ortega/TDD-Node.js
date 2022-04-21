const request = require('supertest');
const { app } = require('../server');
const mongoose = require('mongoose');

describe('POST /api/users', () => {
  test('create a new user', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Jose',
        active: false,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });
});
describe('GET /api/users', () => {
  test('It responds with an array of users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.body.users[0]).toHaveProperty('name');
    expect(response.body.users[0]).toHaveProperty('active');
    expect(response.statusCode).toBe(200);
  });
});
describe('PATCH /api/users/1', () => {
  test('It responds with an updated student', async () => {
    const newUser = await request(app).post('/api/users').send({
      name: 'Random',
      active: true,
    });
    const updatedUser = await request(app)
      .patch(`/api/users/${newUser.body.user._id}`)
      .send({
        name: 'Changed',
        active: false,
      });
    expect(updatedUser.body.user.name).toEqual('Changed');
    expect(updatedUser.statusCode).toBe(200);
  });
});

describe('DELETE /api/users/1', () => {
  test('It responds with a message of Deleted', async () => {
    const newUser = await request(app).post('/api/users').send({
      name: 'Random',
      active: true,
    });
    const removedUser = await request(app).delete(
      `/api/users/${newUser.body.user._id}`
    );
    expect(removedUser.body).toEqual({ message: 'Deleted' });
    expect(removedUser.statusCode).toBe(200);
  });
});
beforeAll((done) => {
  done();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

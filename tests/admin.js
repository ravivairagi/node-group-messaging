require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const db = require('../config/db.connect')
const index = require('../server');

beforeEach(async () => {
    await db.connect()
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('API Test Suite', () => {
    const admin = { username:'admin', password: "admin" }
    const userOne = { username:'testUser1', password: "user1", isAdmin: false };
    const userSecond = { username:'testUser2', password: "user2", isAdmin: true };
    let token = '';
    let userId = '';

    test('POST /user/login login admin user', async () => {
      const response = await request(index.app).post('/user/login').send(admin);
      expect(response.body).toHaveProperty('token');
      expect(response.statusCode).toBe(200);
      token = response.body.token
    });

    test('POST /user Create test user 1', async () => {
        const response = await request(index.app)
            .post('/user')
            .send(userOne)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(201);
    });

    test('POST /user Create test user 2', async () => {
        const response = await request(index.app)
            .post('/user')
            .send(userSecond)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(201);
        userId = response.body.user._id
    });

    test('PUT / Edit user', async () => {
        const response = await request(index.app)
            .put(`/user/${userId}`)
            .send({isAdmin: false})
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });

    test('GET / List of users', async () => {
        const response = await request(index.app)
            .get('/user/list')
            .set('Authorization', `Bearer ${token}`);
            expect(response.body).toHaveProperty('users');
        expect(response.statusCode).toBe(200);
      });
});

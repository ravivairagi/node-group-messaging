require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const db = require('../config/db.connect')
const index = require('../server');

/* Connecting to the database before each test. */
beforeEach(async () => {
    await db.connect()
});

afterEach(async () => {
    await mongoose.connection.close();
});

describe('API Test Suite', () => {
    const userOne = { username:'testUser1', password: "user1" };
    const groupName = "Test group"
    let token = '';
    let groupId = '';
    let memberId = '';
    let message = { message: "Test message" }
    let messageId = '';

    test('POST /user/login login user', async () => {
        const response = await request(index.app)
            .post('/user/login')
            .send(userOne);
        expect(response.body).toHaveProperty('token');
        expect(response.statusCode).toBe(200);
      token = response.body.token;
    });

    test('POST /group create new group', async () => {
        const response = await request(index.app).post('/group')
            .send({name: groupName})
            .set('Authorization', `Bearer ${token}`);
        expect(response.body).toHaveProperty('group');
        expect(response.statusCode).toBe(201);
        groupId = response.body.group._id;
      });

    test('GET / List of users', async () => {
        const response = await request(index.app)
            .get('/user/list')
            .set('Authorization', `Bearer ${token}`);
        expect(response.body).toHaveProperty('users');
        expect(response.statusCode).toBe(200);
        memberId = response.body.users[0]._id;
    });

    test('POST /group/member add member in group', async () => {
        const response = await request(index.app).post(`/group/${groupId}/members`)
            .send({members: [memberId]})
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });

    test('POST /group/:id/message send message in group', async () => {
        const response = await request(index.app).post(`/group/${groupId}/message`)
            .send(message)
            .set('Authorization', `Bearer ${token}`);
        expect(response.body).toHaveProperty('message');
        expect(response.statusCode).toBe(201);
        messageId = response.body.message._id;
    });

    test('POST /:id/message/:messageId/like like message', async () => {
        const response = await request(index.app)
            .post(`/group/${groupId}/message/${messageId}/like`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });

    test('GET /search/:search search group', async () => {
        const response = await request(index.app)
            .get('/group/search/group')
            .set('Authorization', `Bearer ${token}`);
        expect(response.body).toHaveProperty('groups');
        expect(response.statusCode).toBe(200);
    });

    test('DELETE /search/:search search group', async () => {
        const response = await request(index.app)
            .delete(`/group/${groupId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
    });

    test('DELETE test users from db', async () => {
        const response = await mongoose.models.User.deleteMany( {username: { $in: ['testUser1', 'testUser2']}})
        expect(response).toHaveProperty('acknowledged');
        expect(response.acknowledged).toBe(true);
    });

});

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

describe('post users', () => {
    test('a valid user can be added', async () => {
        const newUser = {
            username: "test4",
            name: "test4",
            password: "test4"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1)
        const contents = usersAtEnd.map(n => n.username)
        expect(contents).toContainEqual('test4')
    })

    test('a same valid user cannot be added twice', async () => {
        const newUser = {
            username: "test4",
            name: "test4",
            password: "test4"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            expect(response.body.error).toContain('expected `username` to be unique')
    })

    test('user with too short password return error 400 and error message', async () => {
        const newUser = {
            username: 'test4',
            name: 'test4',
            password: 'te'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('password must be at least 3 characters long')
    })

    test('user with too short username return error 400 and error message', async () => {
        const newUser = {
            username: 'te',
            name: 'test4',
            password: 'test4'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('username must be at least 3 characters long')
    })

    test('user with no password returns error 400 and error message', async () => {
        const newUser = {
            username: 'test4',
            name: 'test4',
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('`password` is required')
    })

    test('user with no username returns error 400 and error message', async () => {
        const newUser = {
            password: 'test4',
            name: 'test4',
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toContain('`username` is required')
    })
})

afterAll(() => {
    mongoose.connection.close()
})
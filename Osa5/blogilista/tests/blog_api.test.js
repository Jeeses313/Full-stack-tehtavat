const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token = ""

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
    const users = await User.find({})
    const user = users[0]
    token = helper.userToken(user)
})

describe('get blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body.map(r => r.title)
        expect(blogs).toContainEqual('Canonical string reduction')
    })

    test('blogs have id not _id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[1]
        expect(blog.id).toBeDefined()
        expect(blog._i).not.toBeDefined()
    })
})

describe('post blogs', () => {
    test('a valid blog can be added with token', async () => {
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
        const contents = blogsAtEnd.map(n => n.title)
        expect(contents).toContainEqual('tests are great')
    })

    test('a valid blog cannot be added without token', async () => {
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www',
            likes: 0
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toBe("Unauthorized")
    })

    test('blog with no likes is initialized with 0 likes', async () => {
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www'
        }
        const response = await api.post('/api/blogs').set('Authorization', `bearer ${token}`).send(newBlog).expect(201)
        const blog = response.body
        expect(blog.likes).toBe(0)
    })

    test('blog with no title and url returns error 400 Bad request', async () => {
        const newBlog = {
            author: 'tester',
            likes: 0
        }
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toBe('Bad request')
    })
})

describe('delete blogs', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www',
            likes: 0
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blog = response.body
        await api
            .delete(`/api/blogs/${blog.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(blogsAtStart.length)
        const contents = blogsAtEnd.map(n => n.title)
        expect(contents).not.toContainEqual(blog.title)
    })

    test('a blog cannot be deleted without token', async () => {
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www',
            likes: 0
        }

        let response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blog = response.body
        response = await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toBe("Unauthorized")
    })

    test('a blog cannot be deleted without right token', async () => {
        const newBlog = {
            author: 'tester',
            title: 'tests are great',
            url: 'www',
            likes: 0
        }

        let response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blog = response.body
        const users = await User.find({})
        const user = users[1]
        token = helper.userToken(user)
        response = await api
            .delete(`/api/blogs/${blog.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(response.body.error).toBe("Bad request")
    })
})

describe('update blogs', () => {
    test('a blog can be updated', async () => {
        let blogs = await helper.blogsInDb()
        const originalBlog = blogs[1]
        let blog = {
            author: "atest",
            title: "ttest",
            url: "utest",
            likes: -1
        }
        response = await api
            .put(`/api/blogs/${originalBlog.id}`)
            .send(blog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        blog = response.body
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toContainEqual(blog)
        expect(blogsAtEnd).not.toContainEqual(originalBlog)
    })

    test('updating non-existing blog returns error 400 id does not exists', async () => {
        const id = await helper.nonExistingId()
        let blog = {
            author: "atest",
            title: "ttest",
            url: "utest",
            likes: -1
        }
        response = await api
            .put(`/api/blogs/${id}`)
            .send(blog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(response.body.error).toBe("id does not exist")
    })
})

afterAll(() => {
    mongoose.connection.close()
})
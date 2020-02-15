const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'Unauthorized' })
    }
    if (!blog.likes) {
        blog.likes = 0
    }
    if (!blog.url && !blog.title) {
        response.status(400).json({
            error: 'Bad request'
        }).end();
    }

    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result.toJSON())
})

blogsRouter.delete('/:id', async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
        return response.status(401).json({ error: 'Unauthorized' })
    }
    const user = await User.findById(decodedToken.id)
    let blog = await Blog.findById(req.params.id)
    if (blog.user.toString() === user._id.toString()) {
        blog = await Blog.findByIdAndDelete(req.params.id)
        res.status(204).end();
    }
    res.status(400).json({ error: 'Bad request' })
});

blogsRouter.put('/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    let blog = await Blog.findById(id)
    if (!blog) {
        res.status(400).json({
            error: 'id does not exist'
        }).end();
    }
    let params = {
        author: body.author,
        likes: body.likes,
        title: body.title,
        url: body.url
    }
    for (let prop in params) {
        if (!params[prop]) {
            delete params[prop]
        }
    }
    blog = await Blog.findByIdAndUpdate(id, params, { new: true })
    res.json(blog.toJSON())
})


module.exports = blogsRouter
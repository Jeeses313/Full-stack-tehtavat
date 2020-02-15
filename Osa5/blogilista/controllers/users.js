const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    res.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.password) {
        return response.status(400).json({ error: "User validation failed: password: Path `password` is required" })
    }
    if(body.password.length < 3) {
        return response.status(400).json({ error: 'User validation failed: password: password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = usersRouter
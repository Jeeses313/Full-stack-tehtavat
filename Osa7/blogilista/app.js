const express = require('express')
const cors = require('cors')
const app = express()
require('express-async-errors')
const mongoose = require('mongoose')
const config = require('./utils/config')
app.use(cors())
app.use(express.json())
const middleware = require('./utils/middleware')
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)
const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)
const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/test')
    app.use('/api/test', testingRouter)
}
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
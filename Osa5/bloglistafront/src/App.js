import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
const blogFormRef = React.createRef()

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const blogForm = () => (
        <Togglable showLabel='new blog' hideLabel='cancel' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}></BlogForm>
        </Togglable>
    )

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs.sort((ablog, bblog) => bblog.likes - ablog.likes))
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setMessage({ message: 'login successful', error: false })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setMessage({ message: 'wrong username or password', error: true })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }


    const createBlog = async ({ title, author, url }) => {
        try {
            const blog = await blogService.create({ title, author, url })
            setBlogs(blogs.concat(blog))
            setMessage({ message: `a new blog ${blog.title} by ${blog.author} added`, error: false })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            blogFormRef.current.toggleVisibility()
            return true
        } catch (exception) {
            setMessage({ message: 'error', error: true })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            return false
        }
    }

    const likeBlog = async (blog) => {
        blog.likes = blog.likes + 1
        const updatedBlog = await blogService.update(blog)
        const newBlogs = blogs.slice()
        newBlogs.map(listBlog => listBlog.likes = (listBlog.id === updatedBlog.id) ? updatedBlog.likes : listBlog.likes)
        newBlogs.sort((ablog, bblog) => bblog.likes - ablog.likes)
        setBlogs(newBlogs)
    }

    const removeBlog = async (blog) => {
        if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            return
        }
        await blogService.remove(blog)
        setBlogs(blogs.filter(listBlog => listBlog.id !== blog.id))
        setMessage({ message: `removed blog ${blog.title} by ${blog.author}`, error: false })
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        blogService.setToken('')
        setMessage({ message: 'logged out', error: false })
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }



    if (user === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={message}></Notification>
                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input type="text" id="username" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} required></input>
                    </div>
                    <div>
                        password
                        <input type="password" id="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} required></input>
                    </div>
                    <button id='login-button' type="submit">login</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={message}></Notification>
            <div>{user.username} logged in <button onClick={handleLogout}>logout</button></div>
            <br />
            {blogForm()}
            <br />
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} user={user} />
            )}
        </div>
    )
}

export default App
import React, { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogPage from './components/BlogPage'
import UserPage from './components/UserPage'
import Header from './components/Header'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, likeBlogs, removeBlogs, createBlogs, commentBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { Switch, Route, useHistory, Redirect, useRouteMatch } from 'react-router-dom'
import UserList from './components/UserList'
import BlogList from './components/BlogList'
import { Button } from 'react-bootstrap'

const blogFormRef = React.createRef()

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])
    const blogs = useSelector(state => state.blogs.sort((a, b) => b.likes - a.likes))
    const user = useSelector(state => state.user)
    const history = useHistory()
    const [users, setUsers] = useState([])
    useEffect(() => {
        userService.getAll().then(response => {
            setUsers(response)
        })
    }, [])

    const usermatch = useRouteMatch('/users/:id')
    const viewUser = usermatch ? users.find(listUser => listUser.id === usermatch.params.id) : null
    const blogmatch = useRouteMatch('/blogs/:id')
    const viewBlog = blogmatch ? blogs.find(listBlog => listBlog.id === blogmatch.params.id) : null
    let remove = () => <></>
    if (viewBlog) {
        if (viewBlog.user) {
            remove = () => {
                if (user.username === viewBlog.user.username) {
                    return (<Button variant="secondary" size="sm" onClick={() => removeBlog(viewBlog)}>remove</Button>)
                } else {
                    return (<></>)
                }
            }
        }
    }



    const blogForm = () => (
        <Togglable showLabel='new blog' hideLabel='cancel' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}></BlogForm>
        </Togglable>
    )

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [dispatch])

    const handleLogin = async (username, password) => {
        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            dispatch(setUser(user))
            dispatch(setNotification({ message: 'login successful', error: false }, 5))
            history.push('/')
        } catch (exception) {
            dispatch(setNotification({ message: 'wrong username or password', error: true }, 5))
        }
    }


    const createBlog = async ({ title, author, url }) => {
        try {
            dispatch(createBlogs({ title, author, url }, user))
            dispatch(setNotification({ message: `a new blog ${title} by ${author} added`, error: false }, 5))
            blogFormRef.current.toggleVisibility()
            return true
        } catch (exception) {
            dispatch(setNotification({ message: 'error', error: true }, 5))
            return false
        }
    }

    const likeBlog = async (blog) => {
        dispatch(likeBlogs(blog))
    }

    const removeBlog = async (blog) => {
        if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            return
        }
        dispatch(removeBlogs(blog))
        dispatch(setNotification({ message: `removed blog ${blog.title} by ${blog.author}`, error: false }, 5))
        if (viewBlog) {
            history.push('/')
        }
    }

    const createComment = async (event) => {
        event.preventDefault()
        const comment = event.target.comment.value
        dispatch(commentBlogs(viewBlog, comment))
        event.target.comment.value = ''
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(setUser(null))
        blogService.setToken('')
        dispatch(setNotification({ message: 'logged out', error: false }, 5))
        history.push('/login')
    }

    const toBlogList = () => history.push('/')
    const toUserList = () => history.push('/users')

    return (
        <div>
            <Switch>
                <Route path="/login">
                    <div className="container">
                        <LoginForm handleLogin={handleLogin}></LoginForm>
                    </div>
                </Route>
                <Route path="/">
                    {user ?
                        <>
                            <Header user={user} handleLogout={handleLogout} toBlogList={toBlogList} toUserList={toUserList}></Header>
                            <div className="container">
                                <Switch>
                                    <Route path="/blogs/:id">
                                        {viewBlog ?
                                            <BlogPage viewBlog={viewBlog} likeBlog={likeBlog} remove={remove} createComment={createComment}></BlogPage>
                                            :
                                            <></>
                                        }
                                    </Route>
                                    <Route path="/users/:id">
                                        {viewUser ?
                                            <UserPage viewUser={viewUser}></UserPage>
                                            :
                                            <></>
                                        }
                                    </Route>
                                    <Route path="/users">
                                        <UserList users={users}></UserList>
                                    </Route>
                                    <Route path="/">
                                        <BlogList blogForm={blogForm} blogs={blogs}></BlogList>
                                    </Route>
                                </Switch>
                            </div>
                        </>
                        :
                        <Redirect to="/login" />
                    }
                </Route>
            </Switch>
        </div >
    )
}

export default App
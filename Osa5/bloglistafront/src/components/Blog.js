import React from 'react'
import Togglable from './Togglable'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
    const styleBox = {
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    const bloguser = blog.user ? blog.user.username : 'unknown'
    let remove = () => <></>
    if (blog.user) {
        remove = () => {
            if (user.username === blog.user.username) {
                return (<button onClick={() => removeBlog(blog)}>remove</button>)
            } else {
                return (<></>)
            }
        }
    }


    return (
        <>
            <div style={styleBox}>
                <div id='titleAndAuthor'>{blog.title} by {blog.author}</div>
                <Togglable showLabel='view' hideLabel='hide'>
                    <div>{blog.url}</div>
                    <div>likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button></div>
                    <div>{bloguser}</div>
                    <div>{remove()}</div>
                </Togglable>
            </div>
        </>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
}

export default Blog

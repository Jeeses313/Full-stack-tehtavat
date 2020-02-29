import React from 'react'
import { Link } from 'react-router-dom'

const UserPage = ({ viewUser }) => {

    return (
        <>
            <h2>{viewUser.username}</h2>
            <h4>added blogs</h4>
            <ul>
                {viewUser.blogs.map(blog =>
                    <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
                )}
            </ul>
        </>
    )
}

export default UserPage
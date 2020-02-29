import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
    /*
    const styleBox = {
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    */

    return (
        <>
            <div>
                <Link id='titleAndAuthor' to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            </div>
        </>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog

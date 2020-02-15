import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const createBlogSubmit = async (event) => {
        event.preventDefault()
        let success = await createBlog({ title, author, url })
        if (success) {
            setTitle('')
            setAuthor('')
            setUrl('')
        }
    }
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={createBlogSubmit}>
                <div>
                    title:
                    <input type="text" id='title' value={title} name="Title" onChange={({ target }) => setTitle(target.value)} required></input>
                </div>
                <div>
                    author:
                    <input type="text" id='author' value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} required></input>
                </div>
                <div>
                    url:
                    <input type="text" id='url' value={url} name="Url" onChange={({ target }) => setUrl(target.value)} required></input>
                </div>
                <button id='blogSubmit' type="submit">create</button>
            </form>
        </>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm
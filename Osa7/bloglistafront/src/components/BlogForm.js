import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

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
            <Form onSubmit={createBlogSubmit}>
                <Form.Label>title:</Form.Label>
                <Form.Control type="text" id='title' value={title} name="Title" onChange={({ target }) => setTitle(target.value)} required />
                <Form.Label>author:</Form.Label>
                <Form.Control type="text" id='author' value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} required />
                <Form.Label>url:</Form.Label>
                <Form.Control type="text" id='url' value={url} name="Url" onChange={({ target }) => setUrl(target.value)} required />
                <Button id='blogSubmit' type="submit">create</Button>
            </Form>
        </>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm
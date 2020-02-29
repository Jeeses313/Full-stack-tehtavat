import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const BlogPage = ({ viewBlog, likeBlog, remove, createComment }) => {

    return (
        <>
            <h3>{viewBlog.title} by {viewBlog.author}</h3>
            <br />
            <a href={viewBlog.url}>{viewBlog.url}</a>
            <div>likes {viewBlog.likes} <Button variant="secondary" size="sm" onClick={() => likeBlog(viewBlog)}>like</Button></div>
            <div>added by <Link to={`/users/${viewBlog.user.id}`}>{viewBlog.user.username}</Link></div>
            <div>{remove()}</div>
            <br />
            <h4>comments</h4>
            <form onSubmit={createComment}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <input type="text" name="comment" required></input>
                            </td>
                            <td>
                                <Button variant="secondary" size="sm" id='commentSubmit' type="submit">create</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <ul>
                {viewBlog.comments.map((comment, i) =>
                    <li key={i}>{comment}</li>
                )}
            </ul>
        </>
    )
}

export default BlogPage
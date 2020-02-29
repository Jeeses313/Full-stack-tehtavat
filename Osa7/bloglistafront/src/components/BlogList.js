import React from 'react'
import Blog from './Blog'
import { Table } from 'react-bootstrap'

const BlogList = ({ blogForm, blogs }) => {
    return (
        <>
            <h2>Blogs</h2>
            {blogForm()}
            <br />
            <Table>
                <tbody>
                    {blogs.map(blog =>
                        <tr key={blog.id}>
                            <td>
                                <Blog blog={blog} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

        </>
    )
}

export default BlogList
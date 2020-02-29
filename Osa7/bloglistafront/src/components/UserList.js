import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UserList = ({ users }) => {
    return (
        <>
            <h2>Users</h2>
            <Table>
                <thead>
                    <tr>
                        <th><b>user</b></th>
                        <th><b>blogs created</b></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(listUser =>
                        <tr key={listUser.id}>
                            <td><Link to={`/users/${listUser.id}`}>{listUser.name}</Link></td>
                            <td>{listUser.blogs.length}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </>
    )
}

export default UserList
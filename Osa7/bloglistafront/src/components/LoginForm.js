import React, { useState } from 'react'
import Notification from './Notification'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const login = (event) => {
        event.preventDefault()
        handleLogin(username, password)
        setUsername('')
        setPassword('')
    }

    return (
        <>
            <h2>Log in to application</h2>
            <Notification></Notification>
            <Form onSubmit={login}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control id="username" type="text" name="username" onChange={({ target }) => setUsername(target.value)} required />
                    <Form.Label>password:</Form.Label>
                    <Form.Control id="password" type="password" name="password" onChange={({ target }) => setPassword(target.value)} required />
                    <Button id="login-button" variant="primary" type="submit">login</Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default LoginForm
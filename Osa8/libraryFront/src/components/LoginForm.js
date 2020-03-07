import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'

const LoginForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [login, result] = useMutation(props.LOGIN, {
        onError: props.refetchQueriesAndHandleError.onError
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            const user = result.data.login.user
            props.setToken(token)
            localStorage.setItem('user-token', token)
            props.setPage('authors')
            localStorage.setItem('logged-user', JSON.stringify(user))
            props.setUser(user)
        }
    }, [result.data]) // eslint-disable-line
    const submit = async (event) => {
        event.preventDefault()
        props.client.resetStore()
        login({ variables: { username, password } })
        setUsername('')
        setPassword('')
    }
    if (!props.show) {
        return null
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={submit}>
                <div>
                    username <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </>
    )
}

export default LoginForm
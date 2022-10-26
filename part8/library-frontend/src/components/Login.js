import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'

const Login = ({ setError, setToken, show, setPage }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].messages)
        },
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('userToken', token)
        }
    }, [result.data]) // eslint-disable-line

    if (!show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        await login({ variables: { username, password } })
        setPage('authors')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    Username
                    <input 
                        value={username}
                        type="text"
                        onChange={({target}) => setUsername(target.value)}
                    />
                </div>
                <div>
                    Password
                    <input 
                        value={password}
                        type="password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login
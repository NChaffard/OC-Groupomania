import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApiErrors, apiFetch } from '../utils/api';



export function LoginForm({ onConnect }) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async function (e) {
        setError(null)
        setLoading(true)
        e.preventDefault()

        const data = new FormData(e.target)
        try {
            const user = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    "email": data.get('email'),
                    "password": data.get('password')
                })
            })
            localStorage.setItem('token', user.token)
            localStorage.setItem('userId', user.userId)
            onConnect(user)
        } catch (e) {
            if (e instanceof ApiErrors) {
                setError(e.errors)
            } else {
                console.error(e)
            }
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit}>
        <h2>Se connecter</h2>
        {error && <Alert>{error}</Alert>}
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" name='email' id='email' required />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="text" name='password' id='password' required />
        </div>
        <button disabled={loading} type='submit'>Se connecter</button>
    </form>
}

LoginForm.propTypes = {
    onConnect: PropTypes.func.isRequired
}

function Alert({ children }) {
    return <div>
        {children}
    </div>
}
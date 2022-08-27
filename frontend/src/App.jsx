import React, { useEffect, useState } from 'react';
import { LoginForm } from './App/LoginForm';
import { Site } from './App/Site';
import { apiFetch } from './utils/api';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
    const [user, setUser] = useState(null)

    useEffect(function () {
        apiFetch('/auth/me')
            .then(setUser)
            .catch(() => setUser(null))
    }, [])
    return (
        <BrowserRouter>
            {user ? <Site /> : <LoginForm onConnect={setUser} />}
        </BrowserRouter>
    );
}


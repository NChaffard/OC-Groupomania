import React, { useEffect, useState } from 'react';
import { LoginForm } from './App/LoginForm';
import { Site } from './App/Site';
import { apiFetch } from './utils/api';


export default function App() {
    const [user, setUser] = useState(null)
    useEffect(function () {
        apiFetch('/auth/me',)
            .then(setUser)
            .catch(() => setUser(null))
    }, [])
    return (

        user ? <Site /> : <LoginForm onConnect={setUser} />
    );
}


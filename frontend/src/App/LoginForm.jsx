import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApiErrors, apiFetch } from '../utils/api';
import '../scss/loginForm.scss'
import brandImg from '../assets/icon-left-font.png';
import { useEffect } from 'react';



export function LoginForm({ onConnect }) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [signupMode, setSignupMode] = useState(false)
    const [endpoint, setEndpoint] = useState('/auth/login')

    useEffect(function () {
        signupMode === true ? setEndpoint('/auth/signup') : setEndpoint('/auth/login')
    }, [signupMode])

    const handleClick = function (e) {
        e.preventDefault();
        signupMode === true ? setSignupMode(false) : setSignupMode(true)
    }

    const handleSubmit = async function (e) {

        setError(null)
        setLoading(true)
        e.preventDefault()
        console.log(endpoint)
        const data = new FormData(e.target)
        try {

            const user = await apiFetch(endpoint, {
                method: 'POST',
                body: data

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

    return <main className="main">
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-container">

                {signupMode === true ? <h2 className="form__title form__title_on">S'enregistrer</h2> : <h2 className="form__title">Se connecter</h2>}
                {error && <Alert>{error}</Alert>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" name='email' id='email' required />
                </div>
                {signupMode === true ? <><div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input type="text" name='name' id='name' required />
                </div></> : null}

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="text" name='password' id='password' required />
                </div>
                <button className={signupMode === true ? "form__submit form__submit_on" : "form__submit"} disabled={loading} type='submit'>Envoyer</button>
                {signupMode === true ? <button className="signup signup_on" onClick={handleClick}>Se connecter</button> : <button className="signup signup_off" onClick={handleClick}>S'inscrire</button>}

            </div>
        </form>
        <div className="form-right">
            <img className="form-right__img" src={brandImg} alt="Logo Groupomania" />
        </div>
    </main>
}

LoginForm.propTypes = {
    onConnect: PropTypes.func.isRequired
}

function Alert({ children }) {
    return <div>
        {children}
    </div>
}
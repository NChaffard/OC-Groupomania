import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApiErrors, apiFetch } from '../utils/api';
import '../scss/loginForm.scss'
import brandImg from '../assets/icon-left-font.png';
import { useEffect } from 'react';
import { Field } from '../ui/Field';
import { formValidation, validateInput } from '../utils/validateInput';



export function LoginForm({ onConnect }) {
    const [error, setError] = useState(null)
    const [errorMsg, setErrorMsg] = useState({})

    const [cantSubmit, setCantSubmit] = useState(false)
    const [signupMode, setSignupMode] = useState(false)
    const [endpoint, setEndpoint] = useState('/auth/login')



    const handleInput = function (e) {
        let msg = validateInput(e.target)

        setErrorMsg(prev => ({
            ...prev,
            ...msg
        })
        )
    }


    useEffect(function () {

        setError(null)
        setErrorMsg({})
        if (signupMode === true) {
            document.getElementById('email').value = null;
            document.getElementById('password').value = null;
            document.getElementById('name').value = null;

            setEndpoint('/auth/signup')
        } else {
            document.getElementById('email').value = null;
            document.getElementById('password').value = null;

            setEndpoint('/auth/login')
        }
    }, [signupMode])

    const handleClick = function (e) {
        e.preventDefault();
        signupMode === true ? setSignupMode(false) : setSignupMode(true)
    }

    const handleSubmit = async function (e) {
        setError(null)
        setCantSubmit(true)
        e.preventDefault()
        if (formValidation(errorMsg)) {

            const data = new FormData(e.target)
            try {
                const user = await apiFetch(endpoint, {
                    method: 'POST',
                    body: data
                })
                localStorage.setItem('token', user.token)
                localStorage.setItem('userId', parseInt(user.userId))
                localStorage.setItem('isAdmin', parseInt(user.isAdmin))
                onConnect(user)
            } catch (e) {
                if (e instanceof ApiErrors) {
                    setError(e.errors)
                } else {
                    console.error(e)
                }
            }
        } else {
            setError("Un champ est invalide")
            console.log('submit')
        }
        setCantSubmit(false)
    }



    return <main className="main-login">
        <form className="form form-login" onSubmit={handleSubmit}>
            <div className="form-container">

                {signupMode === true ? <h2 className="form-login__title form-login__title_on">S'enregistrer</h2> : <h2 className="form-login__title">Se connecter</h2>}
                {error && <Alert>{error}</Alert>}
                <Field onBlur={handleInput} className="form__input" error={errorMsg.email} name='email' type='email' id='email' required >Email</Field>
                {signupMode === true ? <>
                    <Field onBlur={handleInput} className="form__input" error={errorMsg.name} name='name' id='name' required >Nom</Field>
                </> : null}

                <Field onBlur={handleInput} className="form__input" error={errorMsg.password} name='password' type='password' id='password' required >Mot de passe</Field>

                <button className={signupMode === true ? "form__submit form__submit_on" : "form__submit"} disabled={cantSubmit} type='submit'>Envoyer</button>

                {signupMode === true ?
                    <button className="signup signup_on" onClick={handleClick}>Se connecter</button> :
                    <button className="signup signup_off" onClick={handleClick}>S'inscrire</button>}

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
// Import dependancies
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ApiErrors, apiFetch } from '../utils/api';
import { useEffect } from 'react';
import { Field } from '../ui/Field';
import { formValidation, validateInput } from '../utils/validateInput';
// Import css
import '../scss/loginForm.scss';
// Import assets
import brandImg from '../assets/icon-left-font.svg';
import brandImgTablet from '../assets/logo-groupomania-primary.svg';



export function LoginForm({ onConnect }) {
    // Errors from submit
    const [error, setError] = useState(null)
    // Errors from input
    const [errorMsg, setErrorMsg] = useState({})
    // If it's true, submit is disabled
    const [cantSubmit, setCantSubmit] = useState(false)
    // Set to true if signup is on
    const [signupMode, setSignupMode] = useState(false)
    // Endpoint for the API
    const [endpoint, setEndpoint] = useState('/auth/login')


    // useEffects

    // When signupMode change
    useEffect(function () {
        // reset errors states 
        setError(null)
        setErrorMsg({})

        // If signupMode change, reset inputs values
        if (signupMode === true) {
            document.getElementById('email').value = null;
            document.getElementById('password').value = null;
            document.getElementById('name').value = null;
            // change endpoint to signup
            setEndpoint('/auth/signup')
        }
        else {
            document.getElementById('email').value = null;
            document.getElementById('password').value = null;
            // change endpoint to login
            setEndpoint('/auth/login')
        }
    }, [signupMode])

    // Handles
    const handleInput = function (e) {
        // Check if input is valid
        let msg = validateInput(e.target)
        // Set errorMsg with the result 
        setErrorMsg(prev => ({
            ...prev,
            ...msg
        })
        )
    }

    const handleClick = function (e) {
        e.preventDefault();
        // Toggle signupMode
        signupMode === true ? setSignupMode(false) : setSignupMode(true)
    }

    const handleSubmit = async function (e) {
        e.preventDefault()
        // Set submit error
        setError(null)
        // Disable submit button
        setCantSubmit(true)
        // If there is no errors
        if (formValidation(errorMsg)) {
            // Prepare the data
            const data = new FormData(e.target)
            // Try to send to the API
            try {
                const user = await apiFetch(endpoint, {
                    method: 'POST',
                    body: data
                })
                // Set response items in localStorage
                localStorage.setItem('token', user.token)
                localStorage.setItem('userId', parseInt(user.userId))
                localStorage.setItem('isAdmin', parseInt(user.isAdmin))
                // Return user data
                onConnect(user)
            }
            // Else set Error state with errors from API
            catch (e) {
                if (e instanceof ApiErrors) {
                    setError(e.errors)
                } else {
                    console.error(e)
                }
            }
        }
        // Else set error state
        else {
            setError("Un champ est invalide")
        }
        setCantSubmit(false)
    }



    return <div className="wrapper">
        <main className="login-form__main">
            <div className="login-form__container">
                <form className="form login-form__form" onSubmit={handleSubmit}>
                    {signupMode === true ? <h2 className="login-form__title login-form__title_on">S'enregistrer</h2> : <h2 className="login-form__title">Se connecter</h2>}
                    {error && <Alert>{error}</Alert>}
                    <Field onBlur={handleInput} className="login-form-email" error={errorMsg.email} name='email' type='email' id='email' tabIndex='1' required >Email</Field>
                    {signupMode === true ? <>
                        <Field onBlur={handleInput} className="login-form-name" error={errorMsg.name} name='name' id='name' tabIndex='3' required >Nom</Field>
                    </> : null}

                    <Field onBlur={handleInput} className="login-form-password" error={errorMsg.password} name='password' type='password' id='password' tabIndex='2' required >Mot de passe</Field>
                    {signupMode === true ? <p className="login-form__tips">Le mot de passe doit contenir au moins 3 caractères, minuscule, majuscule ou chiffre</p> : null}
                    <div className="login-form-submit">
                        <button className={signupMode === true ?
                            "submit login-form-submit__button login-form-submit__button-signup" :
                            "submit login-form-submit__button"}
                            disabled={cantSubmit}
                            type='submit'
                        >Envoyer</button>
                    </div>
                    <div className="login-form__signup">
                        {signupMode === true ?
                            <button className="login-form__signup-button login-form__signup-button_on" onClick={handleClick}>Se connecter</button> :
                            <button className="login-form__signup-button login-form__signup-button_off" onClick={handleClick}>S'inscrire</button>}
                    </div>
                </form>
            </div>
            <div className="login-form-logo">
                <img className="login-form-logo__img" src={brandImg} alt="Logo Groupomania" />
                <img className="login-form-logo__img_tablet" src={brandImgTablet} alt="Logo Groupomania" />
            </div>
        </main>
    </div>
}

LoginForm.propTypes = {
    onConnect: PropTypes.func.isRequired
}

function Alert({ children }) {
    return <div className="login-form__error">
        {children}
    </div>
}
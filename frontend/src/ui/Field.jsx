import React from 'react'
import PropTypes from 'prop-types'



export function Field({ name, children, type = 'text', error, className = 'form-group', ...props }) {



    return <div className={className}>
        {children && <label htmlFor={name} className={`${className}__label`}>{children}</label>}
        {type === 'textarea' ?
            <textarea name={name} id={name} className={`${className}__input${error ? ' is-invalid' : ''}`} {...props} /> :
            <input type={type} name={name} id={name} className={`${className}__input${error ? ' is-invalid' : ''}`} {...props} />}
        {error && <div className={`invalid-feedback ${className}__invalid-feedback`}>{error}</div>}
    </div>
}

Field.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string
}


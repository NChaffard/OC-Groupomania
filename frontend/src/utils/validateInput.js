export function validateInput(input) {

    let { type, name, value } = input
    let msg = { [name]: '' }

    const getRegexp = (type) => {

        let regExp = null
        switch (type) {

            case 'email':
                regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                break;
            case 'password':
                regExp = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,30}$/;
                break;
            default:
                regExp = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s-]{2,30}$/;
                break;
        }
        return regExp
    }


    if (!value) {
        msg = { [name]: `Le champ ne peut pas être vide` }
    }
    else if (!getRegexp(type).test(value)) {
        console.log(value)
        msg = { [name]: `Le champ est invalide` }
    }

    return msg;

}

export function formValidation(errors) {
    let isOk = false
    Object.entries(errors).every(([key, value]) => {
        if (value === "") {
            isOk = true
            return true
        }
        else {
            isOk = false
            return false
        }
    })
    return isOk

}
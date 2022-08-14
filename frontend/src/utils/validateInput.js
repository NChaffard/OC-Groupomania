export function validateInput(input) {
    let msg;
    if (input.files) {
        let { name } = input
        let { type, size } = input.files[0]
        let isOk = false
        input.accept.split(',').map(a => a.trim() === type ? isOk = true : null)
        !isOk ? msg = { [name]: `Le format de fichier est invalide` } :
            size >= 10000000 ? msg = { [name]: 'Le fichier est trop lourd' } : msg = { [name]: '' }

    } else {


        let { type, name, value } = input

        msg = { [name]: '' }
        if (name === 'name') {
            type = name
        }

        const getRegexp = (type) => {

            let regExp = null
            switch (type) {

                case 'email':
                    regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    break;
                case 'name':
                    regExp = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s-]{3,30}$/;
                    break;
                case 'password':
                    regExp = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,30}$/;
                    break;
                default:
                    regExp = /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s():;.,"!?-]{5,3000}$/;

            }
            return regExp
        }


        if (!value) {
            msg = { [name]: `Le champ ne peut pas être vide` }
        }
        else if (!getRegexp(type).test(value)) {
            msg = { [name]: `Le champ est invalide` }
        }

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
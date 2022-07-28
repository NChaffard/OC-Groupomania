/**
 * Show an error send by the api
 */
export class ApiErrors {
    constructor(errors) {
        this.errors = errors
    }
}


/**
 * @param {string} endpoint 
 * @param {object} options 
 */

export async function apiFetch(endpoint, options = {}) {

    let token = null;
    if (!(token = 'Bearer ' + localStorage.getItem('token'))) {
        token = '';
    }


    const response = await fetch('http://localhost:3333/api' + endpoint, {
        headers: {
            'authorization': token,
            'Accept': 'application/json',
            // 'Content-Type': 'application/json'
            // 'Content-Type': 'multipart/form-data;boundary=???'
        },
        ...options
    })
    if (response.status === 204) {
        return null;
    }
    const responseData = await response.json()
    if (response.ok) {
        return responseData;
    } else {
        if (responseData.error) {
            throw new ApiErrors(responseData.error)
        }
    }
}
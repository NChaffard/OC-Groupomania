
//  Show an error send by the api

export class ApiErrors {
    constructor(errors) {
        this.errors = errors
    }
}

// Accept string for endpoint and an object containing method and/or body for options
export async function apiFetch(endpoint, options = {}) {

    let token = null;
    // If there is no token in localStorage, set it to empty string
    if (!(token = 'Bearer ' + localStorage.getItem('token'))) {
        token = '';
    }


    const response = await fetch('http://localhost:3333/api' + endpoint, {
        headers: {
            'authorization': token,
            'Accept': 'application/json',
        },
        ...options
    })
    // If there is no content, return null
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
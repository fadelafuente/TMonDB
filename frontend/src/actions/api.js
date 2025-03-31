import axios from 'axios';

axios.defaults.withCredentials = true;

export async function createResource(resource, data) {
    const access = localStorage.getItem('access');
    let config = {};
    
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    const body = JSON.stringify(data);

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/api/${resource}/`, body, config);
    } catch(err) {
    }
}

export async function getAllResources(resource, details={'page': 1}) {
    const access = localStorage.getItem('access');
    let config = {};

    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/${resource}/?${body}`, config);
    } catch(err) {
        return null;
    }
}

export async function getResourceById(resource, id) {
    const access = localStorage.getItem('access');
    let config = {};

    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/api/${resource}/${id}/`, config);
    } catch(err) {
        if(err.response) {
            return err.response
        }
        return null;
    }
}

export async function updateResourceById(resource, id, data={}, interaction_type=null) {
    const access = localStorage.getItem('access');
    let config = {};
    
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    const body = JSON.stringify(data);
    let uri = `${process.env.REACT_APP_API_URL}/api/${resource}/${id}/`;

    if(interaction_type) {
        uri += `${interaction_type}/`
    }

    try {
        return await axios.patch(uri, body, config);
    } catch(err) {
    }
}

export async function deleteResourceById(resource, id) {
    const access = localStorage.getItem('access');
    let config = {};
    
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/api/${resource}/${id}/`, config);
    } catch(err) {
    }
}
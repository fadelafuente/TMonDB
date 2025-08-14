import axios from 'axios';
import { 
    ACTIVATION_RESENT_SUCCESS,
    ACTIVATION_RESENT_FAIL
} from './types';

axios.defaults.withCredentials = true;

export const resendActivation = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/resend_activation/`, body, config);

        dispatch({
            type: ACTIVATION_RESENT_SUCCESS
        });
    } catch(err) {
        dispatch({
            type: ACTIVATION_RESENT_FAIL
        });
    }
}

export async function updateDetails(kwargs) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({ ...kwargs });

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/me/`, body, config);
    } catch (err) {
    }
}

export async function getUserProfile(username) {
    const access = localStorage.getItem('access');  
    let config = undefined;
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/${username}/`, config);
    } catch(err) {
        return null;
    }
}

export async function followUser(username) {
    const access = localStorage.getItem('access');
    let config = undefined;
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    try {
        return await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/${username}/follow/`, {}, config);
    } catch(err) {
        return null;
    }
}

export async function deleteUser(current_password) {    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        },
        'data': JSON.stringify({ current_password })
    };

    try {
        return await axios.delete(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    } catch(err) {
        if(err.response && err.response.data)
            return err.response;
        return null;
    }
}

export async function getFollowByUsername(username, follow_type, kwargs={'page': 1}) {    
    const access = localStorage.getItem('access');  
    let config = undefined;
    if(access) {
        config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${access}`
            }
        };
    }

    const query = Object.keys(kwargs).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(kwargs[key])).join('&');

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/${username}/${follow_type}/?${query}`, config);
    } catch(err) {
        return null;
    }
}

export async function getCurrentUsersBlockedList(resource='users', details={'page': 1}) {    
    const access = localStorage.getItem('access');  
    let config = undefined;
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
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/${resource}/blocking/?${body}`, config);
    } catch(err) {
        return null;
    }
}

export async function patchCurrentUsersBlockedList(username) {    
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
        return await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/${username}/block/`, {}, config);
    } catch(err) {
        return null;
    }
}
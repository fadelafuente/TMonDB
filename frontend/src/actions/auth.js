import axios from 'axios';
import { 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    LOAD_USER_SUCCESS, 
    LOAD_USER_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    RESET_SUCCESS,
    RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SOCIAL_AUTH_SUCCESS,
    SOCIAL_AUTH_FAIL,
    LOGIN_ATTEMPT,
    REGISTER_ATTEMPT,
    ACTIVATION_RESENT_SUCCESS,
    ACTIVATION_RESENT_FAIL
} from './types';
import { redirect } from 'react-router-dom';

axios.defaults.withCredentials = true;

export const checkAuthenticated = () => async dispatch => {
    if(localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        const body = JSON.stringify({ token: localStorage.getItem("access") });

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config);

            if(res.data.code !== "token_not_valid") {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            } else {
                dispatch({
                    type: AUTHENTICATED_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: AUTHENTICATED_FAIL
            });
        }
    } else {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
}

export const socialAuthenticate = (state, code, provider) => async dispatch => {
    if(state && code && !localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

        const details = {
            "state": state,
            "code": code
        };

        const body = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/o/${provider}/?${body}`, config);

            dispatch({
                type: SOCIAL_AUTH_SUCCESS,
                payload: res.data
            });

            dispatch(loadUser());
        } catch(err) {
            dispatch({
                type: SOCIAL_AUTH_FAIL
            });
        }
    } else {
        dispatch({
            type: SOCIAL_AUTH_FAIL
        });
    }
}

export const loadUser = () => async dispatch => {
    if(localStorage.getItem("access")) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${localStorage.getItem("access")}`,
                "Accept": "application/json"
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: LOAD_USER_FAIL
            });
        }
    } else {
        dispatch({
            type: LOAD_USER_FAIL
        });
    }
}

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
    }
}

export const logout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    });

    if(window.location.pathname === "/home") {
        window.location.reload();
    } else {
        redirect("/home");
    }
}

export const register = (first_name, last_name, username, email, password, re_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email, first_name, last_name, username, password, re_password });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: REGISTER_FAIL,
            payload: err.response.data
        });
    }
}

export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ uid, token });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config);

        dispatch({
            type: ACTIVATION_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: ACTIVATION_FAIL
        });
    }
}

export const setLoginByEmail = (email, reset_type) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_${reset_type}/`, body, config);

        dispatch({
            type: RESET_SUCCESS
        });
    } catch(err) {
        dispatch({
            type: RESET_FAIL
        });
    }
}

export const resetLoginConfirm = (uid, token, kwargs={}, reset_type="password") => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ uid, token, ...kwargs });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_${reset_type}_confirm/`, body, config);

        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch(err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
    }
}

// Reset login attempt back to false
export const loginAttempt = () => dispatch => {
    try {
        dispatch({
            type: LOGIN_ATTEMPT
        });
    }
    catch(err) {

    }
}

export const registerAttempt = () => dispatch => {
    try {
        dispatch({
            type: REGISTER_ATTEMPT
        });
    } catch(err) {

    }
}

export const resendActivation = (email) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
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
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`        }
    };

    const body = JSON.stringify({ ...kwargs });

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/me/`, body, config);
    } catch (err) {
    }
}

export async function getUserProfile(username) {
    const access = localStorage.getItem("access");

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/record/?username=${username}`, config);
    } catch(err) {
        return null;
    }
}

export async function getCurrentUserDetails() {
    const access = localStorage.getItem("access");

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    try {
        return await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    } catch(err) {
        return null;
    }
}

export async function followUser(id) {
    const access = localStorage.getItem("access");
    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${access}`
        }
    };

    const body = JSON.stringify({ id });

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/follow/`, body, config);
    } catch(err) {
        return null;
    }
}
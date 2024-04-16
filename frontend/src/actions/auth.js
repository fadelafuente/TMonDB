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
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
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

        console.log(localStorage.getItem("access"));

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

export const resetPassword = (email) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ email });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

        dispatch({
            type: PASSWORD_RESET_SUCCESS
        });
    } catch(err) {
        dispatch({
            type: PASSWORD_RESET_FAIL
        });
    }
}

export const resetPasswordConfirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    const body = JSON.stringify({ uid, token, new_password, re_new_password });

    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);

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

export async function setUsername(username) {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${localStorage.getItem("access")}`        }
    };

    const body = JSON.stringify({ username });

    try {
        return await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/me/`, body, config);
    } catch (err) {
    }
}
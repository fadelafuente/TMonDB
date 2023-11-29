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
    LOGIN_ATTEMPT
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null
};

export default function auth(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                access: payload.access,
                refresh: payload.refresh,
                loginFailed: false
            }
        case SOCIAL_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                access: payload.access,
                refresh: payload.refresh
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: payload
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case LOGIN_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                loginFailed: true
            }
        case SOCIAL_AUTH_FAIL:
        case REGISTER_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case LOAD_USER_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        case LOGIN_ATTEMPT:
            return {
                ...state,
                loginFailed: false
            }
        default:
            return state
    }
};


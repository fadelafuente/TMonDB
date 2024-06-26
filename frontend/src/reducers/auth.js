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
                isAuthenticated: false,
                errMessage: '',
                accountCreated: true
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
        case REGISTER_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                errMessage: payload,
                accountCreated: false
            }
        case SOCIAL_AUTH_FAIL:
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
        case RESET_SUCCESS:
        case RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
        case ACTIVATION_RESENT_SUCCESS:
        case ACTIVATION_RESENT_FAIL:
            return {
                ...state
            }
        case LOGIN_ATTEMPT:
            return {
                ...state,
                loginFailed: false
            }
        case REGISTER_ATTEMPT:
            return {
                ...state,
                errMessage: '',
                accountCreated: false
            }
        default:
            return state
    }
};


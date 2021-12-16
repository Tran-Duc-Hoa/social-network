import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
    const token = localStorage.getItem('token');
    if (token) {
        setAuthToken(token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

// Register User
export const register =
    ({ name, email, password }) =>
    async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify({ name, email, password });

        try {
            const res = await axios.post('/api/users', body, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });

            dispatch(loadUser());

            dispatch(setAlert('Register success!', 'success'));
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
            }
            dispatch({
                type: REGISTER_FAIL,
            });
        }
    };

// Login User
export const login =
    ({ email, password }) =>
    async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify({ email, password });

        try {
            const res = await axios.post('/api/auth', body, config);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });

            dispatch(loadUser());

            dispatch(setAlert('Login success!', 'success'));
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
            }
            dispatch({
                type: LOGIN_FAIL,
            });
        }
    };

// Logout / Clear Profile
export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch({ type: CLEAR_PROFILE });
};

import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
    GET_PROFILES,
    GET_REPOS,
} from './types';
axios.defaults.baseURL = 'http://localhost:3000';
// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get('api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Get profile success', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });

        dispatch(setAlert('Get profile fail', 'danger'));
    }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get('api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });

        dispatch(setAlert('Get profile success', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });

        dispatch(setAlert('Get profile fail', 'danger'));
    }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`api/profile/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Get profile success', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });

        dispatch(setAlert('Get profile fail', 'danger'));
    }
};

// Get github repos
export const getGithubRepos = (username) => async (dispatch) => {
    // dispatch({ type: CLEAR_PROFILE });

    try {
        const res = await axios.get(`api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data,
        });

        dispatch(setAlert('Get repos success', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });

        dispatch(setAlert('Get repos fail', 'danger'));
    }
};

// Create or update profile
export const createProfile =
    (formData, history, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const res = await axios.post('/api/profile', formData, config);

            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });

            dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

            if (!edit) {
                history.push('/dashboard');
            }
        } catch (error) {
            const errors = error.response.data.errors;

            if (errors) {
                errors.forEach((error) => {
                    dispatch(setAlert(error.msg, 'danger'));
                });
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status },
            });
        }
    };

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Experience Added', 'success'));
        history.push('/dashboard');
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Education Added', 'success'));
        history.push('/dashboard');
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, 'danger'));
            });
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Experience Removed', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};
// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Education Removed', 'success'));
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status },
        });
    }
};

// Delete Account & Profile
export const deleteAccount = () => async (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {
            await axios.delete(`/api/profile`);

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });

            dispatch(setAlert('Your account has been permanently deleted', 'success'));
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status },
            });
        }
    }
};

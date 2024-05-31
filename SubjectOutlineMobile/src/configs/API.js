import axios from "axios";
import getENV from "./Config";

const { BASE_URL } = getENV();

export const endpoints = {
    'faculties': '/faculties/',
    'majors': '/majors/',
    'subject-outlines': '/subject-outlines/',
    'credit-hours': '/credit-hours/',
    'outline-details': (outlineId) => `/subject-outlines/${outlineId}/`,
    'courses': '/courses/',
    'years': '/school-years/',
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'user-requests': '/temp/user-requests/',
    'users': '/users/',
    'user': (userId) => `/users/${userId}/`,
    'comments': (outlineId) => `/subject-outlines/${outlineId}/comments/`,
    'add-comment': (outlineId) => `/subject-outlines/${outlineId}/comment/`,
    'like': (outlineId) => `/subject-outlines/${outlineId}/like/`,
    'instructor': (userId) => `/instructors/${userId}/`,
    'user-check': '/user-check/',
    'requirement': (requirementId) => `/requirements/${requirementId}/`,
    'evaluations': '/evaluations/',
    'evaluation': (evaluationId) => `/evaluations/${evaluationId}/`,
    'learning-outcomes': '/learning-outcomes/',
};

export const authApi = (accessToken) => axios.create({
    baseURL: BASE_URL,
    headers: {
        "Authorization": `bearer ${accessToken}`
    }
});

export default axios.create({
    baseURL: BASE_URL
});
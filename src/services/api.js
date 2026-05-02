import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getCourses = () => api.get('/courses');
export const getYears = (course) => api.get(`/years?course=${course}`);
export const getSemesters = (course, year) => api.get(`/semesters?course=${course}&year=${year}`);
export const getSubjects = (course, year, semester) => api.get(`/subjects?course=${course}&year=${year}&semester=${semester}`);
export const getSubject = (id) => api.get(`/subjects/${id}`);
export const getQuestions = (subjectId) => api.get(`/questions?subjectId=${subjectId}`);

export const addSubject = (subjectData) => api.post('/subjects', subjectData);
export const addQuestion = (formData) => api.post('/questions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const getStudyMaterial = (subjectId) => api.get(`/study-material?subjectId=${subjectId}`);
export const addStudyMaterial = (formData) => api.post('/study-material', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const adminApi = {
    getStats: () => api.get('/admin/stats', { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    getUsers: () => api.get('/admin/users', { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    getFeedback: () => api.get('/admin/feedback', { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    deleteResource: (type, id) => api.delete(`/admin/${type}/${id}`, { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    toggleUserStatus: (userId, isActive) => api.patch(`/admin/users/${userId}/status`, { isActive }, { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    addSubject: (data) => api.post('/admin/subjects/add', data, { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    addUser: (data) => api.post('/admin/users/add', data, { headers: { 'x-admin-email': 'vrat1087@gmail.com' } }),
    uploadQuestion: (subjectId, formData) => api.post(`/admin/questions/upload/${subjectId}`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'x-admin-email': 'vrat1087@gmail.com'
        }
    }),
};

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

export const addBookmark = (questionId) => api.post('/bookmark', { questionId });
export const getBookmarks = () => api.get('/bookmark');

export default api;

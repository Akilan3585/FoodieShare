import axios from 'axios';

const API_URL = 'https://foodieshare.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.patch('/users/profile', userData),
};

export const recipes = {
    getAll: (params) => api.get('/recipes', { params }),
    getById: (id) => api.get(`/recipes/${id}`),
    create: (recipeData) => api.post('/recipes', recipeData),
    update: (id, recipeData) => api.patch(`/recipes/${id}`, recipeData),
    delete: (id) => api.delete(`/recipes/${id}`),
    toggleLike: (id) => api.post(`/recipes/${id}/like`),
    addComment: (id, comment) => api.post(`/recipes/${id}/comments`, { text: comment }),
};

export default api;

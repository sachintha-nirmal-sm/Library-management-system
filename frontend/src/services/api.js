import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a function to get the user's role from localStorage
export const getUserRole = () => localStorage.getItem('role');

// Ensure token is stored in localStorage after login
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Token being sent in request:', token); // Debug log
    if (!token) {
        console.warn('No token found in localStorage');
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// User API calls
export const userAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/me', userData),
    getAllUsers: () => api.get('/users/all'),
    updateUser: (userId, userData) => api.put(`/users/${userId}`, userData).then(response => response).catch(error => {
        console.error("Error in updateUser API call:", error);
        throw error;
    }),
    deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// Book API calls
export const bookAPI = {
    getAllBooks: () => api.get('/books'),
    getBookById: (id) => api.get(`/books/${id}`),
    searchBooks: (query) => api.get(`/books/search?query=${query}`),
    createBook: (bookData) => api.post('/books', bookData),
    updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/books/${id}`),
};

// Borrowing API calls
export const borrowingAPI = {
    borrowBook: (bookId) => api.post('/borrowings', { bookId }),
    returnBook: (borrowingId) => api.put(`/borrowings/${borrowingId}`, { status: 'returned' }),
    getUserBorrowings: () => api.get('/borrowings/user'),
    getAllBorrowings: () => api.get('/borrowings'),
};

export default api;
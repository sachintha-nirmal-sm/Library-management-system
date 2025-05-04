import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// User API calls
export const userAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.patch('/users/profile', userData),
    getAllUsers: () => api.get('/users'),
    updateUser: (userId, userData) => api.patch(`/users/${userId}`, userData),
    deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// Book API calls
export const bookAPI = {
    getAllBooks: () => api.get('/books'),
    getBookById: (id) => api.get(`/books/${id}`),
    searchBooks: (query) => api.get(`/books/search?query=${query}`),
    createBook: (bookData) => api.post('/books', bookData),
    updateBook: (id, bookData) => api.patch(`/books/${id}`, bookData),
    deleteBook: (id) => api.delete(`/books/${id}`),
};

// Borrowing API calls
export const borrowingAPI = {
    borrowBook: (bookId) => api.post('/borrowings/borrow', { bookId }),
    returnBook: (borrowingId) => api.post(`/borrowings/return/${borrowingId}`),
    getUserBorrowings: () => api.get('/borrowings/my-borrowings'),
    getAllBorrowings: () => api.get('/borrowings/all'),
};

export default api; 
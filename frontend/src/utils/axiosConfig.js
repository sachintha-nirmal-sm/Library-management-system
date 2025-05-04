import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Backend server base URL
});

export default axiosInstance;
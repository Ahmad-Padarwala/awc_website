// axiosInstance.js
import axios from 'axios';
import { Api_keys } from '../key';

const API_KEY = Api_keys

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // Set your base URL
  headers: {
    'x-api-key': API_KEY,  // Include the API key in headers
  },
});

export default axiosInstance;

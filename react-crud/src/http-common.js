/**
 * http-common.js
 * 
 * This file sets up a pre-configured Axios instance for making HTTP requests
 * to the backend API. It defines the base URL and default headers for all requests.
 */

import axios from 'axios';


const instance = axios.create({
  // Use environment variable with fallback for development
  baseURL: process.env.REACT_APP_PROD_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-type": "application/json"
  },
  // Add withCredentials if you're handling cookies/sessions
  withCredentials: true
});

export default instance;
/**
 * http-common.js
 * 
 * This file sets up a pre-configured Axios instance for making HTTP requests
 * to the backend API. It defines the base URL and default headers for all requests.
 */

import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-type": "application/json"
  }
});

export default instance;
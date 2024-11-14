// auth.service.js
import axios from "axios";
import config from "../config";

const API_URL = config.API_URL//"http://localhost:3000/api/auth/";
const FAILED_ATTEMPTS_LIMIT = 5;

class AuthService {
  constructor() {
    this.failedAttempts = 0;
    this.lastAttemptTime = null;
  }

  async login(email, password) {
    // Check if user has exceeded failed attempts
    const currentTime = new Date().getTime();
    if (this.failedAttempts >= FAILED_ATTEMPTS_LIMIT) {
      const timeSinceLastAttempt = currentTime - this.lastAttemptTime;
      const waitTime = Math.pow(2, this.failedAttempts - FAILED_ATTEMPTS_LIMIT) * 1000; // Progressive delay

      if (timeSinceLastAttempt < waitTime) {
        const remainingTime = Math.ceil((waitTime - timeSinceLastAttempt) / 1000);
        throw new Error(`Please wait ${remainingTime} seconds before trying again.`);
      }
    }

    try {
      const response = await axios.post(API_URL + "signin", { email, password });

      // Check for access token and save user to localStorage
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
        // Reset failed attempts after successful login
        this.failedAttempts = 0;
        return response.data;
      } else {
        throw new Error('Invalid credentials.');
      }
    } catch (error) {
      // Increment failed attempts and store time of last attempt
      this.failedAttempts++;
      this.lastAttemptTime = new Date().getTime();

      console.error('Login error:', error.message || error);
      throw new Error('An error occurred during login. Please try again.');
    }
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(username, email, password) {
    const response=await axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
    if (response!=null){
      AuthService.login(email, password);
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserDataService from '../services/UserDataService';

const UserPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setCurrentUser(foundUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        navigate('/login');
    };

    const handleLogin = async (userData) => {
        try {
            const response = await UserDataService.login(userData);
            const user = response.data;
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleSignup = async (userData) => {
        try {
            const response = await UserDataService.createUser(userData);
            const newUser = response.data;
            setCurrentUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            navigate('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <div>
            <h1>User Page</h1>
            {currentUser ? (
                <div>
                    <p>Welcome, {currentUser.username}!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <nav>
                    <ul>
                        <li><Link to="/login" state={{ handleLogin }}>Login</Link></li>
                        <li><Link to="/signup" state={{ handleSignup }}>Sign Up</Link></li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default UserPage;
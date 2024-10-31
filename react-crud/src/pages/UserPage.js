import React, { useState } from 'react';
import UserDataService from '../services/UserDataService';

const UserPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // Implement login logic here
        setMessage('Login functionality not implemented yet');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = { username, email, password };
            await UserDataService.createUser(userData);
            setMessage('User created successfully');
            // Clear form fields
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setMessage('Error creating user: ' + error.message);
        }
    };

    return (
        <div>
        <h2>User Page</h2>
        <form onSubmit={handleLogin}>
            <h3>Login</h3>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
        <form onSubmit={handleSignup}>
            <h3>Sign Up</h3>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default UserPage;
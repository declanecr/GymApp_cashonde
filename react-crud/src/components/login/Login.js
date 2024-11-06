import React, { useState } from 'react';
import UserDataService from '../../services/UserDataService';

const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('username: ', loginUsername);
        console.log('password: ', loginPassword);
        try {
            const response = await UserDataService.getAllUsers();
            if (response){
                console.log('got users: ', response.data);
            }
            const users = response.data;
            
            const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
            console.log('logging in user: ', user);
            if (user) {
                setMessage('Login successful');
                // Add further logic here (e.g., setting user state, redirecting)
            } else {
                setMessage('Invalid username or password');
            }
        } catch (error) {
            setMessage('Error during login: ' + error.message);
        }
    };

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
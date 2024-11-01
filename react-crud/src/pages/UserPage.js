import React, { useState } from 'react';
import UserDataService from '../services/UserDataService';

const UserPage = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [message, setMessage]=useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // Implement login logic here
        setMessage('Login functionality not implemented yet');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = { username: signupUsername, email: signupEmail, password: signupPassword };            
            await UserDataService.createUser(userData);
            setMessage('User created successfully');
            // Clear form fields
            setSignupUsername('');
            setSignupEmail('');
            setSignupPassword('');
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
        <form onSubmit={handleSignup}>
            <h3>Sign Up</h3>
            <input
            type="text"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            />
            <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
        </div>
    );
};

export default UserPage;
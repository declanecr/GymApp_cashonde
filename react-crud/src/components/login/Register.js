import React, { useState } from 'react';
import UserDataService from '../../services/UserDataService';

const Register = () => {
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [message, setMessage] = useState('');

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
        <h2>Register</h2>
        <form onSubmit={handleSignup}>
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

export default Register;
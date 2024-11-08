import React from 'react';
import { Link } from 'react-router-dom';

const LoginSignupPage = () => {
    return (
        <div>
            <h1>Login or Sign Up</h1>
            <nav>
                <ul>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                </ul>
            </nav>
            {/* Add login and signup forms here */}
        </div>
    );
};

export default LoginSignupPage;
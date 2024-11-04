import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserPage = ({setCurrentUser}) => {
    const navigate = useNavigate();
    const [currentUser, setLocalCurrentUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setCurrentUser(foundUser);
            setLocalCurrentUser(foundUser);
        }
    }, [setCurrentUser]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        setLocalCurrentUser(null);
        navigate('/login');
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
                        <li><Link to="/login" >Login</Link></li>
                        <li><Link to="/signup" >Sign Up</Link></li>
                    </ul>
                </nav>
            )}
        </div>
    );
};


UserPage.propTypes ={
    setCurrentUser: PropTypes.func.isRequired
};

export default UserPage;
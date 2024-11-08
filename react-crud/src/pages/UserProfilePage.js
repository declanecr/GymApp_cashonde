import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const UserProfilePage = (/*{ currentUser, handleLogout }*/) => {
    const {currentUser, logout} = useAuth();
    const { user_id } = useParams();

    if (!currentUser) {
        return <div>Loading...</div>; // Or some other placeholder
    }
    return (
        <div>
            <h1>User Profile</h1>
            <p>Welcome, {currentUser.username}!</p>
            <p>User ID: {user_id}</p>
            <button onClick={logout}>Logout</button>
            {/* Add more user profile information here */}
        </div>
    );
};




export default UserProfilePage;
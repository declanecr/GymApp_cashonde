import PropTypes from 'prop-types';
import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfilePage = ({ currentUser, handleLogout }) => {
    const { user_id } = useParams();

    if (!currentUser) {
        return <div>Loading...</div>; // Or some other placeholder
    }
    return (
        <div>
            <h1>User Profile</h1>
            <p>Welcome, {currentUser.username}!</p>
            <p>User ID: {user_id}</p>
            <button onClick={handleLogout}>Logout</button>
            {/* Add more user profile information here */}
        </div>
    );
};



UserProfilePage.propTypes ={
    currentUser: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default UserProfilePage;
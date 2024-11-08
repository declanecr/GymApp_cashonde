import React, { useEffect, useState } from 'react';

const UserPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulating fetching user data from an API
    const fetchUser = async () => {
      // In a real application, you would fetch this data from your backend
      const mockUser = {
        username: 'exampleUser',
        email: 'user@example.com',
        password: '********', // Note: Displaying passwords is not recommended
        created_at: new Date().toISOString()
      };

      setUser(new User(mockUser));
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-page">
      <h1>User Profile</h1>
      <div className="user-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

// User constructor
function User(user) {
  this.username = user.username;
  this.email = user.email;
  this.password = user.password;
  this.created_at = new Date(user.created_at);
}

export default UserPage;

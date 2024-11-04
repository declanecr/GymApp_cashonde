// PrivateRoute.js
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, checkAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthState();
      setIsLoading(false);
    };
    verifyAuth();
  }, []); // Empty dependency array

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  console.log('PrivateRoute - Current user:', user);
  return user ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes ={
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
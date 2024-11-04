import PropTypes from "prop-types";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkAuthState = async () => {
    // Implement your logic to check authentication state
    // For example, check local storage or make an API call
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
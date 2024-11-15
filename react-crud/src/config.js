const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : 'http://localhost:3000/api/'
};

export default config;

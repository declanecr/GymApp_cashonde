const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://node-express-react-mysql-test-ca3b344e37df.herokuapp.com/api'
    : 'http://localhost:3000/api'
};

export default config;

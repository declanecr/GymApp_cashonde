import http from "../http-common";

const UserDataService = {
    /**
     * Creates a new user
     * @param {Object} userData - User data to be sent to the server
     * @returns {Promise} - Promise resolving to the created user object
     */
    createUser: (userData) => {
        return http.post(`/users`, userData);
    },

    /**
     * Logs in a user
     * @param {Object} userData - User credentials (email and password)
     * @returns {Promise} - Promise resolving to the logged-in user object
     */
    login: (userData) => {
        return http.post("/users/login", userData);
    },

    /**
     * Retrieves all users
     * @returns {Promise} - Promise resolving to an array of user objects
     */
    getAllUsers: () => {
        return http.get(`/users`);
    },

    /**
     * Retrieves a single user by ID
     * @param {number} id - The ID of the user to fetch
     * @returns {Promise} - Promise resolving to the user object
     */
    getUser: (id) => {
        return http.get(`/users/${id}`);
    },

    /**
     * Updates an existing user
     * @param {number} id - The ID of the user to update
     * @param {Object} userData - Updated user data
     * @returns {Promise} - Promise resolving to the updated user object
     */
    updateUser: (id, userData) => {
        return http.put(`/users/${id}`, userData);
    },

    /**
     * Deletes a user
     * @param {number} id - The ID of the user to delete
     * @returns {Promise} - Promise resolving to the server response
     */
    deleteUser: (id) => {
        return http.delete(`/users/${id}`);
    }
};

export default UserDataService;
import sql from "./db.js";

/**
 * Constructor for the User object
 * @param {Object} user - The user object containing all properties
 * @purpose Create a new User instance with given properties
 * @input Object with user properties
 * @output New User instance
 */
const User = function(user) {
  this.name = user.user_name;
  this.id = user.user_id
};

/**
 * Create a new user in the database
 * @param {Object} newUser - The user object to be created
 * @param {Function} result - Callback function
 * @purpose Insert a new user into the database
 * @input New user object and callback function
 * @output Created user object with ID or error
 * @sends SQL query to insert new user
 */
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

/**
 * Find a user by their ID
 * @param {number} id - The ID of the user to find
 * @param {Function} result - Callback function
 * @purpose Retrieve a specific user from the database by their ID
 * @input User ID and callback function
 * @output Found user object or error
 * @sends SQL query to select user by ID
 */
User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
    } else {
      result({ kind: "not_found" }, null);
    }
  });
};

/**
 * Get all users or users matching a name
 * @param {string} name - Optional name to filter users
 * @param {Function} result - Callback function
 * @purpose Retrieve all users or users matching a name from the database
 * @input Optional name parameter and callback function
 * @output Array of user objects or error
 * @sends SQL query to select all users or users matching a name
 */
User.getAll = (name, result) => {
  let query = "SELECT * FROM users";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    result(null, res);
  });
};

/**
 * Update a user by their ID
 * @param {number} id - The ID of the user to update
 * @param {Object} user - The updated user object
 * @param {Function} result - Callback function
 * @purpose Update an existing user in the database
 * @input User ID, updated user object, and callback function
 * @output Updated user object or error
 * @sends SQL query to update user by ID
 */
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [user.name, user.email, user.password, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

/**
 * Remove a user by their ID
 * @param {number} id - The ID of the user to remove
 * @param {Function} result - Callback function
 * @purpose Delete a specific user from the database
 * @input User ID and callback function
 * @output Success message or error
 * @sends SQL query to delete user by ID
 */
User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

/**
 * Remove all users from the database
 * @param {Function} result - Callback function
 * @purpose Delete all users from the database
 * @input Callback function
 * @output Success message or error
 * @sends SQL query to delete all users
 */
User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

export default User;
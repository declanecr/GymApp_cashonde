import bcrypt from 'bcryptjs';
import sql from "./db.js";

/**
 * Constructor for the User object
 * @param {Object} user - The user object containing all properties
 */
const User = function(user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.created_at = new Date();
};

/**
 * Create a new user in the database
 * @param {Object} newUser - The user object to be created
 * @param {Function} result - Callback function
 */
User.create = (newUser, result) => {
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        newUser.password = hash;
        sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            console.log("created user: ", { id: res.insertId, ...newUser });
            result(null, { id: res.insertId, ...newUser });
        });
    });
};

/**
 * Login a user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {Function} result - Callback function
 */
User.login = (email, password, result) => {
    sql.query(`SELECT * FROM users WHERE email = ?`, [email], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log('res: ', res);
            const user = res[0];
            console.log('password: ', password, '\npassword type: ', typeof(password));
            console.log('user.password: ', user.password, '\nuser.password type: ', typeof(user.password));
            
            bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
                console.log('isMatch: ', isMatch);
                
                if (bcryptErr) {
                    console.log("error: ", bcryptErr);
                    result(bcryptErr, null);
                    return;
                }
                if (isMatch) {
                    console.log("logged in user: ", { id: user.id, ...user });
                    result(null, { id: user.id, ...user });
                } else {
                    result({ kind: "invalid_password" }, null);
                }
            });
        } else {
            result({ kind: "not_found" }, null);
        }
    });
};

/**
 * Find a user by their ID
 * @param {number} id - The ID of the user to find
 * @param {Function} result - Callback function
 */
User.findById = (id, result) => {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
        }

        if (res.length) {
        console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
        }

        result({ kind: "not_found" }, null);
    });
};

/**
 * Get all users or users matching a username
 * @param {string} username - Optional username to filter users
 * @param {Function} result - Callback function
 */
User.getAll = (result) => {
    let query = "SELECT * FROM users";

    sql.query(query, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
        }

        console.log("users: ", res);
        result(null, res);
    });
};

/**
 * Update a user by their ID
 * @param {number} id - The ID of the user to update
 * @param {Object} user - The updated user object
 * @param {Function} result - Callback function
 */
User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [user.username, user.email, user.password, id],
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


/**
 * Sign up a new user, checking for existing email or username
 * @param {Object} newUser - The new user object to be created
 * @param {Function} result - Callback function
 */
User.signUp = (newUser, result) => {
    sql.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [newUser.email, newUser.username],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length > 0) {
                let message = "";
                if (res[0].email === newUser.email) {
                    message = "Email already in use";
                } else {
                    message = "Username already taken";
                }
                result({ kind: "duplicate", message: message }, null);
                return;
            }
            

            console.log('can signUP now: ', newUser.username);
            result(null, res);
            // If no existing user found, create new user
            
        }
    );
};

/**
 * Find a user by their email
 * @param {string} email - The email of the user to find
 * @param {Function} result - Callback function
 */
User.findOne = (email, result) => {
    console.log('findOne email: ', email);
    sql.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
        console.log('query res: ',res);
        console.log('query err: ',err);
        

        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        result({ kind: "not_found" }, null);
    });
};
export default User;
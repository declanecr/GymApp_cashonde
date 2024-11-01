import User from "../models/users.model.js";

// Create and Save a new User
export const create = (req, res) => {
    console.log('users.controller create');
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    // Create a User
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    // Save User in the database
    User.create(user, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
        else res.send(data);
    });
};

// Login a User
export const login = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.login(req.body.email, req.body.password, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User not found with email ${req.body.email}.`
                });
            } else if (err.kind === "invalid_password") {
                res.status(401).send({
                    message: "Invalid password!"
                });
            } else {
                res.status(500).send({
                    message: "Error logging in user"
                });
            }
        } else res.send(data);
    });
};

// Retrieve all Users from the database (with condition)
export const findAll = (req, res) => {

    User.getAll((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving users."
        });
        else res.send(data);
    });
};

// Find a single User with a userId
export const findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
        if (err) {
        if (err.kind === "not_found") {
            res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
            });
        } else {
            res.status(500).send({
            message: "Error retrieving User with id " + req.params.userId
            });
        }
        } else res.send(data);
    });
};

// Update a User identified by the userId in the request
export const update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    User.updateById(
        req.params.userId,
        new User(req.body),
        (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found User with id ${req.params.userId}.`
            });
            } else {
            res.status(500).send({
                message: "Error updating User with id " + req.params.userId
            });
            }
        } else res.send(data);
        }
    );
};

// Delete a User with the specified userId in the request
export const remove = (req, res) => {
    User.remove(req.params.userId, (err, data) => {
        if (err) {
        if (err.kind === "not_found") {
            res.status(404).send({
            message: `Not found User with id ${req.params.userId}.`
            });
        } else {
            res.status(500).send({
            message: "Could not delete User with id " + req.params.userId
            });
        }
        } else res.send({ message: `User was deleted successfully!` });
    });
};

// Delete all Users from the database
export const removeAll = (req, res) => {
    User.removeAll((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while removing all users."
        });
        else res.send({ message: `All Users were deleted successfully!` });
    });
};
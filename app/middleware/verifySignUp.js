import User from "../models/users.model.js";

const verifySignUp = (req, res, next) => {
    console.log('req: ', req.body);

    User.signUp(req.body, (err, data) => {
        if (err) {
            if (err.kind === "duplicate") {
                return res.status(400).send({ message: err.message });
            }
            return res.status(500).send({ message: "An error occurred while signing up." });
        }
        
        // If the signup is successful, you can proceed with the next middleware or send a success response
        console.log('User signed up successfully:', data);
        res.status(201).send(data); // Send the created user data as a response
    });
};

export default verifySignUp;

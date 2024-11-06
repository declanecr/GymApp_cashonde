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
        
        console.log('User signed up successfully:', data);
        next(); // Call next() here after successful signup
    });
};

export default verifySignUp;

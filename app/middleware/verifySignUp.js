import User from "../models/users.model.js";

const verifySignUp = (req,res,next) => {
    User.signUp(res);
    return;
}
export default ( verifySignUp );


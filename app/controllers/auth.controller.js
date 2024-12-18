import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from "../config/auth.config.js";
import User from "../models/users.model.js";

const signup = (req, res) => {
  const cryptPass = bcrypt.hashSync(req.body.password, 8);
  console.log('crptPass: ', cryptPass);
  
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: cryptPass
  }, (err, user) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    var token =jwt.sign({id: user.id }, authConfig.secret,{
      expiresIn:14400 //4 hours
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      message: "User was registered successfully!"
    })
  });
};

const signin = (req, res) => {
  console.log('email: ', req.body.email);
  const email = req.body.email;
  User.findOne(email, (err, user) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    var token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 14400 // 4 hours
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  });
};

export default {
  signup,
  signin
};
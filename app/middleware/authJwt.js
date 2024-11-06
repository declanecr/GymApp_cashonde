import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import sql from '../models/db.js';

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  sql.query(`SELECT role FROM users WHERE id = ?`, [req.userId], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    if (result.length > 0 && result[0].role === 'admin') {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  });
};

const isModerator = (req, res, next) => {
  sql.query(`SELECT role FROM users WHERE id = ?`, [req.userId], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    if (result.length > 0 && result[0].role === 'moderator') {
      next();
      return;
    }

    res.status(403).send({ message: "Require Moderator Role!" });
  });
};

export { isAdmin, isModerator, verifyToken };


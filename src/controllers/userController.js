const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createUser = (req, res) => {
  const { name, username, password, email } = req.body;

  if (!name || !password || !username || !email) {
    return res.status(400).json({ error: "Please Provide required fields" });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;

      const newUser = {
        name,
        username,
        password: hash,
        email,
      };

      User.create(newUser, (err, userId) => {
        if (err) res.status(500).send(err);
        else res.status(201).send({ id: userId });
      });
    });
  });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Please Provide username and password" });
  }

  User.getByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "internal server error" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // validate password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        // passwords are match
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token });
      } else {
        // passwords wrong
        res.status(401).json({ error: "Invalid Credentials" });
      }
    });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.delete(userId, (err, result) => {
    if (err) {
      res.status(500).send({ error: "Error deleting user" });
    } else if (result.affectedRows === 0) {
      res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send({ message: "User deleted successfully" });
    }
  });
};

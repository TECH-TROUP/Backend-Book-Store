const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createUser = (req, res) => {
  const { name, username, password, email } = req.body;

  if (!name || (password && password.length < 6) || !username || !email) {
    return res.status(400).json({ error: "Please Provide required fields" });
  }

  User.existsByUsername(username, (err, usernameExists) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (usernameExists) {
      return res.status(400).json({ error: "Username already taken" });
    }

    User.existsByEmail(email, (err, emailExists) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
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

  // Check if the authenticated user is the same as the user being deleted or if the user is an admin
  if (req.user.id !== parseInt(userId) && req.user.role_id !== 1) {
    return res.status(403).json({
      error:
        "Access denied: You can only delete your own account or you must be an admin",
    });
  }

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

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, username, password } = req.body;

  // Check if the authenticated user is the same as the user being updated or if the user is an admin
  if (req.user.id !== parseInt(userId) && req.user.role_id !== 1) {
    return res.status(403).json({
      error:
        "Access denied: You can only update your own account or you must be an admin",
    });
  }

  if (!name && !username && !password) {
    return res.status(400).json({ error: "Please provide valid fields" });
  }

  const updatedUser = {};

  if (name) {
    updatedUser.name = name;
  }

  const checkUsername = () => {
    if (username) {
      // Check if the new username is different from the existing username
      if (username !== req.user.username) {
        User.existsByUsername(username, (err, usernameExists) => {
          if (err) {
            return res.status(500).json({ error: "Internal server error" });
          }

          if (usernameExists) {
            return res.status(400).json({ error: "Username already taken" });
          }

          // Proceed with the username update
          updatedUser.username = username;
          updateUserInDB();
        });
      } else {
        // The new username is the same as the existing username
        updatedUser.username = username;
        updateUserInDB();
      }
    } else {
      // No new username provided, proceed to update
      updateUserInDB();
    }
  };

  const updateUserInDB = () => {
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;

          updatedUser.password = hash;

          User.update(userId, updatedUser, (err, result) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                return res
                  .status(400)
                  .json({ error: "Username already taken" });
              }
              res.status(500).json({ error: "Error updating user" });
            } else if (result.affectedRows === 0) {
              res.status(404).json({ error: "User not found" });
            } else {
              // Generate a new token with updated information
              const token = jwt.sign(
                {
                  id: parseInt(userId),
                  username: updatedUser.username || req.user.username,
                  email: req.user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
              );

              res.status(200).json({
                message: "User updated successfully",
                token: token,
              });
            }
          });
        });
      });
    } else {
      User.update(userId, updatedUser, (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Username already taken" });
          }
          res.status(500).json({ error: "Error updating user" });
        } else if (result.affectedRows === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          // Generate a new token with updated information
          const token = jwt.sign(
            {
              id: parseInt(userId),
              username: updatedUser.username || req.user.username,
              email: req.user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.status(200).json({
            message: "User updated successfully",
            token: token,
          });
        }
      });
    }
  };

  checkUsername();
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  // Check if the authenticated user is the same as the user being fetched or if the user is an admin
  if (req.user.id !== parseInt(userId) && req.user.role_id !== 1) {
    return res.status(403).json({
      error:
        "Access denied: You can only access your own account details or you must be an admin",
    });
  }

  User.getById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ error: "Error fetching user details" });
    } else if (!user) {
      res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send(user);
    }
  });
};

exports.getLoggedInUser = (req, res) => {
  const userId = req.user.id;

  User.getById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ error: "Error fetching user details" });
    } else if (!user) {
      res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send(user);
    }
  });
};

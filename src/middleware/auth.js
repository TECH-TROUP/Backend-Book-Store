const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header malformed" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch user from database to get the role
    User.getById(req.user.id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the username in the token matches the username in the database
      if (req.user.username !== user.username) {
        return res
          .status(401)
          .json({ error: "Token is outdated, please log in again" });
      }

      req.user.role_id = user.role_id;
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;

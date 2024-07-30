const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

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

      req.user.role_id = user.role_id; 
      next();
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = auth;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// User routes
router.post("/users/register", userController.createUser);
router.post("/users/login", userController.loginUser);
router.delete("/users/:id", auth, userController.deleteUser);
router.put("/users/:id", auth, userController.updateUser);
router.get("/users/me", auth, userController.getLoggedInUser);
router.get("/users/:id", auth, userController.getUserById);

module.exports = router;

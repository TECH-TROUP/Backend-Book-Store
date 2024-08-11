const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// User routes
router.post("/users/register", userController.createUser);
router.post("/users/login", userController.loginUser);
router.delete("/users/:id", auth, userController.deleteUser);

router.put(
  "/users/update-role",
  auth,
  checkAdmin,
  userController.updateUserRole
);

router.put("/users/update-address", auth, userController.updateUserAddress);

router.put("/users/:id", auth, userController.updateUser);
router.get("/users/me", auth, userController.getLoggedInUser);
router.get("/users/:id", auth, userController.getUserById);

router.get(
  "/users/roles/:roleId",
  auth,
  checkAdmin,
  userController.getUsersByRoleId
);

module.exports = router;

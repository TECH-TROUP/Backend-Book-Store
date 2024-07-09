const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/users/register", userController.createUser);
router.post("/users/login", userController.loginUser);
router.delete("/users/:id", auth, userController.deleteUser);

module.exports = router;

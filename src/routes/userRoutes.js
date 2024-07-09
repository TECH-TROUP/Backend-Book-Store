const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/users/register", userController.createUser);
router.post("/users/login", userController.loginUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;

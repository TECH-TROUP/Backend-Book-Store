const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Route to get dashboard stats
router.get(
  "/admin/dashboard",
  auth,
  checkAdmin,
  adminController.getDashboardStats
);

module.exports = router;

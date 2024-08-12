const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkVendor = require("../middleware/checkVendor");
const vendorController = require("../controllers/vendorControlller");

// Route to get dashboard stats for a specific vendor
router.get(
  "/vendor/dashboard",
  auth,
  checkVendor,
  vendorController.getDashboardStats
);

module.exports = router;

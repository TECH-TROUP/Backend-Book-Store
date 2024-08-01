const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Payment routes
router.post("/payments", auth, checkAdmin, paymentController.createPayment);
router.put("/payments/:id", auth, checkAdmin, paymentController.updatePayment);
router.delete(
  "/payments/:id",
  auth,
  checkAdmin,
  paymentController.deletePayment
);
router.get("/payments", auth, checkAdmin, paymentController.getAllPayments);
router.get("/payments/:id", auth, checkAdmin, paymentController.getPaymentById);
router.get(
  "/payments/by-user/:userId",
  auth,
  checkAdmin,
  paymentController.getPaymentsByUserId
);

module.exports = router;

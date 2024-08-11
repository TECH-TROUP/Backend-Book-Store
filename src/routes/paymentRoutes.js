const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const stripe = require("stripe")(
  "sk_test_51PmYrAKogtyoyt8RTv5G3aQ7AFbIEfu4eusbudh1DX4LmtZMILGdDWqbAh2sCU8sdhdJYQhRnZzWTDYjzQRX2NBF00t806kr1k"
);

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

router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "sgd",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

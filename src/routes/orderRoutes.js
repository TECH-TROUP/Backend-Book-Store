const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Order routes
router.post("/orders", auth, orderController.createOrder);
router.put("/orders/:id", auth, orderController.updateOrder);
router.delete("/orders/:id", auth, checkAdmin, orderController.deleteOrder);
router.get("/orders", auth, checkAdmin, orderController.getAllOrders);
router.get("/orders/:id", auth, orderController.getOrderById);
router.get("/user-orders/:user_id", auth, orderController.getOrdersByUserId);

module.exports = router;

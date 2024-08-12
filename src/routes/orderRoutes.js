const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Order routes
// Create a new order - user must be authenticated
router.post("/orders", auth, orderController.createOrder);

// Update an order - user must be authenticated
router.put("/orders/:id", auth, orderController.updateOrder);

// Delete an order - admin only
router.delete("/orders/:id", auth, checkAdmin, orderController.deleteOrder);

// Get all orders - admin only (or consider other options depending on requirements)
// If you want users to access their orders, you might need a separate route.
router.get("/orders", auth, checkAdmin, orderController.getAllOrders);

// Get a specific order by ID - user must be authenticated
router.get("/orders/:id", auth, orderController.getOrderById);

// Get orders by user ID - user must be authenticated
router.post("/user-orders", auth, orderController.getOrdersByUserId);

module.exports = router;

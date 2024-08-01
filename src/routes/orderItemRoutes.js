const express = require("express");
const router = express.Router();
const orderItemController = require("../controllers/orderItemController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Order Item routes
router.post("/order-items", auth, orderItemController.createOrderItem);
router.put("/order-items/:id", auth, orderItemController.updateOrderItem);
router.delete("/order-items/:id", auth, orderItemController.deleteOrderItem);
router.get("/order-items", auth, orderItemController.getAllOrderItems);
router.get("/order-items/:id", auth, orderItemController.getOrderItemById);
router.get(
  "/order-items/by-order/:orderId",
  auth,
  orderItemController.getOrderItemsByOrderId
);

module.exports = router;

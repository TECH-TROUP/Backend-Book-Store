const Order = require("../models/Order");

// Create a new order
exports.createOrder = (req, res) => {
  const userId = req.user.id;
  const { totalPrice, payment_id, status } = req.body;

  // Validate the required fields
  if (!totalPrice || !payment_id || !status) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  // Create a new order object
  const newOrder = {
    user_id: userId,
    totalPrice,
    payment_id,
    status,
  };

  // Call the create method from the Order model
  Order.create(newOrder, (err, orderId) => {
    if (err) {
      res.status(500).json({ error: "Failed to create order", details: err });
    } else {
      res.status(201).json({ id: orderId });
    }
  });
};

// Update an order
exports.updateOrder = (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  const { order_date, totalPrice, payment_id, status } = req.body;

  // Create an updated order object
  const updatedOrder = {
    user_id: userId,
    order_date, // Make sure this is a valid date format
    totalPrice,
    payment_id,
    status,
  };

  // Call the update method from the Order model
  Order.update(orderId, updatedOrder, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to update order", details: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json({ message: "Order updated successfully" });
    }
  });
};

// Delete an order
exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;

  // Call the delete method from the Order model
  Order.delete(orderId, (err, result) => {
    if (err) {
      res.status(500).json({ error: "Failed to delete order", details: err });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json({ message: "Order deleted successfully" });
    }
  });
};

// Get all orders
exports.getAllOrders = (req, res) => {
  // Call the getAll method from the Order model
  Order.getAll((err, orders) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve orders", details: err });
    } else {
      res.status(200).json(orders);
    }
  });
};

// Get a specific order by ID
exports.getOrderById = (req, res) => {
  const orderId = req.params.id;

  // Call the getById method from the Order model
  Order.getById(orderId, (err, order) => {
    if (err) {
      res.status(500).json({ error: "Failed to retrieve order", details: err });
    } else if (!order.length) {
      // Adjusted to check if the order array is empty
      res.status(404).json({ error: "Order not found" });
    } else {
      res.status(200).json(order[0]); // Return the first item in the array
    }
  });
};

// Get orders by user ID
exports.getOrdersByUserId = (req, res) => {
  const userId = req.params.user_id;

  // Call the getByUserId method from the Order model
  Order.getByUserId(userId, (err, orders) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Failed to retrieve orders", details: err });
    } else if (orders.length === 0) {
      res.status(404).json({ error: "No orders found for this user" });
    } else {
      res.status(200).json(orders);
    }
  });
};

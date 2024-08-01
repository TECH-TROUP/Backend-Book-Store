const Order = require("../models/Order");
// Create a new order
exports.createOrder = (req, res) => {
  const { user_id, order_date, total_price, payment_id, status } = req.body;

  if (!user_id || !order_date || !total_price || !payment_id || !status) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  const newOrder = {
    user_id,
    order_date,
    total_price,
    payment_id,
    status,
  };

  Order.create(newOrder, (err, orderId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: orderId });
  });
};

// Update an order
exports.updateOrder = (req, res) => {
  const orderId = req.params.id;
  const { user_id, order_date, total_price, payment_id, status } = req.body;

  const updatedOrder = {
    user_id,
    order_date,
    total_price,
    payment_id,
    status,
  };

  Order.update(orderId, updatedOrder, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Order not found" });
    } else {
      res.status(200).send({ message: "Order updated successfully" });
    }
  });
};

// Delete an order
exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;

  Order.delete(orderId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Order not found" });
    } else {
      res.status(200).send({ message: "Order deleted successfully" });
    }
  });
};

// Get all orders
exports.getAllOrders = (req, res) => {
  Order.getAll((err, orders) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(orders);
  });
};

// Get a specific order by ID
exports.getOrderById = (req, res) => {
  const orderId = req.params.id;

  Order.getById(orderId, (err, order) => {
    if (err) res.status(500).send(err);
    else if (!order) {
      res.status(404).send({ error: "Order not found" });
    } else {
      res.status(200).send(order);
    }
  });
};

// Get orders by user ID
exports.getOrdersByUserId = (req, res) => {
  const userId = req.params.user_id;

  Order.getByUserId(userId, (err, orders) => {
    if (err) res.status(500).send(err);
    else if (orders.length === 0) {
      res.status(404).send({ error: "No orders found for this user" });
    } else {
      res.status(200).send(orders);
    }
  });
};

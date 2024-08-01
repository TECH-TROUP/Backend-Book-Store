const db = require("../config/db");

const Order = {};

// Add a new order
Order.create = (order, callback) => {
  const query =
    "INSERT INTO orders (user_id, order_date, total_price, payment_id, status) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      order.user_id,
      order.order_date,
      order.total_price,
      order.payment_id,
      order.status,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update an order
Order.update = (orderId, updatedOrder, callback) => {
  const query =
    "UPDATE orders SET user_id = ?, order_date = ?, total_price = ?, payment_id = ?, status = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedOrder.user_id,
      updatedOrder.order_date,
      updatedOrder.total_price,
      updatedOrder.payment_id,
      updatedOrder.status,
      orderId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete an order
Order.delete = (orderId, callback) => {
  const query = "DELETE FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all orders
Order.getAll = (callback) => {
  const query = "SELECT * FROM orders";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific order by ID
Order.getById = (orderId, callback) => {
  const query = "SELECT * FROM orders WHERE id = ?";
  db.query(query, [orderId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row);
  });
};

// Get orders by user ID
Order.getByUserId = (userId, callback) => {
  const query = "SELECT * FROM orders WHERE user_id = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

module.exports = Order;

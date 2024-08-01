const db = require("../config/db");

const OrderItem = {};

// Add a new order item
OrderItem.create = (orderItem, callback) => {
  const query =
    "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [
      orderItem.order_id,
      orderItem.book_id,
      orderItem.quantity,
      orderItem.price,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update an order item
OrderItem.update = (orderItemId, updatedOrderItem, callback) => {
  const query =
    "UPDATE order_items SET order_id = ?, book_id = ?, quantity = ?, price = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedOrderItem.order_id,
      updatedOrderItem.book_id,
      updatedOrderItem.quantity,
      updatedOrderItem.price,
      orderItemId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete an order item
OrderItem.delete = (orderItemId, callback) => {
  const query = "DELETE FROM order_items WHERE id = ?";
  db.query(query, [orderItemId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all order items
OrderItem.getAll = (callback) => {
  const query = "SELECT * FROM order_items";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific order item by ID
OrderItem.getById = (orderItemId, callback) => {
  const query = "SELECT * FROM order_items WHERE id = ?";
  db.query(query, [orderItemId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row[0]);
  });
};

// Get order items by order ID
OrderItem.getByOrderId = (orderId, callback) => {
  const query = "SELECT * FROM order_items WHERE order_id = ?";
  db.query(query, [orderId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

module.exports = OrderItem;

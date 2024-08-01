const db = require("../config/db");

const Payment = {};

// Create a new payment
Payment.create = (payment, callback) => {
  const query =
    "INSERT INTO payments (user_id, payment_method, payment_date, amount) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [
      payment.user_id,
      payment.payment_method,
      payment.payment_date,
      payment.amount,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update a payment
Payment.update = (paymentId, updatedPayment, callback) => {
  const query =
    "UPDATE payments SET user_id = ?, payment_method = ?, payment_date = ?, amount = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedPayment.user_id,
      updatedPayment.payment_method,
      updatedPayment.payment_date,
      updatedPayment.amount,
      paymentId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete a payment
Payment.delete = (paymentId, callback) => {
  const query = "DELETE FROM payments WHERE id = ?";
  db.query(query, [paymentId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all payments
Payment.getAll = (callback) => {
  const query = "SELECT * FROM payments";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific payment by ID
Payment.getById = (paymentId, callback) => {
  const query = "SELECT * FROM payments WHERE id = ?";
  db.query(query, [paymentId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row);
  });
};

// Get payments by user ID
Payment.getByUserId = (userId, callback) => {
  const query = "SELECT * FROM payments WHERE user_id = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

module.exports = Payment;

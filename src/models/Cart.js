// models/Cart.js
const db = require("../config/db");

const Cart = {};

// Add a book to the cart
Cart.add = (userId, bookId, quantity, type, callback) => {
  const query = `
    INSERT INTO cart (user_id, book_id, quantity, type, created_at) 
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(query, [userId, bookId, quantity, type], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res.insertId);
  });
};

// Remove a book from the cart
Cart.remove = (userId, bookId, callback) => {
  const query = "DELETE FROM cart WHERE user_id = ? AND book_id = ?";
  db.query(query, [userId, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res.affectedRows);
  });
};

// Get all items in the cart for a specific user
Cart.getByUserId = (userId, callback) => {
  const query = `
    SELECT cart.*, books.title, books.author, books.price, books.image_url
    FROM cart
    JOIN books ON cart.book_id = books.id
    WHERE cart.user_id = ?
  `;
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Check if a book is already in the cart for a user
Cart.getCartItem = (userId, bookId, callback) => {
  const query = "SELECT * FROM cart WHERE user_id = ? AND book_id = ?";
  db.query(query, [userId, bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0] || null);
  });
};

// Update the quantity of a cart item
Cart.updateQuantity = (userId, bookId, quantity, callback) => {
  const query = `
    UPDATE cart
    SET quantity = ?
    WHERE user_id = ? AND book_id = ?
  `;
  db.query(query, [quantity, userId, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res.affectedRows);
  });
};

Cart.getUserCart = (userId, callback) => {
  const query = "SELECT book_id FROM cart WHERE user_id = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else
      callback(
        null,
        rows.map((row) => row.book_id)
      );
  });
};

module.exports = Cart;

const db = require("../config/db");

const Wishlist = {};

// Add a book to the wishlist
Wishlist.add = (userId, bookId, callback) => {
  const query =
    "INSERT INTO wishlist (user_id, book_id, created_at) VALUES (?, ?, NOW())";
  db.query(query, [userId, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res.insertId);
  });
};

// Remove a book from the wishlist
Wishlist.remove = (userId, bookId, callback) => {
  const query = "DELETE FROM wishlist WHERE user_id = ? AND book_id = ?";
  db.query(query, [userId, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res.affectedRows);
  });
};

// Get all books in the wishlist for a specific user
Wishlist.getByUserId = (userId, callback) => {
  const query = `
    SELECT wishlist.id, books.*, categories.category_name, categories.description AS category_description
    FROM wishlist
    JOIN books ON wishlist.book_id = books.id
    JOIN categories ON books.category_id = categories.id
    WHERE wishlist.user_id = ?`;

  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Check if a book is already in the user's wishlist
Wishlist.isBookInWishlist = (userId, bookId, callback) => {
  const query = "SELECT * FROM wishlist WHERE user_id = ? AND book_id = ?";
  db.query(query, [userId, bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows.length > 0);
  });
};

Wishlist.getUserWishlist = (userId, callback) => {
  const query = "SELECT book_id FROM wishlist WHERE user_id = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else
      callback(
        null,
        rows.map((row) => row.book_id)
      );
  });
};

module.exports = Wishlist;

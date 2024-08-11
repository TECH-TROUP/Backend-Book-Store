const db = require("../config/db");
const Book = require("./Book");

const Review = {};

// Create a new review
Review.create = (bookId, userId, rating, comment, callback) => {
  const query = `
    INSERT INTO reviews (book_id, user_id, rating, comment, created_at) 
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(query, [bookId, userId, rating, comment], (err, res) => {
    if (err) callback(err, null);
    else {
      Book.updateBookRating(bookId, (err, result) => {
        if (err) callback(err, null);
        else callback(null, res.insertId);
      });
    }
  });
};

// Update a review
Review.update = (reviewId, rating, comment, callback) => {
  const query = `
    UPDATE reviews
    SET rating = ?, comment = ?, updated_at = NOW()
    WHERE id = ?
  `;
  db.query(query, [rating, comment, reviewId], (err, res) => {
    if (err) callback(err, null);
    else {
      // Get the book ID from the review
      const selectQuery = "SELECT book_id FROM reviews WHERE id = ?";
      db.query(selectQuery, [reviewId], (err, rows) => {
        if (err) callback(err, null);
        else {
          const bookId = rows[0].book_id;
          Book.updateBookRating(bookId, (err, result) => {
            if (err) callback(err, null);
            else callback(null, res.affectedRows);
          });
        }
      });
    }
  });
};

// Delete a review
Review.delete = (reviewId, callback) => {
  const selectQuery = "SELECT book_id FROM reviews WHERE id = ?";
  db.query(selectQuery, [reviewId], (err, rows) => {
    if (err) callback(err, null);
    else {
      const bookId = rows[0].book_id;
      const query = "DELETE FROM reviews WHERE id = ?";
      db.query(query, [reviewId], (err, res) => {
        if (err) callback(err, null);
        else {
          Book.updateBookRating(bookId, (err, result) => {
            if (err) callback(err, null);
            else callback(null, res.affectedRows);
          });
        }
      });
    }
  });
};

// Get all reviews for a specific book
Review.getByBook = (bookId, callback) => {
  const query = `
        SELECT reviews.*, users.name as user_name
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        WHERE reviews.book_id = ?
        ORDER BY reviews.created_at DESC
      `;
  db.query(query, [bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get all reviews by a specific user
Review.getByUser = (userId, callback) => {
  const query = `
      SELECT reviews.*, books.title AS book_title, books.author AS book_author
      FROM reviews
      JOIN books ON reviews.book_id = books.id
      WHERE reviews.user_id = ?
    `;
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

module.exports = Review;

const db = require("../config/db");

const BookCopy = {};

// Create book copies
BookCopy.createCopies = (bookId, numberOfCopies, callback) => {
  const copyRecords = Array(numberOfCopies).fill([bookId, 4, new Date()]);
  const copyPlaceholders = copyRecords.map(() => "(?, ?, ?)").join(", ");
  const copyValues = copyRecords.flat();

  const query = `INSERT INTO book_copies (book_id, status_id, created_at) VALUES ${copyPlaceholders}`;

  db.query(query, copyValues, (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all copies of a specific book
BookCopy.getByBookId = (bookId, callback) => {
  const query = "SELECT * FROM book_copies WHERE book_id = ?";
  db.query(query, [bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

BookCopy.getByBookIdAndStatus = (bookId, statusId, callback) => {
  const query = `
    SELECT 
      bc.*, 
      b.title AS book_title, 
      b.author AS book_author, 
      b.price AS book_price, 
      b.description AS book_description,
      b.category_id AS book_category_id,
      b.image_url AS book_image_url,
      c.category_name AS category_name,
      c.description AS category_description,
      s.label AS status_label,
      s.description AS status_description
    FROM book_copies bc
    JOIN books b ON bc.book_id = b.id
    JOIN statuses s ON bc.status_id = s.id
    JOIN categories c ON b.category_id = c.id
    WHERE bc.book_id = ? AND bc.status_id = ?
  `;
  db.query(query, [bookId, statusId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Update the status of a specific copy
BookCopy.updateStatus = (copyId, statusId, callback) => {
  const query = "UPDATE book_copies SET status_id = ? WHERE id = ?";
  db.query(query, [statusId, copyId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Delete all copies of a specific book
BookCopy.deleteBookCopy = (copyId, callback) => {
  const query = "DELETE FROM book_copies WHERE id = ?";
  db.query(query, [copyId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Delete all copies of a specific book
BookCopy.deleteByBookId = (bookId, callback) => {
  const query = "DELETE FROM book_copies WHERE book_id = ?";
  db.query(query, [bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

module.exports = BookCopy;

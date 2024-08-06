const db = require("../config/db");

const BookCopy = {};

// Create book copies
BookCopy.createCopies = (bookId, numberOfCopies, callback) => {
  const copyRecords = Array(numberOfCopies).fill([bookId, 4, new Date()]); // Assuming status_id 4 is 'Available'
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

// Update the status of a specific copy
BookCopy.updateStatus = (copyId, statusId, callback) => {
  const query = "UPDATE book_copies SET status_id = ? WHERE id = ?";
  db.query(query, [statusId, copyId], (err, res) => {
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

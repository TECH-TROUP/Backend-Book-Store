const db = require("../config/db");

const Rental = {};

// Create a new rental
Rental.create = (rental, callback) => {
  const query =
    "INSERT INTO rentals (user_id, book_id, rental_date, return_date) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [rental.user_id, rental.book_id, rental.rental_date, rental.return_date],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update a rental
Rental.update = (rentalId, updatedRental, callback) => {
  const query =
    "UPDATE rentals SET user_id = ?, book_id = ?, rental_date = ?, return_date = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedRental.user_id,
      updatedRental.book_id,
      updatedRental.rental_date,
      updatedRental.return_date,
      rentalId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete a rental
Rental.delete = (rentalId, callback) => {
  const query = "DELETE FROM rentals WHERE id = ?";
  db.query(query, [rentalId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all rentals
Rental.getAll = (callback) => {
  const query = "SELECT * FROM rentals";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific rental by ID
Rental.getById = (rentalId, callback) => {
  const query = "SELECT * FROM rentals WHERE id = ?";
  db.query(query, [rentalId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row);
  });
};

// Get rentals by user ID
Rental.getByUserId = (userId, callback) => {
  const query = "SELECT * FROM rentals WHERE user_id = ?";
  db.query(query, [userId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get rentals by book ID
Rental.getByBookId = (bookId, callback) => {
  const query = "SELECT * FROM rentals WHERE book_id = ?";
  db.query(query, [bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Mark a rental as returned
Rental.return = (rentalId, returnDate, callback) => {
  const query = "UPDATE rentals SET return_date = ? WHERE id = ?";
  db.query(query, [returnDate, rentalId], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

// Get the book ID by rental ID
Rental.getBookIdByRentalId = (rentalId, callback) => {
  const query = "SELECT book_id FROM rentals WHERE id = ?";
  db.query(query, [rentalId], (err, rows) => {
    if (err) callback(err, null);
    else if (rows.length === 0) callback(null, null);
    else callback(null, rows[0]);
  });
};

module.exports = Rental;

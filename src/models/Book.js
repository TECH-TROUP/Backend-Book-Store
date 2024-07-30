const db = require("../config/db");

const Book = {};

// Add a new book
Book.create = (book, callback) => {
  const query =
    "INSERT INTO books (title, author, price, description, stock, available, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      book.title,
      book.author,
      book.price,
      book.description,
      book.stock,
      book.available,
      book.category_id,
      book.image_url,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update a book
Book.update = (bookId, updatedBook, callback) => {
  const query =
    "UPDATE books SET title = ?, author = ?, price = ?, description = ?, stock = ?, available = ?, category_id = ?, image_url = ? WHERE id = ?";
  db.query(
    query,
    [
      updatedBook.title,
      updatedBook.author,
      updatedBook.price,
      updatedBook.description,
      updatedBook.stock,
      updatedBook.available,
      updatedBook.category_id,
      updatedBook.image_url,
      bookId,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete a book
Book.delete = (bookId, callback) => {
  const query = "DELETE FROM books WHERE id = ?";
  db.query(query, [bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all books
Book.getAll = (callback) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific book
Book.getById = (bookId, callback) => {
  const query = "SELECT * FROM books WHERE id = ?";
  db.query(query, [bookId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row);
  });
};

module.exports = Book;

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

// Get books by category
Book.getByCategory = (categoryId, callback) => {
  const query = "SELECT * FROM books WHERE category_id = ?";
  db.query(query, [categoryId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Search books by title, author, or category name
Book.search = (searchTerm, callback) => {
  const query = `
    SELECT books.*, categories.category_name 
    FROM books 
    JOIN categories ON books.category_id = categories.id 
    WHERE books.title LIKE ? OR books.author LIKE ? OR categories.category_name LIKE ?
  `;
  const searchPattern = `%${searchTerm}%`;
  db.query(
    query,
    [searchPattern, searchPattern, searchPattern],
    (err, rows) => {
      if (err) callback(err, null);
      else callback(null, rows);
    }
  );
};

// Filter books by various criteria
Book.filter = (filters, callback) => {
  let query = "SELECT * FROM books WHERE 1=1";
  const params = [];

  if (filters.minPrice) {
    query += " AND price >= ?";
    params.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += " AND price <= ?";
    params.push(filters.maxPrice);
  }

  if (filters.available !== undefined) {
    query += " AND available = ?";
    params.push(filters.available);
  }

  if (filters.categoryId) {
    query += " AND category_id = ?";
    params.push(filters.categoryId);
  }

  db.query(query, params, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Update book availability
Book.updateAvailability = (bookId, available, callback) => {
  const query = "UPDATE books SET available = ? WHERE id = ?";
  db.query(query, [available, bookId], (err, result) => {
    if (err) callback(err, null);
    else callback(null, result);
  });
};

module.exports = Book;

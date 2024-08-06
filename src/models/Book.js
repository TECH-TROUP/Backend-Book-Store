const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const BookCopy = require("./BookCopy");

const Book = {};

// Add a new book
Book.create = (book, callback) => {
  const query =
    "INSERT INTO books (title, author, price, description, stock, category_id, image_url, vendor_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    query,
    [
      book.title,
      book.author,
      book.price,
      book.description,
      book.stock,
      book.category_id,
      book.image_url,
      book.vendor_id,
      book.status_id,
    ],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

Book.update = (bookId, updatedBook, callback) => {
  Book.getById(bookId, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    const book = result[0];
    const oldImagePath = book.image_url;
    const newImagePath = updatedBook.image_url;

    if (newImagePath && oldImagePath && oldImagePath !== newImagePath) {
      const filePath = path.join(__dirname, "../../", oldImagePath);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting the old image file:", unlinkErr);
        }
      });
    }

    // Update the book details in the database
    const updateQuery = `UPDATE books SET title = ?, author = ?, price = ?, description = ?, stock = ?, category_id = ?, image_url = ? WHERE id = ?`;
    db.query(
      updateQuery,
      [
        updatedBook.title,
        updatedBook.author,
        updatedBook.price,
        updatedBook.description,
        updatedBook.stock,
        updatedBook.category_id,
        newImagePath,
        bookId,
      ],
      (updateErr, updateRes) => {
        if (updateErr) callback(updateErr, null);
        else callback(null, updateRes);
      }
    );
  });
};

// Delete a book
Book.delete = (bookId, callback) => {
  // First, get the book to retrieve the image path
  Book.getById(bookId, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    const book = result[0];
    const imagePath = book.image_url;

    // Delete the book copies from the book_copies table
    BookCopy.deleteByBookId(bookId, (deleteCopiesErr, deleteCopiesRes) => {
      if (deleteCopiesErr) {
        callback(deleteCopiesErr, null);
        return;
      }

      // Delete the book from the database
      const deleteQuery = "DELETE FROM books WHERE id = ?";
      db.query(deleteQuery, [bookId], (deleteErr, deleteRes) => {
        if (deleteErr) {
          callback(deleteErr, null);
          return;
        }

        // Delete the image file if it exists
        if (imagePath) {
          const filePath = path.join(__dirname, "../../", imagePath);

          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting the image file:", unlinkErr);
            }
            // Proceed to callback
            callback(null, deleteRes);
          });
        } else {
          // No image to delete, proceed to callback
          callback(null, deleteRes);
        }
      });
    });
  });
};

// Get all books
Book.getAll = (callback) => {
  const query = `
    SELECT books.*, 
           categories.category_name, 
           categories.description AS category_description,
           statuses.label AS status_label,
           statuses.description AS status_description,
           statuses.bg_color AS status_bg_color,
           statuses.color AS status_text_color
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id`;

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

  if (filters.categoryId) {
    query += " AND category_id = ?";
    params.push(filters.categoryId);
  }

  if (filters.statusId) {
    query += " AND status_id = ?";
    params.push(filters.statusId);
  }

  db.query(query, params, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get books by vendor ID
Book.getByVendorId = (vendorId, callback) => {
  const query = `SELECT books.*, categories.category_name, categories.description AS category_description, statuses.label AS status_label, statuses.description AS status_description, statuses.bg_color as status_bg_color, statuses.color as status_text_color
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id
    WHERE books.vendor_id = ?`;
  db.query(query, [vendorId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get books by status ID
Book.getByStatusId = (statusId, callback) => {
  const query = `
    SELECT books.*, 
           categories.category_name, 
           categories.description AS category_description,
           statuses.label AS status_label,
           statuses.description AS status_description,
           statuses.bg_color AS status_bg_color,
           statuses.color AS status_text_color
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id
    WHERE books.status_id = ?`;

  db.query(query, [statusId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Update the status of a book
Book.updateStatus = (bookId, statusId, callback) => {
  const query = "UPDATE books SET status_id = ? WHERE id = ?";
  db.query(query, [statusId, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Approve a book and create copies
Book.approveBook = (bookId, numberOfCopies, callback) => {
  try {
    const statusUpdateQuery = "UPDATE books SET status_id = ? WHERE id = ?";
    const [statusUpdateRes] = db.query(statusUpdateQuery, [2, bookId]);

    BookCopy.createCopies(bookId, numberOfCopies, (copyErr, copyRes) => {
      if (copyErr) {
        db.rollback();
        callback(copyErr, null);
      } else {
        db.commit();
        callback(null, { statusUpdateRes, copyRes });
      }
    });
  } catch (transactionErr) {
    db.rollback();
    callback(transactionErr, null);
  }
};

module.exports = Book;

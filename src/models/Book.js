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

    const book = result;
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

    const book = result;
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
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id`;

  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific book along with category details
Book.getById = (bookId, callback) => {
  const query = `
    SELECT b.*, c.category_name 
    FROM books b
    JOIN categories c ON b.category_id = c.id
    WHERE b.id = ?`;

  db.query(query, [bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0]);
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
  const query = `SELECT books.*, categories.category_name, categories.description AS category_description, 
    statuses.label AS status_label, statuses.description AS status_description
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id
    WHERE books.vendor_id = ?`;
  db.query(query, [vendorId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get books by vendor ID and status ID
Book.getByVendorIdAndStatusId = (vendorId, statusId, callback) => {
  const query = `SELECT books.*, categories.category_name, categories.description AS category_description, 
    statuses.label AS status_label, statuses.description AS status_description
    FROM books
    JOIN categories ON books.category_id = categories.id
    JOIN statuses ON books.status_id = statuses.id
    WHERE books.vendor_id = ? AND books.status_id = ?`;
  db.query(query, [vendorId, statusId], (err, rows) => {
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
           statuses.description AS status_description
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
    Book.updateStatus(bookId, 2, (err, res) => {
      if (err) callback(err, null);
      else {
        BookCopy.createCopies(bookId, numberOfCopies, (copyErr, copyRes) => {
          if (copyErr) {
            callback(copyErr, null);
          } else {
            callback(null, copyRes);
          }
        });
      }
    });
  } catch (error) {
    callback(error, null);
  }
};

// Update the stock of a specific book
Book.updateStock = (bookId, change, callback) => {
  const query = "UPDATE books SET stock = stock + ? WHERE id = ?";
  db.query(query, [change, bookId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get top 5 best-selling books based on purchase count
Book.getTop5BestSellers = (callback) => {
  const query = `
    SELECT id, title, author, price, description, image_url, purchase_count
    FROM books
    ORDER BY purchase_count DESC
    LIMIT 5;
  `;

  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get top 5 popular books based on view count
Book.getTop5PopularBooks = (callback) => {
  const query = `
    SELECT id, title, author, price, description, image_url, view_count
    FROM books
    ORDER BY view_count DESC
    LIMIT 5;
  `;

  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get top books based on rating with a limit provided by the user
Book.getTopBooksByRating = (limit, callback) => {
  const query = `
    SELECT id, title, author, price, description, image_url, rating_average
    FROM books
    ORDER BY rating_average DESC
    LIMIT ?;
  `;

  db.query(query, [limit], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Fetch the stock of a book
Book.getStock = (bookId, callback) => {
  const query = "SELECT stock FROM books WHERE id = ?";
  db.query(query, [bookId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0] ? rows[0].stock : 0);
  });
};

module.exports = Book;

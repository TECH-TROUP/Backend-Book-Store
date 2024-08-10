const Book = require("../models/Book");
const BookCopy = require("../models/BookCopy");

exports.createBook = (req, res) => {
  const { title, author, price, description, stock, category_id, vendor_id } =
    req.body;

  // Check for required fields
  if (!title || !author || !stock) {
    return res.status(400).json({
      error:
        "Please provide all required fields: title, author, price, category, and stock",
    });
  }

  if (price < 1) {
    return res.status(400).json({ error: "Please enter a valid price!" });
  }

  // Check if category_id is valid (not null)
  if (
    category_id === null ||
    category_id === undefined ||
    category_id === "null"
  ) {
    return res.status(400).json({ error: "Please select a book category!" });
  }

  // Process image URL
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Create new book object
  const newBook = {
    title,
    author,
    price,
    description,
    stock,
    category_id,
    image_url,
    vendor_id,
    status_id: 1,
  };

  // Create book in database
  Book.create(newBook, (err, bookId) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send({ id: bookId });
    }
  });
};

exports.updateBook = (req, res) => {
  const bookId = req.params.id;
  const { title, author, price, description, stock, category_id } = req.body;

  // Retrieve the existing book details
  Book.getById(bookId, (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(404).send({ error: "Book not found" });
    }

    const existingBook = result[0];
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : existingBook.image_url;

    // Check if the stock value is less than the current stock
    if (stock < existingBook.stock) {
      // Prevent updating the stock value and notify the user
      return res.status(400).send({
        error:
          "Stock cannot be reduced directly. Please manually remove excess book copies.",
      });
    }

    const updatedBook = {
      title,
      author,
      price,
      description,
      stock,
      category_id,
      image_url,
    };

    // Update the book details
    Book.update(bookId, updatedBook, (err, updateResult) => {
      if (err) return res.status(500).send(err);
      if (updateResult.affectedRows === 0) {
        return res.status(404).send({ error: "Book not found" });
      }

      // Handle stock changes
      if (stock > existingBook.stock) {
        // Increase stock: Add new copies
        const copiesToAdd = stock - existingBook.stock;

        BookCopy.createCopies(bookId, copiesToAdd, (copyErr, copyResult) => {
          if (copyErr) {
            return res.status(500).send({ error: "Failed to add book copies" });
          }
          res.status(200).send({
            message: "Book updated successfully and new copies created",
          });
        });
      } else {
        // No stock change
        res.status(200).send({ message: "Book updated successfully" });
      }
    });
  });
};

exports.deleteBook = (req, res) => {
  const bookId = req.params.id;

  Book.delete(bookId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Book not found" });
    } else {
      res.status(200).send({ message: "Book deleted successfully" });
    }
  });
};

exports.getAllBooks = (req, res) => {
  Book.getAll((err, books) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(books);
  });
};

exports.getBookById = (req, res) => {
  const bookId = req.params.id;

  Book.getById(bookId, (err, book) => {
    if (err) res.status(500).send(err);
    else if (!book) {
      res.status(404).send({ error: "Book not found" });
    } else {
      res.status(200).send(book);
    }
  });
};

exports.getBooksByCategory = (req, res) => {
  const categoryId = req.params.categoryId;

  Book.getByCategory(categoryId, (err, books) => {
    if (err) res.status(500).send(err);
    else if (books.length === 0) {
      res.status(404).send({ error: "No books found for this category" });
    } else {
      res.status(200).send(books);
    }
  });
};

exports.searchBooks = (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ error: "Please provide a search term" });
  }

  Book.search(searchTerm, (err, books) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(books);
  });
};

exports.filterBooks = (req, res) => {
  const filters = {
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    categoryId: req.query.categoryId,
  };

  Book.filter(filters, (err, books) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(books);
  });
};

// Get books by vendor ID
exports.getBooksByVendorId = (req, res) => {
  const vendorId = req.params.vendorId;

  Book.getByVendorId(vendorId, (err, books) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
    res.status(200).json(books);
  });
};

// Get books by vendor ID and status ID
exports.getBooksByVendorIdAndStatusId = (req, res) => {
  const vendorId = req.params.vendorId;
  const statusId = req.params.statusId;

  Book.getByVendorIdAndStatusId(vendorId, statusId, (err, books) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    } else {
      return res.status(200).json(books);
    }
  });
};

exports.getBooksByStatusId = (req, res) => {
  const statusId = req.params.statusId;

  Book.getByStatusId(statusId, (err, books) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
    res.status(200).json(books);
  });
};

exports.updateBookStatus = (req, res) => {
  const { bookId, statusId } = req.body;

  if (!bookId || !statusId) {
    return res
      .status(400)
      .json({ error: "Please provide bookId and statusId" });
  }

  Book.updateStatus(bookId, statusId, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(200)
        .json({ message: "Book status updated successfully", result });
    }
  });
};

// Approve a book and create copies
exports.approveBook = (req, res) => {
  const { bookId, numberOfCopies } = req.body;

  if (!bookId || !numberOfCopies) {
    return res
      .status(400)
      .json({ message: "Book ID and number of copies are required." });
  }

  Book.approveBook(bookId, numberOfCopies, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error approving the book and creating copies.",
        error: err,
      });
    }

    res.status(200).json({
      message: "Book approved and copies created successfully.",
      data: result,
    });
  });
};

// Controller method to get top 5 best-selling books
exports.getTop5BestSellers = (req, res) => {
  Book.getTop5BestSellers((err, books) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(books);
  });
};

// Controller method to get top 5 popular books
exports.getTop5PopularBooks = (req, res) => {
  Book.getTop5PopularBooks((err, books) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(books);
  });
};

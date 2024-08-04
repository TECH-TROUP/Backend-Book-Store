const Book = require("../models/Book");

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
    Book.update(bookId, updatedBook, (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Book not found" });
      }
      res.status(200).send({ message: "Book updated successfully" });
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

exports.getBooksByStatusId = (req, res) => {
  const statusId = req.params.statusId;

  Book.getByStatusId(statusId, (err, books) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve books" });
    }
    if (books.length === 0) {
      return res.status(404).json({ error: "No books found for this status" });
    }
    res.status(200).json(books);
  });
};

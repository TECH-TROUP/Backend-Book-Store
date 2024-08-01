const Book = require("../models/Book");

exports.createBook = (req, res) => {
  const { title, author, price, description, stock, available, category_id } =
    req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !author || !price) {
    return res.status(400).json({ error: "Please provide required fields" });
  }

  const newBook = {
    title,
    author,
    price,
    description,
    stock,
    available,
    category_id,
    image_url,
  };

  Book.create(newBook, (err, bookId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: bookId });
  });
};

exports.updateBook = (req, res) => {
  const bookId = req.params.id;
  const { title, author, price, description, stock, available, category_id } =
    req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const updatedBook = {
    title,
    author,
    price,
    description,
    stock,
    available,
    category_id,
    image_url,
  };

  Book.update(bookId, updatedBook, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Book not found" });
    } else {
      res.status(200).send({ message: "Book updated successfully" });
    }
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
    available:
      req.query.available !== undefined
        ? Boolean(req.query.available)
        : undefined,
    categoryId: req.query.categoryId,
  };

  Book.filter(filters, (err, books) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(books);
  });
};

const Wishlist = require("../models/Wishlist");
const Book = require("../models/Book");

// Add a book to the user's wishlist
exports.addToWishlist = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  Wishlist.isBookInWishlist(userId, bookId, (err, exists) => {
    if (err) return res.status(500).json({ error: "Internal server error" });

    if (exists) {
      return res.status(400).json({ message: "Book is already in wishlist" });
    }

    Wishlist.add(userId, bookId, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to add book to wishlist" });
      res.status(201).json({ message: "Book added to wishlist" });
    });
  });
};

// Remove a book from the user's wishlist
exports.removeFromWishlist = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  Wishlist.remove(userId, bookId, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to remove book from wishlist" });

    if (result === 0) {
      return res.status(404).json({ message: "Book not found in wishlist" });
    }

    res.status(200).json({ message: "Book removed from wishlist" });
  });
};

// Get all books in the user's wishlist
exports.getUserWishlist = (req, res) => {
  const userId = req.user.id;

  Wishlist.getByUserId(userId, (err, books) => {
    if (err)
      return res.status(500).json({ error: "Failed to retrieve wishlist" });
    res.status(200).json(books);
  });
};

// Check if a book is in the user's wishlist
exports.checkBookInWishlist = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  Wishlist.isBookInWishlist(userId, bookId, (err, exists) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    res.status(200).json({ inWishlist: exists });
  });
};

// Get book IDs from the user's wishlist
exports.getUserWishlistBookIds = (req, res) => {
  const userId = req.user.id;

  Wishlist.getUserWishlist(userId, (err, bookIds) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to retrieve wishlist book IDs" });
    res.status(200).json({ bookIds });
  });
};

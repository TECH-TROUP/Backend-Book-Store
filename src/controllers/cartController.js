const Cart = require("../models/Cart");
const Book = require("../models/Book");

// Add a book to the user's cart
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { bookId, quantity, type } = req.body;

  if (!bookId || quantity === undefined || !type) {
    return res
      .status(400)
      .json({ error: "Book ID, quantity, and type are required" });
  }

  // Fetch the book stock
  Book.getStock(bookId, (err, stock) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch book stock" });
    }

    // Check if the book is already in the cart
    Cart.getCartItem(userId, bookId, (err, existingCartItem) => {
      if (err) {
        return res.status(500).json({ error: "Failed to check cart item" });
      }

      if (existingCartItem) {
        // Calculate the new total quantity
        const newTotalQuantity = existingCartItem.quantity + quantity;
        if (newTotalQuantity > stock) {
          return res
            .status(400)
            .json({ error: "Total quantity exceeds available stock" });
        }
        // Update the quantity of the existing item in the cart
        Cart.updateQuantity(userId, bookId, newTotalQuantity, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to update cart quantity" });
          }
          res
            .status(200)
            .json({ message: "Cart quantity updated", success: true });
        });
      } else {
        // For new items, check if the quantity exceeds the stock
        if (quantity > stock) {
          return res
            .status(400)
            .json({ error: "Requested quantity exceeds available stock" });
        }
        // Add new item to the cart
        Cart.add(userId, bookId, quantity, type, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Failed to add book to cart" });
          }
          res
            .status(201)
            .json({ message: "Book added to cart", success: true });
        });
      }
    });
  });
};

// Remove a book from the user's cart
exports.removeFromCart = (req, res) => {
  const userId = req.user.id;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }

  Cart.remove(userId, bookId, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to remove book from cart" });

    if (result === 0) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    res.status(200).json({ message: "Book removed from cart", success: true });
  });
};

// Update the quantity of a book in the user's cart
exports.updateCartQuantity = (req, res) => {
  const userId = req.user.id;
  const { bookId, quantity } = req.body;

  if (!bookId || quantity === undefined) {
    return res.status(400).json({ error: "Book ID and quantity are required" });
  }

  Cart.updateQuantity(userId, bookId, quantity, (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed to update cart quantity" });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found in cart" });
    }

    res.status(200).json({ message: "Cart quantity updated", success: true });
  });
};

// Get all books in the user's cart
exports.getUserCart = (req, res) => {
  const userId = req.user.id;

  Cart.getByUserId(userId, (err, books) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve cart" });
    res.status(200).json(books);
  });
};

// Get book IDs from the user's cart
exports.getUserCartBookIds = (req, res) => {
  const userId = req.user.id;

  Cart.getUserCart(userId, (err, bookIds) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to retrieve cart book IDs" });
    res.status(200).json({ bookIds });
  });
};

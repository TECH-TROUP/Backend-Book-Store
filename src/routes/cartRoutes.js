const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

// Add a book to the cart
router.post("/cart/add", auth, cartController.addToCart);

// Remove a book from the cart
router.post("/cart/remove", auth, cartController.removeFromCart);

// Update the quantity of a book in the cart
router.post("/cart/update-quantity", auth, cartController.updateCartQuantity);

// Get all books in the user's cart
router.get("/cart/user", auth, cartController.getUserCart);

// Get book IDs from the user's wishlist
router.get("/cart/book-ids", auth, cartController.getUserCartBookIds);

module.exports = router;

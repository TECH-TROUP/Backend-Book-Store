const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const auth = require("../middleware/auth");

// Add a book to the wishlist
router.post("/wishlist/add", auth, wishlistController.addToWishlist);

// Remove a book from the wishlist
router.post("/wishlist/remove", auth, wishlistController.removeFromWishlist);

// Get all books in the user's wishlist
router.get("/wishlist/user", auth, wishlistController.getUserWishlist);

// Check if a book is in the user's wishlist
router.get(
  "/wishlist/check/:bookId",
  auth,
  wishlistController.checkBookInWishlist
);

// Get book IDs from the user's wishlist
router.get(
  "/wishlist/book-ids",
  auth,
  wishlistController.getUserWishlistBookIds
);

module.exports = router;

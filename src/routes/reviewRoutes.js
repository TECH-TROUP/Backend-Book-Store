const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

// Create a new review
router.post("/reviews", auth, reviewController.createReview);

// Get all reviews for a specific book
router.get("/reviews/book/:bookId", reviewController.getReviewsByBook);

// Get all reviews by a specific user
router.get("/reviews/user", auth, reviewController.getReviewsByUser);

// Update a review
router.put("/reviews", auth, reviewController.updateReview);

// Delete a review
router.delete("/reviews", auth, reviewController.deleteReview);

module.exports = router;

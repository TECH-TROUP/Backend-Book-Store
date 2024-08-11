const Review = require("../models/Review");

// Create a new review
exports.createReview = (req, res) => {
  const userId = req.user.id;
  const { bookId, rating, comment } = req.body;

  if (!bookId || !rating) {
    return res.status(400).json({ error: "Book ID and rating are required" });
  }

  Review.create(bookId, userId, rating, comment, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create review" });
    res
      .status(201)
      .json({ message: "Review created successfully", success: true });
  });
};

// Update a review
exports.updateReview = (req, res) => {
  const { reviewId, rating, comment } = req.body;

  if (!reviewId || !rating) {
    return res.status(400).json({ error: "Review ID and rating are required" });
  }

  Review.update(reviewId, rating, comment, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to update review" });
    if (result === 0)
      return res.status(404).json({ message: "Review not found" });
    res
      .status(200)
      .json({ message: "Review updated successfully", success: true });
  });
};

// Delete a review
exports.deleteReview = (req, res) => {
  const { reviewId } = req.body;

  if (!reviewId) {
    return res.status(400).json({ error: "Review ID is required" });
  }

  Review.delete(reviewId, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete review" });
    if (result === 0)
      return res.status(404).json({ message: "Review not found" });
    res
      .status(200)
      .json({ message: "Review deleted successfully", success: true });
  });
};

// Get all reviews for a specific book
exports.getReviewsByBook = (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }

  Review.getByBook(bookId, (err, reviews) => {
    if (err)
      return res.status(500).json({ error: "Failed to retrieve reviews" });
    res.status(200).json(reviews);
  });
};

// Get all reviews by a specific user
exports.getReviewsByUser = (req, res) => {
  const userId = req.user.id;

  Review.getByUser(userId, (err, reviews) => {
    if (err)
      return res.status(500).json({ error: "Failed to retrieve reviews" });
    res.status(200).json(reviews);
  });
};

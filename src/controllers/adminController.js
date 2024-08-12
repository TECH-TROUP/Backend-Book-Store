const Admin = require("../models/AdminModel"); // Update the path if necessary

const adminController = {};

// Get all statistics for the dashboard
adminController.getDashboardStats = (req, res) => {
  // Create a variable to hold all promises
  const userStatsPromise = new Promise((resolve, reject) => {
    Admin.getUserStats((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const bookStatsPromise = new Promise((resolve, reject) => {
    Admin.getBookStats((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const salesStatsPromise = new Promise((resolve, reject) => {
    Admin.getTotalSales((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const wishlistStatsPromise = new Promise((resolve, reject) => {
    Admin.getWishlistStats((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const cartStatsPromise = new Promise((resolve, reject) => {
    Admin.getAverageCartValue((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const reviewStatsPromise = new Promise((resolve, reject) => {
    Admin.getReviewStats((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  // Execute all promises in parallel
  Promise.all([
    userStatsPromise,
    bookStatsPromise,
    salesStatsPromise,
    wishlistStatsPromise,
    cartStatsPromise,
    reviewStatsPromise,
  ])
    .then(
      ([
        userStats,
        bookStats,
        salesStats,
        wishlistStats,
        averageCartValue,
        reviewStats,
      ]) => {
        // Combine all results into one response
        const results = {
          userStats,
          bookStats,
          salesStats,
          wishlistStats,
          averageCartValue,
          reviewStats,
        };
        res.json(results);
      }
    )
    .catch((err) => {
      console.error("Error retrieving dashboard stats:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = adminController;

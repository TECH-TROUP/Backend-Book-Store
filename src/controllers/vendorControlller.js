const Vendor = require("../models/VendorModel");

const vendorController = {};

// Get all statistics for the vendor dashboard
vendorController.getDashboardStats = (req, res) => {
  const vendorId = req.user.id;

  // Create a variable to hold all promises
  const booksStatsPromise = new Promise((resolve, reject) => {
    Vendor.getBooksStats(vendorId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const salesStatsPromise = new Promise((resolve, reject) => {
    Vendor.getSalesStats(vendorId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const wishlistStatsPromise = new Promise((resolve, reject) => {
    Vendor.getWishlistStats(vendorId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const averageRatingPromise = new Promise((resolve, reject) => {
    Vendor.getAverageRating(vendorId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  // Execute all promises in parallel
  Promise.all([
    booksStatsPromise,
    salesStatsPromise,
    wishlistStatsPromise,
    averageRatingPromise,
  ])
    .then(([booksStats, salesStats, wishlistStats, averageRating]) => {
      // Combine all results into one response
      const results = {
        booksStats,
        salesStats,
        wishlistStats,
        averageRating,
      };
      res.json(results);
    })
    .catch((err) => {
      console.error("Error retrieving vendor dashboard stats:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = vendorController;

const db = require("../config/db");

const Admin = {};

Admin.getUserStats = (callback) => {
  const query = `
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role_id = 1 THEN 1 ELSE 0 END) as totalAdmins,
        SUM(CASE WHEN role_id = 2 THEN 1 ELSE 0 END) as totalCustomers,
        SUM(CASE WHEN role_id = 3 THEN 1 ELSE 0 END) as totalVendors
      FROM users
    `;
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else
      callback(null, {
        totalUsers: rows[0].totalUsers,
        totalAdmins: rows[0].totalAdmins,
        totalCustomers: rows[0].totalCustomers,
        totalVendors: rows[0].totalVendors,
      });
  });
};

Admin.getBookStats = (callback) => {
  // Query to get total books and counts by status
  const totalBooksQuery = `
    SELECT 
      COUNT(*) as totalBooks,
      SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) as pendingApprovalBooks,
      SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) as approvedBooks,
      SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) as rejectedBooks,
      SUM(CASE WHEN status_id = 13 THEN 1 ELSE 0 END) as outOfStockBooks
    FROM books
  `;

  // Query to get top categories by number of books
  const topCategoriesQuery = `
    SELECT 
      c.category_name,
      COUNT(b.id) as booksInCategory
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    GROUP BY c.category_name
    ORDER BY booksInCategory DESC
    LIMIT 10
  `;

  // Execute both queries in parallel
  db.query(totalBooksQuery, (err, totalBooksResult) => {
    if (err) return callback(err, null);

    db.query(topCategoriesQuery, (err, topCategoriesResult) => {
      if (err) return callback(err, null);

      // Combine results
      const results = {
        totalBooks: totalBooksResult[0].totalBooks,
        pendingApprovalBooks: totalBooksResult[0].pendingApprovalBooks,
        approvedBooks: totalBooksResult[0].approvedBooks,
        rejectedBooks: totalBooksResult[0].rejectedBooks,
        outOfStockBooks: totalBooksResult[0].outOfStockBooks,
        topCategories: topCategoriesResult,
      };

      callback(null, results);
    });
  });
};

Admin.getTotalSales = (callback) => {
  // Query to get total sales and revenue
  const salesQuery = `
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total_price) as totalRevenue
      FROM orders
    `;

  // Query to get top selling books
  const topBooksQuery = `
      SELECT 
        b.title,
        b.author,
        SUM(b.purchase_count) as totalSales
      FROM books b
      GROUP BY b.id
      ORDER BY totalSales DESC
      LIMIT 10
    `;

  // Query to get order growth (daily, weekly, monthly)
  const orderGrowthQuery = `
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as orderCount
      FROM orders
      GROUP BY DATE(order_date)
      ORDER BY date DESC
    `;

  // Run the queries in parallel
  db.query(salesQuery, (err, salesResult) => {
    if (err) return callback(err, null);

    db.query(topBooksQuery, (err, topBooksResult) => {
      if (err) return callback(err, null);

      db.query(orderGrowthQuery, (err, growthResult) => {
        if (err) return callback(err, null);

        // Combine all results
        const results = {
          totalOrders: salesResult[0].totalOrders,
          totalRevenue: salesResult[0].totalRevenue,
          topSellingBooks: topBooksResult,
          orderGrowth: growthResult,
        };

        callback(null, results);
      });
    });
  });
};

Admin.getWishlistStats = (callback) => {
  // Query to get most wished books
  const mostWishedBooksQuery = `
    SELECT 
      b.title,
      b.author,
      COUNT(w.book_id) as wishCount
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    GROUP BY b.id
    ORDER BY wishCount DESC
    LIMIT 10
  `;

  // Query to get the total number of books in wishlists
  const wishlistCountQuery = `
    SELECT 
      COUNT(*) as totalWishlistBooks
    FROM wishlist
  `;

  // Execute both queries in parallel
  db.query(mostWishedBooksQuery, (err, mostWishedBooksResult) => {
    if (err) return callback(err, null);

    db.query(wishlistCountQuery, (err, wishlistCountResult) => {
      if (err) return callback(err, null);

      // Combine results
      const results = {
        mostWishedBooks: mostWishedBooksResult,
        totalWishlistBooks: wishlistCountResult[0].totalWishlistBooks,
      };

      callback(null, results);
    });
  });
};

Admin.getAverageCartValue = (callback) => {
  // Query to get the total value of items in carts and the total number of carts
  const query = `
    SELECT 
      AVG(cartValue) as averageCartValue
    FROM (
      SELECT 
        c.id as cartId,
        SUM(b.price * c.quantity) as cartValue
      FROM cart c
      JOIN books b ON c.book_id = b.id
      GROUP BY c.id
    ) as cartValues
  `;

  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0].averageCartValue);
  });
};

Admin.getReviewStats = (callback) => {
  // Query to get total reviews and average rating
  const totalReviewsQuery = `
    SELECT 
      COUNT(*) as totalReviews
    FROM reviews
  `;

  const averageRatingQuery = `
    SELECT 
      AVG(rating) as averageRating
    FROM reviews
  `;

  const booksWithHighestRatingsQuery = `
    SELECT 
      b.id as bookId,
      b.title,
      b.author,
      b.rating_average as averageRating
    FROM books b
    ORDER BY b.rating_average DESC
    LIMIT 10
  `;

  const booksWithMostReviewsQuery = `
    SELECT 
      id as bookId,
      title,
      author,
      review_count as reviewCount
    FROM books
    ORDER BY review_count DESC
    LIMIT 10
  `;

  // Run all queries in parallel
  db.query(totalReviewsQuery, (err, totalReviewsResult) => {
    if (err) return callback(err, null);

    db.query(averageRatingQuery, (err, averageRatingResult) => {
      if (err) return callback(err, null);

      db.query(booksWithHighestRatingsQuery, (err, highestRatingsResult) => {
        if (err) return callback(err, null);

        db.query(booksWithMostReviewsQuery, (err, mostReviewsResult) => {
          if (err) return callback(err, null);

          // Combine all results
          const results = {
            totalReviews: totalReviewsResult[0].totalReviews,
            averageRating: averageRatingResult[0].averageRating,
            booksWithHighestRatings: highestRatingsResult,
            booksWithMostReviews: mostReviewsResult,
          };

          callback(null, results);
        });
      });
    });
  });
};

module.exports = Admin;

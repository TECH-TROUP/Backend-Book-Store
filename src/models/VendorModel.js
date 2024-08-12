const db = require("../config/db");

const Vendor = {};

// Get statistics related to books for the vendor
Vendor.getBooksStats = (vendorId, callback) => {
  const totalBooksQuery = `
    SELECT 
      COUNT(*) as totalBooks,
      SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) as pendingApprovalBooks,
      SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) as approvedBooks,
      SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) as rejectedBooks,
      SUM(CASE WHEN status_id = 13 THEN 1 ELSE 0 END) as outOfStockBooks
    FROM books
    WHERE vendor_id = ?
  `;

  const topCategoriesQuery = `
    SELECT 
      c.category_name,
      COUNT(b.id) as booksInCategory
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.vendor_id = ?
    GROUP BY c.category_name
    ORDER BY booksInCategory DESC
    LIMIT 10
  `;

  db.query(totalBooksQuery, [vendorId], (err, totalBooksResult) => {
    if (err) return callback(err, null);

    db.query(topCategoriesQuery, [vendorId], (err, topCategoriesResult) => {
      if (err) return callback(err, null);

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

// Get statistics related to sales for the vendor
Vendor.getSalesStats = (vendorId, callback) => {
  const salesQuery = `
    SELECT 
      COUNT(DISTINCT oi.order_id) as totalOrders,
      SUM(oi.price * oi.quantity) as totalRevenue
    FROM order_items oi
    JOIN books b ON oi.book_id = b.id
    WHERE b.vendor_id = ?
  `;

  const topBooksQuery = `
    SELECT 
      b.title,
      b.author,
      SUM(oi.quantity) as totalSales
    FROM order_items oi
    JOIN books b ON oi.book_id = b.id
    WHERE b.vendor_id = ?
    GROUP BY b.id
    ORDER BY totalSales DESC
    LIMIT 10
  `;

  const orderGrowthQuery = `
    SELECT 
      DATE(o.order_date) as date,
      COUNT(DISTINCT oi.order_id) as orderCount
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN books b ON oi.book_id = b.id
    WHERE b.vendor_id = ?
    GROUP BY DATE(o.order_date)
    ORDER BY date DESC
  `;

  db.query(salesQuery, [vendorId], (err, salesResult) => {
    if (err) return callback(err, null);

    db.query(topBooksQuery, [vendorId], (err, topBooksResult) => {
      if (err) return callback(err, null);

      db.query(orderGrowthQuery, [vendorId], (err, growthResult) => {
        if (err) return callback(err, null);

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

// Get wishlist statistics for the vendor
Vendor.getWishlistStats = (vendorId, callback) => {
  const mostWishedBooksQuery = `
    SELECT 
      b.title,
      b.author,
      COUNT(w.book_id) as wishCount
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    WHERE b.vendor_id = ?
    GROUP BY b.id
    ORDER BY wishCount DESC
    LIMIT 10
  `;

  const wishlistCountQuery = `
    SELECT 
      COUNT(*) as totalWishlistBooks
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    WHERE b.vendor_id = ?
  `;

  db.query(mostWishedBooksQuery, [vendorId], (err, mostWishedBooksResult) => {
    if (err) return callback(err, null);

    db.query(wishlistCountQuery, [vendorId], (err, wishlistCountResult) => {
      if (err) return callback(err, null);

      const results = {
        mostWishedBooks: mostWishedBooksResult,
        totalWishlistBooks: wishlistCountResult[0].totalWishlistBooks,
      };

      callback(null, results);
    });
  });
};

// Get average rating of the vendor's books
Vendor.getAverageRating = (vendorId, callback) => {
  const query = `
    SELECT 
      AVG(b.rating_average) as averageRating
    FROM books b
    WHERE b.vendor_id = ?
  `;

  db.query(query, [vendorId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0].averageRating);
  });
};

module.exports = Vendor;

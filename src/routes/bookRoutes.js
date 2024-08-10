const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const checkVendor = require("../middleware/checkVendor");
const upload = require("../middleware/upload");
const checkAdminOrVendor = require("../middleware/checkAdminOrVendor");

// Vendors
router.post(
  "/books",
  auth,
  checkVendor,
  upload.single("image"),
  bookController.createBook
);
router.put(
  "/books/:id",
  auth,
  checkVendor,
  upload.single("image"),
  bookController.updateBook
);
router.delete(
  "/books/:id",
  auth,
  checkAdminOrVendor,
  bookController.deleteBook
);

// Admins
router.get("/books", auth, checkAdmin, bookController.getAllBooks);
router.post("/books/approve", auth, checkAdmin, bookController.approveBook);

// Public
router.get("/books/category/:categoryId", bookController.getBooksByCategory);
router.get("/books/search", bookController.searchBooks);
router.get("/books/filter", bookController.filterBooks);
router.get("/books/top5", bookController.getTop5BestSellers);
router.get("/books/popular", bookController.getTop5PopularBooks);
router.get("/books/:id", bookController.getBookById);

// Vendor / Admins
router.get(
  "/books/vendor/:vendorId",
  auth,
  checkAdminOrVendor,
  bookController.getBooksByVendorId
);
router.get(
  "/books/vendor/:vendorId/status/:statusId",
  auth,
  checkAdminOrVendor,
  bookController.getBooksByVendorIdAndStatusId
);

router.get("/books/status/:statusId", bookController.getBooksByStatusId);
router.put(
  "/books/:id/status",
  auth,
  checkAdminOrVendor,
  bookController.updateBookStatus
);

module.exports = router;

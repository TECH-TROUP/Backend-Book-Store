const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const checkVendor = require("../middleware/checkVendor");
const upload = require("../middleware/upload");
const checkAdminOrVendor = require("../middleware/checkAdminOrVendor");

// Book routes
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
router.get("/books", auth, checkAdmin, bookController.getAllBooks);
router.get("/books/:id", bookController.getBookById);
router.get("/books/category/:categoryId", bookController.getBooksByCategory);
router.get("/books/search", bookController.searchBooks);
router.get("/books/filter", bookController.filterBooks);
router.get("/books/vendor/:vendorId", bookController.getBooksByVendorId);
router.get("/books/status/:statusId", bookController.getBooksByStatusId);
router.put(
  "/books/:id/status",
  auth,
  checkAdminOrVendor,
  bookController.updateBookStatus
);

module.exports = router;

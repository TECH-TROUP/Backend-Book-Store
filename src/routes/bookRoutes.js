const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const upload = require("../middleware/upload");

// Book routes
router.post(
  "/books",
  auth,
  checkAdmin,
  upload.single("image"),
  bookController.createBook
);
router.put(
  "/books/:id",
  auth,
  checkAdmin,
  upload.single("image"),
  bookController.updateBook
);
router.delete("/books/:id", auth, checkAdmin, bookController.deleteBook);
router.get("/books", bookController.getAllBooks);
router.get("/books/:id", bookController.getBookById);

module.exports = router;

const express = require("express");
const router = express.Router();
const bookCopyController = require("../controllers/bookCopyController");
const auth = require("../middleware/auth");
const checkVendor = require("../middleware/checkVendor");
const checkAdminOrVendor = require("../middleware/checkAdminOrVendor");

// Route to get all copies of a specific book
router.get(
  "/bookcopies/:bookId",
  auth,
  bookCopyController.getBookCopiesByBookId
);
router.get(
  "/bookcopies/:bookId/:statusId",
  auth,
  checkAdminOrVendor,
  bookCopyController.getBookCopiesByBookIdAndStatus
);
router.get(
  "/bookcopies/:bookId/public/:statusId",
  bookCopyController.getBookCopiesByBookIdAndPublicStatus
);

// Update the status of a specific book copy
router.put(
  "/bookCopies/:copyId/status",
  auth,
  checkVendor,
  bookCopyController.updateBookCopyStatus
);

// Delete a specific copy of a book
router.delete(
  "/bookCopies/:copyId",
  auth,
  checkVendor,
  bookCopyController.deleteBookCopy
);

module.exports = router;

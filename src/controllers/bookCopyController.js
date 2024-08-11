const Book = require("../models/Book");
const BookCopy = require("../models/BookCopy");

exports.getBookCopiesByBookId = (req, res) => {
  const bookId = req.params.bookId;

  BookCopy.getByBookId(bookId, (err, bookCopies) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!bookCopies || bookCopies.length === 0) {
      return res
        .status(404)
        .json({ error: "No book copies found for this book" });
    }
    res.status(200).json(bookCopies);
  });
};

exports.getBookCopiesByBookIdAndStatus = (req, res) => {
  const bookId = req.params.bookId;
  const statusId = req.params.statusId;

  BookCopy.getByBookIdAndStatus(bookId, statusId, (err, bookCopies) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(bookCopies);
  });
};

// Public access for specific statuses
exports.getBookCopiesByBookIdAndPublicStatus = (req, res) => {
  const bookId = req.params.bookId;
  const statusId = parseInt(req.params.statusId, 10);

  // Check if the status ID is one of the public statuses (4, 5, or 12)
  if ([4, 5, 12].includes(statusId)) {
    BookCopy.getByBookIdAndStatus(bookId, statusId, (err, bookCopies) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!bookCopies || bookCopies.length === 0) {
        return res.status(404).json({
          error: "No book copies found for this book with the specified status",
        });
      }
      res.status(200).json(bookCopies);
    });
  } else {
    res.status(403).json({ error: "Access to this status is restricted" });
  }
};

// Update the status of a specific book copy
exports.updateBookCopyStatus = (req, res) => {
  const copyId = req.params.copyId;
  const { statusId, previousStatusId, bookId } = req.body;

  if (!statusId || !bookId || !previousStatusId) {
    return res
      .status(400)
      .json({ error: "Please provide valid status IDs and book ID" });
  }

  // Status IDs that should reduce or increase the stock
  const decreaseStockStatuses = [6, 7, 8, 9, 10, 11, 12]; //Checked_out, Rented, Returned, Lost, Damaged, In-Repair, Sold
  const increaseStockStatuses = [4, 5]; //Available-Sale, Available-Rent
  const previousDecreaseStatuses = [...decreaseStockStatuses, 13]; // Checked_out, Rented, Returned, Lost, Damaged, In-Repair, Sold, Out-of-Stock

  let stockChange = 0;

  // Logic to reduce stock if transitioning from 4 or 5 to 6-12
  if (
    increaseStockStatuses.includes(previousStatusId) &&
    decreaseStockStatuses.includes(statusId)
  ) {
    stockChange = -1; // Reduce stock
  }

  // Logic to increase stock if transitioning from 6-13 to 4 or 5
  if (
    previousDecreaseStatuses.includes(previousStatusId) &&
    increaseStockStatuses.includes(statusId)
  ) {
    stockChange = 1; // Increase stock
  }

  BookCopy.updateStatus(copyId, statusId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book copy not found" });
    }

    if (stockChange !== 0) {
      // Update the stock in the books table
      Book.updateStock(bookId, stockChange, (stockErr, stockRes) => {
        if (stockErr) {
          return res.status(500).json({ error: "Failed to update stock" });
        } else {
          // Check the updated stock value
          Book.getById(bookId, (bookErr, bookResult) => {
            if (bookErr) {
              return res
                .status(500)
                .json({ error: "Failed to get book details" });
            }

            const book = bookResult;

            if (book.stock === 0 && book.status_id !== 13) {
              // Update the book status to Out-of-Stock
              Book.updateStatus(bookId, 13, (statusErr, statusRes) => {
                if (statusErr) {
                  console.log(statusErr);
                  return res.status(500).json({
                    error: "Failed to update book status to Out-of-Stock",
                  });
                }

                return res.status(200).json({
                  message:
                    "Book copy status updated successfully and book marked as Out-of-Stock",
                });
              });
            } else if (book.stock > 0 && book.status_id === 13) {
              // If stock is greater than zero and previous status was Out-of-Stock, update status to Approved
              Book.updateStatus(bookId, 2, (statusErr, statusRes) => {
                if (statusErr) {
                  console.log(statusErr);
                  return res.status(500).json({
                    error: "Failed to update book status to Approved",
                  });
                }

                return res.status(200).json({
                  message:
                    "Book copy status updated successfully and book marked as Approved",
                });
              });
            } else {
              return res
                .status(200)
                .json({ message: "Book copy status updated successfully" });
            }
          });
        }
      });
    } else {
      return res
        .status(200)
        .json({ message: "Book copy status updated successfully" });
    }
  });
};

// Delete a specific copy of a book
// exports.deleteBookCopy = (req, res) => {
//   const copyId = req.params.copyId;

//   BookCopy.deleteBookCopy(copyId, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Book copy not found" });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "Book copy deleted successfully" });
//     }
//   });
// };

// Delete a specific copy of a book
exports.deleteBookCopy = (req, res) => {
  const copyId = req.params.copyId;
  const bookId = req.query.bookId;

  if (!bookId) {
    return res.status(400).json({ error: "Please provide the book ID" });
  }

  // Proceed to delete the book copy
  BookCopy.deleteBookCopy(copyId, (deleteErr, deleteResult) => {
    if (deleteErr) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Book copy not found" });
    } else {
      // Update the stock of the corresponding book
      Book.updateStock(bookId, -1, (stockErr, stockResult) => {
        if (stockErr) {
          console.log(stockErr);
          return res.status(500).json({ error: "Failed to update stock" });
        }

        // Check if stock reached 0 and update book status if needed
        Book.getById(bookId, (bookErr, bookResult) => {
          if (bookErr) {
            console.log(bookErr);
            return res
              .status(500)
              .json({ error: "Failed to retrieve book details" });
          }
          if (bookResult.length === 0) {
            return res.status(404).json({ error: "Book not found" });
          }

          const updatedBook = bookResult;
          if (updatedBook.stock <= 0) {
            // Update the book status to out-of-stock (13)
            Book.updateStatus(bookId, 13, (statusErr, statusResult) => {
              if (statusErr) {
                console.log(statusErr);
                return res
                  .status(500)
                  .json({ error: "Failed to update book status" });
              }
              return res.status(200).json({
                message: "Book copy deleted and stock updated successfully",
              });
            });
          } else {
            return res.status(200).json({
              message: "Book copy deleted and stock updated successfully",
            });
          }
        });
      });
    }
  });
};

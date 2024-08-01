const Rental = require("../models/Rental");
const Book = require("../models/Book");

exports.createRental = (req, res) => {
  const { user_id, book_id, rental_date, return_date } = req.body;

  if (!user_id || !book_id || !rental_date) {
    return res.status(400).json({ error: "Please provide required fields" });
  }

  const newRental = {
    user_id,
    book_id,
    rental_date,
    return_date,
  };

  Rental.create(newRental, (err, rentalId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: rentalId });
  });
};

exports.updateRental = (req, res) => {
  const rentalId = req.params.id;
  const { user_id, book_id, rental_date, return_date } = req.body;

  const updatedRental = {
    user_id,
    book_id,
    rental_date,
    return_date,
  };

  Rental.update(rentalId, updatedRental, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Rental not found" });
    } else {
      res.status(200).send({ message: "Rental updated successfully" });
    }
  });
};

exports.deleteRental = (req, res) => {
  const rentalId = req.params.id;

  Rental.delete(rentalId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Rental not found" });
    } else {
      res.status(200).send({ message: "Rental deleted successfully" });
    }
  });
};

exports.getAllRentals = (req, res) => {
  Rental.getAll((err, rentals) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(rentals);
  });
};

exports.getRentalById = (req, res) => {
  const rentalId = req.params.id;

  Rental.getById(rentalId, (err, rental) => {
    if (err) res.status(500).send(err);
    else if (!rental) {
      res.status(404).send({ error: "Rental not found" });
    } else {
      res.status(200).send(rental);
    }
  });
};

exports.getRentalsByUserId = (req, res) => {
  const userId = req.params.userId;

  Rental.getByUserId(userId, (err, rentals) => {
    if (err) res.status(500).send(err);
    else if (rentals.length === 0) {
      res.status(404).send({ error: "No rentals found for this user ID" });
    } else {
      res.status(200).send(rentals);
    }
  });
};

exports.getRentalsByBookId = (req, res) => {
  const bookId = req.params.bookId;

  Rental.getByBookId(bookId, (err, rentals) => {
    if (err) res.status(500).send(err);
    else if (rentals.length === 0) {
      res.status(404).send({ error: "No rentals found for this book ID" });
    } else {
      res.status(200).send(rentals);
    }
  });
};

exports.returnBook = (req, res) => {
  const rentalId = req.params.id;
  const returnDate = new Date(); // Current date and time

  // Update the rental record
  Rental.return(rentalId, returnDate, (err, result) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Rental record not found" });

    // Retrieve the book ID from the rental record
    Rental.getBookIdByRentalId(rentalId, (err, rental) => {
      if (err) return res.status(500).json({ error: "Internal server error" });
      if (!rental)
        return res.status(404).json({ error: "Rental record not found" });

      const bookId = rental.book_id;

      // Update book availability
      Book.updateAvailability(bookId, true, (err, result) => {
        if (err)
          return res.status(500).json({ error: "Internal server error" });

        res.status(200).json({ message: "Book returned successfully" });
      });
    });
  });
};

const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Rental routes
router.post("/rentals", auth, checkAdmin, rentalController.createRental);
router.put("/rentals/:id", auth, checkAdmin, rentalController.updateRental);
router.delete("/rentals/:id", auth, checkAdmin, rentalController.deleteRental);
router.get("/rentals", auth, checkAdmin, rentalController.getAllRentals);
router.get("/rentals/:id", auth, checkAdmin, rentalController.getRentalById);
router.get(
  "/rentals/by-user/:userId",
  auth,
  checkAdmin,
  rentalController.getRentalsByUserId
);
router.get(
  "/rentals/by-book/:bookId",
  auth,
  checkAdmin,
  rentalController.getRentalsByBookId
);
router.put("/rentals/return/:id", auth, rentalController.returnBook);

module.exports = router;

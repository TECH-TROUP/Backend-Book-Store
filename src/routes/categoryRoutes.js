const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// Category routes
router.post("/categories", auth, checkAdmin, categoryController.createCategory);
router.put(
  "/categories/:id",
  auth,
  checkAdmin,
  categoryController.updateCategory
);
router.delete(
  "/categories/:id",
  auth,
  checkAdmin,
  categoryController.deleteCategory
);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);

module.exports = router;

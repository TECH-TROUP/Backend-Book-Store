const Category = require("../models/Category");

// Create a new category
exports.createCategory = (req, res) => {
  const { category_name, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const newCategory = { category_name, description, count: 0 };

  Category.create(newCategory, (err, categoryId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: categoryId });
  });
};

// Update a category
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { category_name, description } = req.body;

  if (!category_name && !description) {
    return res
      .status(400)
      .json({
        error:
          "At least one field (category_name or description) is required to update",
      });
  }

  const updatedCategory = { category_name, description };

  Category.update(categoryId, updatedCategory, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res.status(200).send({ message: "Category updated successfully" });
    }
  });
};

// Delete a category
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  Category.delete(categoryId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res.status(200).send({ message: "Category deleted successfully" });
    }
  });
};

// Get all categories
exports.getAllCategories = (req, res) => {
  Category.getAll((err, categories) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(categories);
  });
};

// Get a specific category by ID
exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id;

  Category.getById(categoryId, (err, category) => {
    if (err) res.status(500).send(err);
    else if (!category) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res.status(200).send(category);
    }
  });
};

// Increment count
exports.incrementCategoryCount = (req, res) => {
  const categoryId = req.params.id;

  Category.incrementCount(categoryId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res
        .status(200)
        .send({ message: "Category count incremented successfully" });
    }
  });
};

// Decrement count
exports.decrementCategoryCount = (req, res) => {
  const categoryId = req.params.id;

  Category.decrementCount(categoryId, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res
        .status(200)
        .send({ message: "Category count decremented successfully" });
    }
  });
};

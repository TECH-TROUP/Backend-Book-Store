const Category = require("../models/Category");

exports.createCategory = (req, res) => {
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const newCategory = { category_name };

  Category.create(newCategory, (err, categoryId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: categoryId });
  });
};

exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { category_name } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const updatedCategory = { category_name };

  Category.update(categoryId, updatedCategory, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.affectedRows === 0) {
      res.status(404).send({ error: "Category not found" });
    } else {
      res.status(200).send({ message: "Category updated successfully" });
    }
  });
};

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

exports.getAllCategories = (req, res) => {
  Category.getAll((err, categories) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(categories);
  });
};

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

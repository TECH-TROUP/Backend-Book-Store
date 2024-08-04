const db = require("../config/db");

const Category = {};

// Create a new category
Category.create = (category, callback) => {
  const query =
    "INSERT INTO categories (category_name, description, count) VALUES (?, ?, ?)";
  db.query(
    query,
    [category.category_name, category.description, category.count || 0],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

// Update a category
Category.update = (categoryId, updatedCategory, callback) => {
  const query =
    "UPDATE categories SET category_name = ?, description = ? WHERE id = ?";
  db.query(
    query,
    [updatedCategory.category_name, updatedCategory.description, categoryId],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

// Delete a category
Category.delete = (categoryId, callback) => {
  const query = "DELETE FROM categories WHERE id = ?";
  db.query(query, [categoryId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Get all categories
Category.getAll = (callback) => {
  const query = "SELECT * FROM categories";
  db.query(query, (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

// Get a specific category by ID
Category.getById = (categoryId, callback) => {
  const query = "SELECT * FROM categories WHERE id = ?";
  db.query(query, [categoryId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row);
  });
};

// Increment count
Category.incrementCount = (categoryId, callback) => {
  const query = "UPDATE categories SET count = count + 1 WHERE id = ?";
  db.query(query, [categoryId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

// Decrement count
Category.decrementCount = (categoryId, callback) => {
  const query =
    "UPDATE categories SET count = count - 1 WHERE id = ? AND count > 0";
  db.query(query, [categoryId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

module.exports = Category;

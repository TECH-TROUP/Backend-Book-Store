const db = require("../config/db");

const User = {};

User.create = (user, callback) => {
  const query =
    "INSERT INTO `book_store_db`.`users` (`name`, `username`, `password`, `email`) VALUES (?,?,?,?)";
  db.query(
    query,
    [user.name, user.username, user.password, user.email],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res.insertId);
    }
  );
};

User.existsByUsername = (username, callback) => {
  const query =
    "SELECT COUNT(*) as count FROM `book_store_db`.`users` WHERE username = ?";
  db.query(query, [username], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0].count > 0);
  });
};

User.existsByEmail = (email, callback) => {
  const query =
    "SELECT COUNT(*) as count FROM `book_store_db`.`users` WHERE email = ?";
  db.query(query, [email], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0].count > 0);
  });
};

User.getByUsername = (username, callback) => {
  const query = "SELECT * FROM `book_store_db`.`users` WHERE username = ?";
  db.query(query, [username], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0]);
  });
};

User.getById = (userId, callback) => {
  const query =
    "SELECT id, name, username, email, role_id FROM `book_store_db`.`users` WHERE id = ?";
  db.query(query, [userId], (err, row) => {
    if (err) callback(err, null);
    else callback(null, row[0]);
  });
};

User.delete = (userId, callback) => {
  const query = "DELETE FROM `book_store_db`.`users` WHERE (`id` = ?)";
  db.query(query, [userId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

User.update = (userId, updatedUser, callback) => {
  let query = "UPDATE `book_store_db`.`users` SET";
  const params = [];

  if (updatedUser.name) {
    query += " `name` = ?,";
    params.push(updatedUser.name);
  }
  if (updatedUser.username) {
    query += " `username` = ?,";
    params.push(updatedUser.username);
  }
  if (updatedUser.password) {
    query += " `password` = ?,";
    params.push(updatedUser.password);
  }

  query = query.slice(0, -1) + " WHERE `id` = ?";
  params.push(userId);

  db.query(query, params, (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

User.updateRole = (userId, roleId, callback) => {
  let query = "UPDATE `book_store_db`.`users` SET `role_id` = ? WHERE `id` = ?";

  const params = [roleId, userId];

  // Execute the query
  db.query(query, params, (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

User.getByRoleId = (roleId, callback) => {
  const query =
    "SELECT id, name, username, email, role_id FROM `book_store_db`.`users` WHERE `role_id` = ?";
  db.query(query, [roleId], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows);
  });
};

module.exports = User;

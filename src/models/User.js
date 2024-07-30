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

User.getByUsername = (username, callback) => {
  const query = "SELECT * FROM `book_store_db`.`users` WHERE username = ?";
  db.query(query, [username], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0]);
  });
};

User.getById = (userId, callback) => {
  const query = "SELECT * FROM `book_store_db`.`users` WHERE id = ?";
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
  const query =
    "UPDATE `book_store_db`.`users` SET `name` = ?, `username` = ?, `password` = ? WHERE `id` = ?";

  db.query(
    query,
    [updatedUser.name, updatedUser.username, updatedUser.password, userId],
    (err, res) => {
      if (err) callback(err, null);
      else callback(null, res);
    }
  );
};

module.exports = User;

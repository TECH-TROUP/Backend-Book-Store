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

User.getByUsername = (username, callback) => {
  const query = "SELECT * FROM `book_store_db`.`users` WHERE username = ?";
  db.query(query, [username], (err, rows) => {
    if (err) callback(err, null);
    else callback(null, rows[0]);
  });
};

User.delete = (userId, callback) => {
  const query = "DELETE FROM `book_store_db`.`users` WHERE (`id` = ?)";
  db.query(query, [userId], (err, res) => {
    if (err) callback(err, null);
    else callback(null, res);
  });
};

module.exports = User;

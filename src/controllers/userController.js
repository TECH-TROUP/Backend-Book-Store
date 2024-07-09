const User = require("../models/User");

exports.createUser = (req, res) => {
  const newUser = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  User.create(newUser, (err, userId) => {
    if (err) res.status(500).send(err);
    else res.status(201).send({ id: userId });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.delete(userId, (err, result) => {
    if (err) {
      res.status(500).send({ error: "Error deleting user" });
    } else if (result.affectedRows === 0) {
      res.status(404).send({ error: "User not found" });
    } else {
      res.status(200).send({ message: "User deleted successfully" });
    }
  });
};

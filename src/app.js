const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");

// const crypto = require("crypto");
// const secret = crypto.randomBytes(64).toString("hex");
// console.log(secret);

const app = express();
app.use(bodyParser.json());

app.use("/api", userRoutes);

module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

// const crypto = require("crypto");
// const secret = crypto.randomBytes(64).toString("hex");
// console.log(secret);

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api", userRoutes);

module.exports = app;

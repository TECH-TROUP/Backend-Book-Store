const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookCopyRoutes = require("./routes/bookCopyRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");

const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", bookCopyRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);
app.use("/api", orderItemRoutes);
app.use("/api", rentalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", cartRoutes);

module.exports = app;

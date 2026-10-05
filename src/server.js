require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AnhPNM-WEB99-MIDTERM REST API"
  });
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value",
      errors: error.keyValue
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Cannot start server:", error.message);
    process.exit(1);
  });

module.exports = app;

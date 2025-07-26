require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const commentRoutes = require("./routes/comments");
const replyRoutes = require("./routes/replies");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Global middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/replies", replyRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

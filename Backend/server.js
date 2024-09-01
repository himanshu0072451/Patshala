const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors"); // Import CORS middleware
const cookieParser = require("cookie-parser");
const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(cookieParser());

// CORS middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB Config
const db = config.get("mongoURI");

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

// Define Routes
app.use("/api/students", require("./routes/studentAuth"));
app.use("/api/teachers", require("./routes/teacherAuth"));
app.use("/api", require("./routes/notesRoutes"));
app.use("/api/protected", require("./routes/ProtectedRoute"));

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

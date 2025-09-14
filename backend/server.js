const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/userRoutes");
// (Later you can add: userRoutes, productRoutes, etc.)

const app = express();

// ================== Middleware ==================
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// ================== Routes ==================
app.get("/", (req, res) => {
  res.send("🚀 MERN Fitness Backend is running...");
});

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// Example:
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);

// ================== MongoDB Connection ==================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================== Error Handling ==================
// 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// General Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

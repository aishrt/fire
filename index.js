const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { validationResult } = require("express-validator");
require("dotenv").config();

const trackingRoutes = require("./src/routes/trackingRoutes");
const discountRoutes = require("./src/routes/discountRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Request validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.use(express.json());
app.use(limiter);
app.use(validateRequest);

// Routes
app.use("/api", trackingRoutes);
app.use("/api", discountRoutes);
app.use("/api", categoryRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
  });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Firebase Node.js Server is running!");
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

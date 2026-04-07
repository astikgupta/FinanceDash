const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Required for Swagger and remote scripts
}));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: 1000, // Increased for development
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

const authRouter = require("./routes/authRoutes");
const recordRouter = require("./routes/recordRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const userRouter = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

// Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/records", recordRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/users", userRouter);

// Error Handling
app.use(errorHandler);

module.exports = app;

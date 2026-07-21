require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Routes
const buyerRoutes = require("./routes/buyerRoutes");
const recommendationRoutes = require(
  "./routes/recommendationRoutes"
);
const notificationRoutes = require(
  "./routes/notificationRoutes"
);
const propertyRoutes = require(
  "./routes/propertyRoutes"
);
const enquiryRoutes = require(
  "./routes/enquiryRoutes"
);
const authRoutes = require(
  "./routes/authRoutes"
);
const aiRoutes = require(
  "./routes/aiRoutes"
);

const app = express();

// ==========================================
// SECURITY HEADERS
// ==========================================

app.use(helmet());

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without browser origin,
      // for example Thunder Client.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// REQUEST BODY LIMIT
// ==========================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// ==========================================
// GENERAL API RATE LIMIT
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 200,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ==========================================
// STRICT LOGIN RATE LIMIT
// ==========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again later.",
  },
});

app.use(
  "/api/auth/login",
  loginLimiter
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Mahadev Developer API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/properties",
  propertyRoutes
);

app.use(
  "/api/enquiries",
  enquiryRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/buyers",
  buyerRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error(
    "Server Error:",
    error.message
  );

  // CORS error
  if (
    error.message ===
    "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  res.status(
    error.status || 500
  ).json({
    success: false,

    message:
      process.env.NODE_ENV ===
      "production"
        ? "Internal server error"
        : error.message,
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Required environment variables
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing"
      );
    }

    // Connect database first
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Server Startup Error:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
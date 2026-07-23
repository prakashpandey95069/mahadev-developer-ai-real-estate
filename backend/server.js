require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ==========================================
// ROUTES
// ==========================================

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
  // Local frontend
  "http://localhost:5173",

  // Production frontend
  "https://mahadev-developer.vercel.app",

  // Render environment variable
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin
    // Example: Postman, Thunder Client
    if (!origin) {
      return callback(null, true);
    }

    // Allow configured frontend URLs
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(
      "Blocked CORS Origin:",
      origin
    );

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
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};

// Enable CORS
app.use(cors(corsOptions));

// ==========================================
// REQUEST BODY
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

app.use(
  "/api",
  apiLimiter
);

// ==========================================
// LOGIN RATE LIMIT
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
// HEALTH CHECK ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Mahadev Developer API is running",
  });
});

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      status: "healthy",
    });
  }
);

// ==========================================
// API ROUTES
// ==========================================

// Recommendations
app.use(
  "/api/recommendations",
  recommendationRoutes
);

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Properties
app.use(
  "/api/properties",
  propertyRoutes
);

// Enquiries
app.use(
  "/api/enquiries",
  enquiryRoutes
);

// AI Chatbot
app.use(
  "/api/ai",
  aiRoutes
);

// Buyers
app.use(
  "/api/buyers",
  buyerRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        "API endpoint not found",
    });
  }
);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
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
        message:
          "Origin not allowed",
      });
    }

    return res
      .status(
        error.status || 500
      )
      .json({
        success: false,

        message:
          process.env.NODE_ENV ===
          "production"
            ? "Internal server error"
            : error.message,
      });
  }
);

// ==========================================
// SERVER PORT
// ==========================================

const PORT =
  process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // Check MongoDB URL
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing"
      );
    }

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing"
      );
    }

    // Connect MongoDB
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    // Start Express Server
    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          "Allowed CORS Origins:",
          allowedOrigins
        );
      }
    );
  } catch (error) {
    console.error(
      "Server Startup Error:",
      error.message
    );

    process.exit(1);
  }
};

// Start application
startServer();
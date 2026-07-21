const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
  try {
    // Server configuration check
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Authorization header
    const authorization = req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login.",
      });
    }

    // Extract token
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verify role
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Make authenticated admin available
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();

  } catch (error) {

    // Expired token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    console.error(
      "Authentication Middleware Error:",
      error
    );

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = protectAdmin;
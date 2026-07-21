const express = require("express");

const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const protectAdmin = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// Get all notifications
router.get(
  "/",
  protectAdmin,
  getNotifications
);

// Mark notification as read
router.patch(
  "/:id/read",
  protectAdmin,
  markAsRead
);

module.exports = router;
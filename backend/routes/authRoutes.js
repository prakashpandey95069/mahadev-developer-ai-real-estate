const express = require("express");

const {
  adminLogin,
} = require("../controllers/authController");

const router = express.Router();

// ==========================================
// ADMIN LOGIN
// Public route
// ==========================================

router.post(
  "/login",
  adminLogin
);

// ==========================================
// ADMIN REGISTRATION DISABLED
// Admin already created in database.
// Never expose public admin registration.
// ==========================================

// router.post("/register", registerAdmin);

module.exports = router;
const express = require("express");

const {
  adminLogin,
  registerAdmin,
} = require("../controllers/authController");

const router = express.Router();

// TEMPORARY: first production admin create karne ke liye
router.post("/register", registerAdmin);

// Admin login
router.post("/login", adminLogin);

module.exports = router;
const express = require("express");

const {
  adminLogin,
  registerAdmin,
} = require("../controllers/authController");

const router = express.Router();

// TEMPORARY - admin create karne ke baad remove karna hai
router.post("/register", registerAdmin);

router.post("/login", adminLogin);

module.exports = router;
const express = require("express");

const {
  addBuyerRequirement,
  getBuyers,
  findMatches,
} = require("../controllers/buyerController");

const protectAdmin = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Customer apni property requirement submit karega
router.post(
  "/",
  addBuyerRequirement
);

// Customer apni matching properties dekh sakta hai
router.get(
  "/:id/matches",
  findMatches
);

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// Sirf admin sabhi buyer requirements dekh sakta hai
router.get(
  "/",
  protectAdmin,
  getBuyers
);

module.exports = router;
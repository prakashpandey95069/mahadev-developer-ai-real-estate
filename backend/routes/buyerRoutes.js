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
// PUBLIC ROUTE
// Customer apni property requirement submit karega
// ==========================================

router.post(
  "/",
  addBuyerRequirement
);

// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// Get all buyer requirements
router.get(
  "/",
  protectAdmin,
  getBuyers
);

// Find property matches for a specific buyer
router.get(
  "/:id/matches",
  protectAdmin,
  findMatches
);

module.exports = router;
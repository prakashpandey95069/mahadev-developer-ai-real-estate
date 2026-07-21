const express = require("express");

const {
  getProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// Koi bhi properties dekh sakta hai
// ==========================================

router.get("/", getProperties);

router.get("/:id", getPropertyById);


// ==========================================
// ADMIN PROTECTED ROUTES
// Login + valid JWT required
// ==========================================

// Add property
router.post(
  "/",
  protectAdmin,
  addProperty
);

// Update property
router.put(
  "/:id",
  protectAdmin,
  updateProperty
);

// Delete property
router.delete(
  "/:id",
  protectAdmin,
  deleteProperty
);

module.exports = router;
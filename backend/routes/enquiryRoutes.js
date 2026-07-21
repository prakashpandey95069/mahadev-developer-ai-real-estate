const express = require("express");

const {
  addEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const protectAdmin = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// ==========================================
// PUBLIC ROUTE
// Customer enquiry submit kar sakta hai
// ==========================================

router.post("/", addEnquiry);


// ==========================================
// ADMIN PROTECTED ROUTES
// ==========================================

// Get all enquiries
router.get(
  "/",
  protectAdmin,
  getEnquiries
);

// Update enquiry status
router.patch(
  "/:id/status",
  protectAdmin,
  updateEnquiryStatus
);

// Delete enquiry
router.delete(
  "/:id",
  protectAdmin,
  deleteEnquiry
);

module.exports = router;
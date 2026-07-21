const Enquiry = require("../models/Enquiry");

// Add enquiry
const addEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to submit enquiry",
      error: error.message,
    });
  }
};

// Get all enquiries
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch enquiries",
      error: error.message,
    });
  }
};

// Update enquiry status
const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      enquiry,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to update status",
      error: error.message,
    });
  }
};

// Delete enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(
      req.params.id
    );

    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete enquiry",
      error: error.message,
    });
  }
};

module.exports = {
  addEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
const mongoose = require("mongoose");

const buyerRequirementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    propertyType: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    minArea: {
      type: Number,
      default: 0,
    },

    maxArea: {
      type: Number,
      default: 0,
    },

    // Lead scoring
    leadScore: {
      type: Number,
      default: 0,
    },

    leadType: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Cold",
    },

    // Buyer lifecycle
    status: {
      type: String,
      enum: [
        "New",
        "Matched",
        "Watchlist",
        "Contacted",
        "Closed",
      ],
      default: "New",
    },

    // Best matched property
    matchedProperty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    bestMatchScore: {
      type: Number,
      default: 0,
    },

    lastMatchedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BuyerRequirement",
  buyerRequirementSchema
);
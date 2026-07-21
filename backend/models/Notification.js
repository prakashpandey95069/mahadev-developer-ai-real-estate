const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "NEW_BUYER",
        "PROPERTY_MATCH",
        "NEW_PROPERTY_MATCH",
        "FOLLOW_UP",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyerRequirement",
      default: null,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);
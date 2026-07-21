
const {
  matchNewPropertyWithBuyers,
} = require("../services/autoMatchingService");

const Property = require("../models/Property");
const geocodeLocation = async (location) => {
  try {
    const query = `${location}, Gorakhpur, Uttar Pradesh, India`;

    const url =
      `https://nominatim.openstreetmap.org/search` +
      `?format=json&limit=1&q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MahadevDeveloperPropertyWebsite/1.0",
      },
    });

    if (!response.ok) {
      throw new Error("Geocoding API request failed");
    }

    const data = await response.json();

    if (!data.length) {
      return null;
    }

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
      formattedAddress: data[0].display_name,
    };
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    return null;
  }
};

// GET ALL PROPERTIES
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch properties",
      error: error.message,
    });
  }
};

// GET SINGLE PROPERTY
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch property",
      error: error.message,
    });
  }
};

// ADD PROPERTY
const addProperty = async (req, res) => {
  try {
    // Address se automatic coordinates
    const coordinates = await geocodeLocation(
      req.body.location
    );

    // Property save
    const property = await Property.create({
      ...req.body,

      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,

      formattedAddress:
        coordinates?.formattedAddress || req.body.location,
    });

    // Buyer watchlist ke saath automatic matching
    try {
      await matchNewPropertyWithBuyers(property);
    } catch (matchingError) {
      console.error(
        "Automatic Matching Error:",
        matchingError.message
      );
    }

    res.status(201).json({
      success: true,
      message: coordinates
        ? "Property added and mapped successfully"
        : "Property added, but map location could not be found",
      property,
    });
  } catch (error) {
    console.error(
      "Add Property Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to add property",
      error: error.message,
    });
  }
};

// UPDATE PROPERTY
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property,
    });
  } catch (error) {
    res.status(400).json({
      message: "Unable to update property",
      error: error.message,
    });
  }
};

// DELETE PROPERTY
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete property",
      error: error.message,
    });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
};
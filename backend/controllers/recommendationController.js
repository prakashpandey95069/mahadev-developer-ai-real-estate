const Property = require("../models/Property");

const recommendProperties = async (req, res) => {
  try {
    const {
      location,
      budget,
      propertyType
    } = req.body;

    const properties = await Property.find();

    // Har property ko matching score denge
    const recommendations = properties.map((property) => {

      let score = 0;
      const reasons = [];

      // Location Match
      if (
        location &&
        property.location
          ?.toLowerCase()
          .includes(location.toLowerCase())
      ) {
        score += 40;
        reasons.push("Location matches your requirement");
      }

      // Property Type Match
      if (
        propertyType &&
        property.propertyType === propertyType
      ) {
        score += 30;
        reasons.push("Property type matches");
      }

      // Budget Match
      if (
        budget &&
        Number(property.price) <= Number(budget)
      ) {
        score += 30;
        reasons.push("Property is within your budget");
      }

      return {
        ...property.toObject(),
        matchScore: score,
        matchReasons: reasons,
      };

    });

    // Zero matching properties remove karo
    const filteredProperties = recommendations
      .filter((property) => property.matchScore > 0)

      // Highest score sabse upar
      .sort(
        (a, b) =>
          b.matchScore - a.matchScore
      );

    res.status(200).json({
      success: true,
      totalMatches: filteredProperties.length,
      recommendations: filteredProperties,
    });

  } catch (error) {

    console.error(
      "Recommendation Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to recommend properties",
    });

  }
};

module.exports = {
  recommendProperties,
};
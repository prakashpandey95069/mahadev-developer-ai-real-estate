const BuyerRequirement =
  require("../models/BuyerRequirement");

const Property =
  require("../models/Property");

const Notification =
  require("../models/Notification");

const {
  calculatePropertyMatch,
} = require(
  "../services/matchingService"
);

const {
  calculateLeadScore,
} = require(
  "../services/leadScoringService"
);


// =====================================
// ADD BUYER
// =====================================

const addBuyerRequirement = async (
  req,
  res
) => {
  try {

    // Calculate lead score
    const lead =
      calculateLeadScore(req.body);

    // Save buyer
    const buyer =
      await BuyerRequirement.create({
        ...req.body,

        leadScore:
          lead.score,

        leadType:
          lead.leadType,
      });


    // Find all properties
    const properties =
      await Property.find();


    // Calculate matches
    const matches =
      properties
        .map((property) => {

          const result =
            calculatePropertyMatch(
              buyer,
              property
            );

          return {

            property,

            matchScore:
              result.score,

            matchReasons:
              result.reasons,

          };

        })

        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        );


    // Best match
    const bestMatch =
      matches[0];


    // Good match found
    if (
      bestMatch &&
      bestMatch.matchScore >= 70
    ) {

      buyer.status =
        "Matched";

      buyer.matchedProperty =
        bestMatch.property._id;

      buyer.bestMatchScore =
        bestMatch.matchScore;

      buyer.lastMatchedAt =
        new Date();


      await buyer.save();


      // Create notification
      await Notification.create({

        type:
          "PROPERTY_MATCH",

        title:
          "New Property Match",

        message:
          `${buyer.name} has a ${bestMatch.matchScore}% property match.`,

        buyer:
          buyer._id,

        property:
          bestMatch.property._id,

      });


    } else {

      // No strong match
      buyer.status =
        "Watchlist";

      buyer.lastMatchedAt =
        new Date();

      await buyer.save();

    }


    // New buyer notification
    await Notification.create({

      type:
        "NEW_BUYER",

      title:
        "New Buyer Lead",

      message:
        `${buyer.name} submitted a new property requirement. Lead: ${buyer.leadType}`,

      buyer:
        buyer._id,

    });


    res.status(201).json({

      success: true,

      message:
        "Buyer requirement processed successfully",

      buyer,

      matches:
        matches
          .filter(
            (item) =>
              item.matchScore >= 50
          )
          .map((item) => ({

            ...item.property.toObject(),

            matchScore:
              item.matchScore,

            matchReasons:
              item.matchReasons,

          })),

    });


  } catch (error) {

    console.error(
      "Buyer Automation Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Unable to process buyer requirement",

    });

  }
};


// =====================================
// GET BUYERS
// =====================================

const getBuyers = async (
  req,
  res
) => {
  try {

    const buyers =
      await BuyerRequirement.find()

        .populate(
          "matchedProperty"
        )

        .sort({
          createdAt: -1,
        });


    res.json({

      success: true,

      buyers,

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Unable to fetch buyers",

    });

  }
};


// =====================================
// FIND MATCHES
// =====================================

const findMatches = async (
  req,
  res
) => {
  try {

    const buyer =
      await BuyerRequirement.findById(
        req.params.id
      );


    if (!buyer) {

      return res.status(404).json({

        success: false,

        message:
          "Buyer not found",

      });

    }


    const properties =
      await Property.find();


    const matches =
      properties

        .map((property) => {

          const result =
            calculatePropertyMatch(
              buyer,
              property
            );


          return {

            ...property.toObject(),

            matchScore:
              result.score,

            matchReasons:
              result.reasons,

          };

        })

        .filter(
          (property) =>
            property.matchScore >= 50
        )

        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        );


    res.json({

      success: true,

      buyer,

      totalMatches:
        matches.length,

      matches,

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Unable to find matches",

    });

  }
};


module.exports = {

  addBuyerRequirement,

  getBuyers,

  findMatches,

};
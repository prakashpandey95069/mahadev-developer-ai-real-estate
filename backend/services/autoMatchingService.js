const BuyerRequirement = require("../models/BuyerRequirement");
const Notification = require("../models/Notification");

const {
  calculatePropertyMatch,
} = require("./matchingService");

const matchNewPropertyWithBuyers =
  async (property) => {

    try {

      // Watchlist buyers fetch karo
      const buyers =
        await BuyerRequirement.find({

          status: {
            $in: [
              "Watchlist",
              "New",
            ],
          },

        });


      for (
        const buyer of buyers
      ) {

        const result =
          calculatePropertyMatch(
            buyer,
            property
          );


        // Strong match
        if (
          result.score >= 70
        ) {

          buyer.status =
            "Matched";

          buyer.matchedProperty =
            property._id;

          buyer.bestMatchScore =
            result.score;

          buyer.lastMatchedAt =
            new Date();


          await buyer.save();


          await Notification.create({

            type:
              "NEW_PROPERTY_MATCH",

            title:
              "New Property Matched",

            message:
              `New property "${property.title}" is a ${result.score}% match for ${buyer.name}.`,

            buyer:
              buyer._id,

            property:
              property._id,

          });


          console.log(
            `AUTO MATCH: ${buyer.name} -> ${property.title} (${result.score}%)`
          );

        }

      }


    } catch (error) {

      console.error(
        "Automatic Matching Error:",
        error
      );

    }

  };

module.exports = {
  matchNewPropertyWithBuyers,
};
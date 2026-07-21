const Notification =
  require("../models/Notification");


const getNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find()

          .populate(
            "buyer",
            "name phone leadType"
          )

          .populate(
            "property",
            "title location price"
          )

          .sort({
            createdAt: -1,
          });


      res.json({

        success: true,

        notifications,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          "Unable to fetch notifications",

      });

    }

  };


const markAsRead =
  async (req, res) => {

    try {

      await Notification.findByIdAndUpdate(

        req.params.id,

        {
          isRead: true,
        }

      );


      res.json({

        success: true,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

      });

    }

  };


module.exports = {

  getNotifications,

  markAsRead,

};
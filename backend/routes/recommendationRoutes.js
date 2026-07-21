const express = require("express");

const {
  recommendProperties,
} = require(
  "../controllers/recommendationController"
);

const router = express.Router();

router.post(
  "/",
  recommendProperties
);

module.exports = router;
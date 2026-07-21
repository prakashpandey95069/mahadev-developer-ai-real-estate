const calculateLeadScore = (buyer) => {
  let score = 0;

  // Budget provided
  if (
    buyer.budget &&
    Number(buyer.budget) > 0
  ) {
    score += 30;
  }

  // Exact location provided
  if (
    buyer.location &&
    buyer.location.trim().length > 2
  ) {
    score += 25;
  }

  // Property type selected
  if (buyer.propertyType) {
    score += 20;
  }

  // Area requirement provided
  if (
    Number(buyer.minArea) > 0 ||
    Number(buyer.maxArea) > 0
  ) {
    score += 15;
  }

  // Phone available
  if (buyer.phone) {
    score += 10;
  }

  let leadType = "Cold";

  if (score >= 80) {
    leadType = "Hot";
  } else if (score >= 50) {
    leadType = "Warm";
  }

  return {
    score,
    leadType,
  };
};

module.exports = {
  calculateLeadScore,
};
const calculatePropertyMatch = (
  buyer,
  property
) => {
  let score = 0;
  const reasons = [];

  // LOCATION - 35 POINTS
  if (
    buyer.location &&
    property.location &&
    property.location
      .toLowerCase()
      .includes(
        buyer.location.toLowerCase()
      )
  ) {
    score += 35;

    reasons.push(
      "Preferred location matched"
    );
  }

  // PROPERTY TYPE - 30 POINTS
  if (
    buyer.propertyType ===
    property.propertyType
  ) {
    score += 30;

    reasons.push(
      "Property type matched"
    );
  }

  // BUDGET - 25 POINTS
  if (
    Number(property.price) <=
    Number(buyer.budget)
  ) {
    score += 25;

    reasons.push(
      "Within buyer budget"
    );
  }

  // AREA - 10 POINTS
  const area =
    Number(property.area);

  const minArea =
    Number(buyer.minArea || 0);

  const maxArea =
    Number(buyer.maxArea || 0);

  if (
    area >= minArea &&
    (
      maxArea === 0 ||
      area <= maxArea
    )
  ) {
    score += 10;

    reasons.push(
      "Area requirement matched"
    );
  }

  return {
    score,
    reasons,
  };
};

module.exports = {
  calculatePropertyMatch,
};
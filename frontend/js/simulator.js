// Engine ຄິດໄລ່ທາງການເງິນ ແລະ ຈຸດກຸ້ມທຶນ
function calculateEconomics(params) {
  const { price, cogs, discountPct, baselineUnits, liftPct, mktgCost } = params;

  const discountAmount = price * (discountPct / 100);
  const promoPrice = price - discountAmount;
  const promoUnitMargin = promoPrice - cogs;
  const normalUnitMargin = price - cogs;
  const baseGrossProfit = baselineUnits * normalUnitMargin;

  // ຄິດໄລ່ Break-Even Units
  let beUnits = 0;
  if (promoUnitMargin > 0) {
    beUnits = Math.ceil((baseGrossProfit + mktgCost) / promoUnitMargin);
  } else {
    beUnits = 999999;
  }

  const projectedUnits = Math.round(baselineUnits * (1 + liftPct / 100));
  const projectedRevenue = projectedUnits * promoPrice;
  const projectedGP = projectedUnits * promoUnitMargin;
  const netContribution = projectedGP - mktgCost;

  return {
    discountAmount,
    promoPrice,
    promoUnitMargin,
    baseGrossProfit,
    beUnits,
    projectedUnits,
    projectedRevenue,
    projectedGP,
    netContribution,
    isMarginNegative: promoUnitMargin <= 0,
    isBelowBreakEven: projectedUnits < beUnits
  };
}

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ເປີດໃຫ້ບໍລິການໄຟລ໌ Frontend static
app.use(express.static(path.join(__dirname, '../frontend')));

// --- MOCK DATABASE ---
const campaigns = [
  {
    campaign_code: "LD-2026-1010",
    name: "10.10 Matcha Day Special",
    objective: "SALES_LIFT",
    status: "RUNNING",
    start_date: "2026-10-10",
    product: "Matcha Latte",
    baseline_units: 40,
    actual_units: 103,
    gross_sales: 3244500,
    discount_cost: 1390500,
    cogs: 1545000,
    gross_profit: 1699500,
    mktg_cost: 150000,
    net_contribution: 1549500
  }
];

const posTransactions = [
  { id: "POS-99421", time: "14:22:04", items: "2x Matcha Latte, 1x Canele", net: 88000, campaign: "LD-2026-1010", confidence: "HIGH" },
  { id: "POS-99420", time: "14:18:11", items: "1x Iced Americano", net: 30000, campaign: "NONE", confidence: "N/A" },
  { id: "POS-99419", time: "14:11:55", items: "1x Matcha Latte", net: 31500, campaign: "LD-2026-1010", confidence: "HIGH" }
];

// --- REST API ROUTES ---

// 1. ດຶງຂໍ້ມູນລາຍການ Campaign
app.get('/api/campaigns', (req, res) => {
  res.json({ success: true, data: campaigns });
});

// 2. ຈຳລອງໂປຣໂມຊັ່ນ (Simulator Calculation API)
app.post('/api/campaigns/simulate', (req, res) => {
  const { price, cogs, discount_pct, baseline_units, lift_pct, mktg_cost } = req.body;

  const discountAmount = price * (discount_pct / 100);
  const promoPrice = price - discountAmount;
  const promoMargin = promoPrice - cogs;
  const baseMargin = price - cogs;
  const baseGP = baseline_units * baseMargin;

  let breakEvenUnits = 0;
  if (promoMargin > 0) {
    breakEvenUnits = Math.ceil((baseGP + mktg_cost) / promoMargin);
  } else {
    breakEvenUnits = 999999;
  }

  const projUnits = Math.round(baseline_units * (1 + lift_pct / 100));
  const projGP = projUnits * promoMargin;
  const netContribution = projGP - mktg_cost;

  res.json({
    success: true,
    data: {
      promoPrice,
      discountAmount,
      promoMargin,
      baseGP,
      breakEvenUnits,
      projUnits,
      netContribution,
      isProfitable: projUnits >= breakEvenUnits && promoMargin > 0
    }
  });
});

// 3. POS Attribution Webhook Feed
app.get('/api/pos/feed', (req, res) => {
  res.json({ success: true, data: posTransactions });
});

app.listen(PORT, () => {
  console.log(`🚀 La Dolce Campaign Server running at http://localhost:${PORT}`);
});

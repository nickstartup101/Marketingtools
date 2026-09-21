// ສະຫຼັບແທັບເມນູ
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => {
    el.className = "nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800/60 hover:text-slate-200";
  });

  const target = document.getElementById('tab-' + tabId);
  if (target) target.classList.remove('hidden');

  const btn = document.getElementById('nav-' + tabId);
  if (btn) {
    btn.className = "nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-indigo-600/15 text-indigo-400 border border-indigo-500/20";
  }

  if (tabId === 'overview') renderOverviewChart();
}

// ດຶງຄ່າຈາກ Input ແລະ ຄຳນວນຜົນ Simulator
function runSimulation() {
  const price = parseFloat(document.getElementById('sim-price').value) || 0;
  const cogs = parseFloat(document.getElementById('sim-cogs').value) || 0;
  const discountPct = parseFloat(document.getElementById('sim-discount-pct').value) || 0;
  const baselineUnits = parseFloat(document.getElementById('sim-baseline-units').value) || 0;
  const liftPct = parseFloat(document.getElementById('sim-lift-pct').value) || 0;
  const mktgCost = parseFloat(document.getElementById('sim-mktg-cost').value) || 0;

  document.getElementById('label-discount-pct').innerText = discountPct + '%';
  document.getElementById('label-lift-pct').innerText = '+' + liftPct + '%';

  const res = calculateEconomics({ price, cogs, discountPct, baselineUnits, liftPct, mktgCost });

  document.getElementById('out-promo-price').innerText = res.promoPrice.toLocaleString() + ' kip';
  document.getElementById('out-discount-cup').innerText = res.discountAmount.toLocaleString() + ' kip';
  document.getElementById('out-unit-margin').innerText = res.promoUnitMargin.toLocaleString() + ' kip';

  document.getElementById('m-base-profit').innerText = res.baseGrossProfit.toLocaleString() + ' kip';
  document.getElementById('m-be-units').innerText = res.isMarginNegative ? 'IMPOSSIBLE' : `${res.beUnits} Units`;
  document.getElementById('m-proj-units').innerText = `${res.projectedUnits} Units`;
  document.getElementById('m-net-contribution').innerText = res.netContribution.toLocaleString() + ' kip';

  // ສະແດງສະຖານະຄວາມສ່ຽງ (Risk Badge)
  const badge = document.getElementById('sim-badge');
  const text = document.getElementById('sim-verdict-text');
  const box = document.getElementById('sim-verdict-box');

  if (res.isMarginNegative) {
    box.className = "p-4 rounded-xl border border-rose-600 bg-rose-950/20 flex flex-col justify-between";
    badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30";
    badge.innerText = currentLang === 'lo' ? "🔴 ຂາດທຶນຕໍ່ຈອກ (Margin Risk)" : "🔴 SEVERE MARGIN RISK";
    text.innerText = currentLang === 'lo' ? "ລາຄາຫຼຸດແລ້ວຕ່ຳກວ່າຕົ້ນທຶນສູດ COGS. ທຸກໆຈອກທີ່ຂາຍຈະສ້າງຜົນຂາດທຶນໂດຍກົງ." : "Discounted price is below recipe COGS. Negative cash margin per cup.";
  } else if (res.isBelowBreakEven) {
    box.className = "p-4 rounded-xl border border-amber-600 bg-amber-950/20 flex flex-col justify-between";
    badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30";
    badge.innerText = currentLang === 'lo' ? "🟡 ຕ້ອງເພີ່ມຍອດຂາຍອີກ" : "🟡 HIGHER VOLUME REQUIRED";
    text.innerText = currentLang === 'lo' ? `ຕ້ອງຂາຍໃຫ້ໄດ້ຢ່າງໜ້ອຍ ${res.beUnits} ຈອກ ເພື່ອບໍ່ໃຫ້ກຳໄລຫຼຸດລົງຈາກປົກກະຕິ.` : `Needs at least ${res.beUnits} units to match baseline gross profit.`;
  } else {
    box.className = "p-4 rounded-xl border border-emerald-600 bg-emerald-950/20 flex flex-col justify-between";
    badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    badge.innerText = currentLang === 'lo' ? "🟢 ແຜນສ້າງກຳໄລເພີ່ມ (Profitable)" : "🟢 PROFITABLE SCENARIO";
    text.innerText = currentLang === 'lo' ? `ຍອດຂາຍທີ່ຄາດການ (${res.projectedUnits} ຈອກ) ສູງກວ່າຈຸດກຸ້ມທຶນ. ສ້າງກຳໄລສຸດທິເຕີບໂຕ.` : `Projected volume surpasses break-even threshold. Yields positive incremental margin.`;
  }
}

// Chart.js initialization
let overviewChart = null;
function renderOverviewChart() {
  const ctx = document.getElementById('overviewRevenueChart');
  if (!ctx) return;
  if (overviewChart) overviewChart.destroy();

  overviewChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['01 Oct', '03 Oct', '05 Oct', '07 Oct', '09 Oct', '10 Oct (10.10)', '12 Oct'],
      datasets: [
        {
          label: currentLang === 'lo' ? 'ຍອດຂາຍແຄມເປນ (ກີບ)' : 'Campaign Sales (LAK)',
          data: [1200000, 1350000, 1100000, 1400000, 1250000, 3244500, 1300000],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.35
        },
        {
          label: currentLang === 'lo' ? 'ຍອດຂາຍປົກກະຕິ Baseline' : 'Normal Baseline',
          data: [1200000, 1200000, 1200000, 1200000, 1200000, 1200000, 1200000],
          borderColor: '#64748b',
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#cbd5e1' } } },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
      }
    }
  });
}

// ເລີ່ມຕົ້ນລະບົບ
window.addEventListener('DOMContentLoaded', () => {
  setLanguage('lo'); // ເລີ່ມຕົ້ນດ້ວຍພາສາລາວ
  runSimulation();
  renderOverviewChart();
});

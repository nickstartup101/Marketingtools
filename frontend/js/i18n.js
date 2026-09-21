const translations = {
  en: {
    brand_sub: "Campaign Intelligence",
    nav_ops: "Operations",
    nav_overview: "Marketing Overview",
    nav_calendar: "Campaign Calendar",
    nav_simulator: "Promotion Simulator",
    nav_analytics: "Campaign Analytics",
    nav_knowledge: "Knowledge Engine",
    nav_cases: "Case Study Library",
    nav_budget: "Marketing Budget",
    nav_pos: "POS Real-Time Bridge",
    btn_plan: "Plan New Campaign",
    kpi_gross_rev: "Campaign Gross Revenue",
    kpi_discount: "Net Discount Given",
    kpi_gp: "Net Gross Profit",
    kpi_contribution: "Campaign Contribution",
    sim_title: "Pre-Campaign Financial Simulator",
    sim_desc: "Simulate discount depth, forecast break-even volume, and stress-test gross margin risks.",
    sim_product: "Target Product",
    sim_normal_price: "Normal Retail Price (LAK)",
    sim_cogs: "Recipe COGS (Unit Cost LAK)",
    sim_discount_pct: "Discount Percentage (%)",
    sim_baseline: "Baseline Sales Volume (Units/Day)",
    sim_mktg_cost: "Marketing Ads Cost (LAK)",
    sim_lift: "Expected Sales Lift (%)",
    sim_be_units: "Break-Even Units Required",
    sim_proj_units: "Projected Units",
    sim_net_contrib: "Net Campaign Contribution",
    btn_adopt: "Adopt Into Campaign Draft →"
  },
  lo: {
    brand_sub: "ລະບົບອັດສະລິຍະແຄມເປນ",
    nav_ops: "ການດຳເນີນງານ",
    nav_overview: "ພາບລວມການຕະຫຼາດ",
    nav_calendar: "ປະຕິທິນແຄມເປນ",
    nav_simulator: "ລະບົບຈຳລອງໂປຣໂມຊັ່ນ",
    nav_analytics: "ວິເຄາະຜົນແຄມເປນ",
    nav_knowledge: "ຄັງປັນຍາ & ບົດຮຽນ",
    nav_cases: "ຄັງກໍລະນີສຶກສາ (Case Studies)",
    nav_budget: "ງົບປະມານການຕະຫຼາດ",
    nav_pos: "ເຊື່ອມຕໍ່ລະບົບ POS",
    btn_plan: "+ ສ້າງແຄມເປນໃໝ່",
    kpi_gross_rev: "ຍອດຂາຍລວມແຄມເປນ",
    kpi_discount: "ສ່ວນຫຼຸດທັງໝົດທີ່ໃຫ້",
    kpi_gp: "ກຳໄລຂັ້ນຕົ້ນສຸດທິ (GP)",
    kpi_contribution: "ສ່ວນປະກອບກຳໄລແຄມເປນ",
    sim_title: "ລະບົບຈຳລອງຕົ້ນທຶນ ແລະ ການເງິນກ່ອນເປີດແຄມເປນ",
    sim_desc: "ທົດລອງປັບສ່ວນຫຼຸດ, ຄິດໄລ່ຈຸດກຸ້ມທຶນ (Break-even) ແລະ ປ້ອງກັນຄວາມສ່ຽງຕໍ່ກຳໄລຂັ້ນຕົ້ນ.",
    sim_product: "ສິນຄ້າເປົ້າໝາຍ",
    sim_normal_price: "ລາຄາຂາຍປົກກະຕິ (ກີບ)",
    sim_cogs: "ຕົ້ນທຶນສູດສິນຄ້າຕໍ່ຈອກ/COGS (ກີບ)",
    sim_discount_pct: "ເປີເຊັນສ່ວນຫຼຸດ (%)",
    sim_baseline: "ຍອດຂາຍປົກກະຕິຕໍ່ວັນ (Baseline Units)",
    sim_mktg_cost: "ຄ່າໂຄສະນາ/Mktg Cost (ກີບ)",
    sim_lift: "ຄາດການຍອດຂາຍເພີ່ມຂຶ້ນ (%)",
    sim_be_units: "ຈຳນວນຂາຍຂັ້ນຕ່ຳເພື່ອໃຫ້ກຸ້ມທຶນ",
    sim_proj_units: "ຈຳນວນຂາຍທີ່ຄາດການ",
    sim_net_contrib: "ກຳໄລສຸດທິຫຼັງຫັກຄ່າການຕະຫຼາດ",
    btn_adopt: "ບັນທຶກເຂົ້າຮ່າງແຄມເປນ →"
  }
};

let currentLang = 'lo'; // ພາສາເລີ່ມຕົ້ນ: ພາສາລາວ

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  
  // ປັບປ່ຽນ Class Style ສຳລັບພາສາລາວ
  if (lang === 'lo') {
    document.body.classList.add('font-lao');
  } else {
    document.body.classList.remove('font-lao');
  }

  // ອັບເດດຂໍ້ຄວາມໃນ DOM ຕາມ data-i18n Attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  // ອັບເດດປຸ່ມ Switcher
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    btn.innerHTML = lang === 'lo' ? '🇱🇦 ລາວ' : '🇬🇧 ENG';
  }
  
  // Refresh Simulator Text
  if (typeof runSimulation === 'function') {
    runSimulation();
  }
}

function toggleLanguage() {
  setLanguage(currentLang === 'lo' ? 'en' : 'lo');
}

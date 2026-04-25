function initLoyalty() {
  const STORAGE_POINTS = "lootifyLoyaltyPoints";
  const STORAGE_LEDGER = "lootifyLoyaltyLedger";
  const STORAGE_BADGES = "lootifyUnlockedBadges";

  const rewardRules = {
    purchase: { daily: 40, weekly: 120 },
    loot_code: { daily: 10, weekly: 30 },
    referral: { daily: 30, weekly: 90 },
    chat: { daily: 6, weekly: 24 },
    event: { daily: 12, weekly: 40 },
    wishlist: { daily: 8, weekly: 24 },
    notify: { daily: 9, weekly: 27 },
    review: { daily: 12, weekly: 36 },
    request: { daily: 12, weekly: 36 },
    tweak: { daily: 10, weekly: 30 }
  };

  const milestones = [
    { points: 25, badge: "Rookie Buyer" },
    { points: 50, badge: "Loot Code Hunter" },
    { points: 100, badge: "VIP Grinder" },
    { points: 200, badge: "Marketplace Elite" }
  ];

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getPoints() {
    return Number(localStorage.getItem(STORAGE_POINTS) || 0);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }

  function startOfWeek(date) {
    const copy = new Date(date);
    const day = copy.getDay();
    const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(copy.getFullYear(), copy.getMonth(), diff).getTime();
  }

  function sumLedger(ledger, type, since) {
    return ledger
      .filter((entry) => entry.type === type && Number(entry.at) >= since)
      .reduce((total, entry) => total + Number(entry.points || 0), 0);
  }

  function floatXp(points) {
    const node = document.createElement("div");
    node.className = "xp-float";
    node.textContent = "+" + points + " XP";
    document.body.appendChild(node);
    window.setTimeout(() => node.remove(), 1200);
  }

  function notify(message) {
    if (typeof window.showBotReply === "function") {
      window.showBotReply(message);
    }
  }

  function checkMilestones(points) {
    const unlocked = readJson(STORAGE_BADGES, []);
    let changed = false;

    milestones.forEach((milestone) => {
      if (points >= milestone.points && !unlocked.includes(milestone.badge)) {
        unlocked.push(milestone.badge);
        changed = true;
        notify("Reward unlocked: " + milestone.badge + ".");
      }
    });

    if (changed) {
      writeJson(STORAGE_BADGES, unlocked);
    }
  }

  function award(type, points, options = {}) {
    const rule = rewardRules[type] || { daily: 10, weekly: 30 };
    const now = new Date();
    const ledger = readJson(STORAGE_LEDGER, []).filter((entry) => Number(entry.at) >= startOfWeek(now));
    const dailyUsed = sumLedger(ledger, type, startOfDay(now));
    const weeklyUsed = sumLedger(ledger, type, startOfWeek(now));
    const allowed = Math.max(0, Math.min(points, rule.daily - dailyUsed, rule.weekly - weeklyUsed));

    if (allowed <= 0) {
      if (options.notify !== false) {
        notify("Daily XP cap reached for " + type.replace(/_/g, " ") + ".");
      }
      return { awarded: 0, capped: true, total: getPoints() };
    }

    const total = getPoints() + allowed;
    ledger.push({
      type,
      points: allowed,
      reason: options.reason || type,
      at: Date.now()
    });
    localStorage.setItem(STORAGE_POINTS, String(total));
    writeJson(STORAGE_LEDGER, ledger.slice(-200));
    floatXp(allowed);
    checkMilestones(total);

    if (options.notify) {
      notify("You earned +" + allowed + " XP for " + (options.reason || type.replace(/_/g, " ")) + ".");
    }

    window.dispatchEvent(new CustomEvent("lootify:loyalty-updated", {
      detail: { type, awarded: allowed, total }
    }));

    return { awarded: allowed, capped: false, total };
  }

  function getBadges() {
    return readJson(STORAGE_BADGES, []);
  }

  window.LootifyLoyalty = {
    award,
    getPoints,
    getBadges,
    rules: rewardRules
  };

  window.dispatchEvent(new CustomEvent("lootify:loyalty-ready", {
    detail: { total: getPoints() }
  }));
}

function init() {
  initLoyalty();
}

document.addEventListener("DOMContentLoaded", init);

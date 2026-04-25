function initRevealAnimations() {
const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initMarketplace() {
      const marketplaceServices = [
        {
          id: "fortnite-coaching",
          name: "Fortnite 1v1 Coaching",
          category: "Coaching",
          subcategory: "Mechanics",
          price: 15,
          originalPrice: 20,
          description: "Improve mechanics, aim, piece control, and game sense with focused 1-on-1 coaching.",
          icon: "fa-solid fa-headset",
          badges: ["Featured", "Top Seller"],
          checkoutUrl: "https://buy.stripe.com/9B6fZh0yOaxQfbe2D55os02",
          trust: "Recently bought",
          status: "available",
          promo: "Spring grind offer",
          tags: ["aim", "mechanics", "vod review"],
          recommendation: "Best for players who want a personalized improvement plan."
        },
        {
          id: "ranked-carry",
          name: "Ranked Carry",
          category: "Rank Boosting",
          subcategory: "Competitive",
          price: 10,
          originalPrice: 15,
          description: "Climb ranks faster with experienced players, live guidance, and smarter gameplay.",
          icon: "fa-solid fa-ranking-star",
          badges: ["HOT", "Verified"],
          checkoutUrl: "https://buy.stripe.com/cNifZhgxMgWed36fpR5os00",
          trust: "Fast delivery",
          status: "available",
          promo: "Limited weekly slots",
          tags: ["ranked", "carry", "competitive"],
          recommendation: "Recommended if your recent activity includes purchases or order starts."
        },
        {
          id: "discord-setup",
          name: "Discord Server Setup",
          category: "Items Boost",
          subcategory: "Community",
          price: 25,
          originalPrice: 30,
          description: "Channels, roles, permissions, ticket flow, and clean server structure for new communities.",
          icon: "fa-brands fa-discord",
          badges: ["Featured", "Loot Code"],
          checkoutUrl: "#loot-codes",
          trust: "Top Seller",
          status: "available",
          promo: "Use LOOTIFY10",
          tags: ["roles", "channels", "tickets"],
          recommendation: "Good fit for communities that need roles, channels, and clean onboarding."
        },
        {
          id: "pc-optimizations",
          name: "PC Optimizations",
          category: "Optimizations",
          subcategory: "Performance",
          price: 20,
          originalPrice: 25,
          description: "Advanced FPS tuning, startup cleanup, and performance setup for smoother gameplay.",
          icon: "fa-solid fa-gauge-high",
          badges: ["Featured", "Loot Code"],
          checkoutUrl: "https://discord.gg/U9put8F4F",
          trust: "Top Seller",
          status: "available",
          promo: "Seasonal FPS tune-up",
          tags: ["fps", "startup", "latency"],
          recommendation: "Smart pick if you search for FPS, latency, or performance."
        },
        {
          id: "tweaking",
          name: "Tweaking",
          category: "Optimizations",
          subcategory: "Coming Soon",
          price: 0,
          originalPrice: 0,
          description: "System tweaking service for latency, FPS, and startup tuning. Coming soon.",
          icon: "fa-solid fa-screwdriver-wrench",
          badges: ["Soon"],
          checkoutUrl: "https://discord.gg/U9put8F4F",
          trust: "Waitlist open",
          status: "coming-soon",
          promo: "Early access waitlist",
          tags: ["cpu", "ram", "network", "game mode"],
          recommendation: "Join early access if you want CPU, RAM, Network, and Game Mode tweaks.",
          tweakOptions: ["CPU", "RAM", "Network", "Game Mode"]
        },
        {
          id: "creator-bundle",
          name: "Creator Bundle",
          category: "Bundles",
          subcategory: "Combo",
          price: 35,
          originalPrice: 45,
          description: "Discord setup plus coaching prep for creators, streamers, and new communities.",
          icon: "fa-solid fa-box-open",
          badges: ["Featured", "Bundle"],
          checkoutUrl: "#loot-codes",
          trust: "Combo value",
          status: "available",
          promo: "Bundle saves $10",
          tags: ["discord", "coaching", "creator"],
          recommendation: "Best value if you need both a server flow and launch support."
        },
        {
          id: "early-access-lab",
          name: "Early Access Lab",
          category: "Beta",
          subcategory: "Experimental",
          price: 0,
          originalPrice: 0,
          description: "Beta services, seasonal tests, and private drops before they go public.",
          icon: "fa-solid fa-flask",
          badges: ["Beta", "Early Access"],
          checkoutUrl: "https://discord.gg/U9put8F4F",
          trust: "Invite only",
          status: "coming-soon",
          promo: "Beta testers earn XP",
          tags: ["beta", "testing", "drops"],
          recommendation: "Good for active users who want early marketplace experiments."
        }
      ];

      const marketplaceContainer = document.getElementById("marketplace-container");
      const searchInput = document.getElementById("marketplace-search");
      const categorySelect = document.getElementById("marketplace-category");
      const themeToggle = document.getElementById("theme-toggle");
      const referralButton = document.getElementById("referral-button");
      const loyaltyPoints = document.getElementById("loyalty-points");
      const discordActivityPanel = document.getElementById("discord-activity-panel");
      const xpFill = document.getElementById("xp-fill");
      const xpStatus = document.getElementById("xp-status");
      const achievementList = document.getElementById("achievement-list");
      const leaderboardList = document.getElementById("leaderboard-list");
      const profileSummary = document.getElementById("profile-summary");
      const streamerCodeUsage = document.getElementById("streamer-code-usage");
      const streamerReferrals = document.getElementById("streamer-referrals");
      const aiRecommendation = document.getElementById("ai-recommendation");
      const customRequestForm = document.getElementById("custom-request-form");
      const communityPoll = document.getElementById("community-poll");
      const pollResult = document.getElementById("poll-result");
      const testimonialFeed = document.getElementById("testimonial-feed");

      if (!marketplaceContainer || !searchInput || !categorySelect) {
        return;
      }

      const marketplaceObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              marketplaceObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14 }
      );

      function getStoredJson(key, fallback) {
        try {
          return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch (error) {
          return fallback;
        }
      }

      function setStoredJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      }

      function trackEvent(name, payload = {}) {
        const analytics = getStoredJson("lootifyAnalytics", []);
        let userId = "guest";

        try {
          const savedUser = JSON.parse(localStorage.getItem("lootifyUser"));
          if (savedUser && savedUser.id) {
            userId = savedUser.id;
          }
        } catch (error) {
          userId = "guest";
        }

        analytics.push({
          name,
          payload,
          userId,
          at: new Date().toISOString()
        });
        setStoredJson("lootifyAnalytics", analytics.slice(-120));

        if (typeof window.gtag === "function") {
          window.gtag("event", name, { ...payload, user_id: userId });
        }

        if (typeof window.hj === "function") {
          window.hj("event", name);
        }
      }

      function getWishlist() {
        return getStoredJson("lootifyWishlist", []);
      }

      function getReviews() {
        return getStoredJson("lootifyReviews", {});
      }

      function getSavedUser() {
        try {
          return JSON.parse(localStorage.getItem("lootifyUser"));
        } catch (error) {
          return null;
        }
      }

      function addLoyaltyPoints(points, type = "event", reason = "site activity") {
        if (window.LootifyLoyalty) {
          window.LootifyLoyalty.award(type, points, { reason });
        } else {
          const nextPoints = Number(localStorage.getItem("lootifyLoyaltyPoints") || 0) + points;
          localStorage.setItem("lootifyLoyaltyPoints", String(nextPoints));
        }
        renderLoyalty();
      }

      function renderLoyalty() {
        const points = window.LootifyLoyalty ? window.LootifyLoyalty.getPoints() : Number(localStorage.getItem("lootifyLoyaltyPoints") || 0);
        const xp = points % 100;

        if (loyaltyPoints) {
          loyaltyPoints.textContent = points + " pts";
        }

        if (xpFill) {
          xpFill.style.width = xp + "%";
        }

        if (xpStatus) {
          xpStatus.textContent = xp + " XP toward the next reward tier.";
        }

        renderGamificationPanels();
      }

      function getAchievements(points) {
        const milestoneBadges = window.LootifyLoyalty ? window.LootifyLoyalty.getBadges() : [];
        return [
          { label: "First Save", unlocked: getWishlist().length > 0 },
          { label: "Reviewer", unlocked: Object.values(getReviews()).some((items) => items.length > 0) },
          { label: "Supporter", unlocked: points >= 25 },
          { label: "VIP Grinder", unlocked: points >= 100 },
          ...milestoneBadges.map((badge) => ({ label: badge, unlocked: true }))
        ];
      }

      function renderGamificationPanels() {
        const points = window.LootifyLoyalty ? window.LootifyLoyalty.getPoints() : Number(localStorage.getItem("lootifyLoyaltyPoints") || 0);
        const user = getSavedUser();
        const notifyList = getStoredJson("lootifyNotifyMe", []);
        const referrals = Number(localStorage.getItem("lootifyReferralClaims") || 0);
        const analytics = getStoredJson("lootifyAnalytics", []);
        const lootCodeUses = analytics.filter((event) => event.name === "loot_code_used").length;

        if (profileSummary) {
          profileSummary.textContent = user && user.username
            ? user.username + " â€¢ " + points + " points â€¢ " + notifyList.length + " saved alerts"
            : "Guest profile â€¢ " + points + " points â€¢ Login with Discord for personalization";
        }

        if (achievementList) {
          achievementList.innerHTML = getAchievements(points).map((badge) => {
            return '<span class="achievement-badge ' + (badge.unlocked ? "unlocked" : "") + '">' + badge.label + '</span>';
          }).join("");
        }

        if (leaderboardList) {
          leaderboardList.innerHTML = [
            "You: " + points + " XP",
            "Top Buyer: Nova â€¢ 420 XP",
            "Top Referrer: Clipz â€¢ 12 referrals"
          ].map((item) => "<li>" + item + "</li>").join("");
        }

        if (streamerCodeUsage) {
          streamerCodeUsage.textContent = String(lootCodeUses);
        }

        if (streamerReferrals) {
          streamerReferrals.textContent = String(referrals);
        }

        renderRecommendation();
      }

      function renderRecommendation() {
        if (!aiRecommendation) {
          return;
        }

        const analytics = getStoredJson("lootifyAnalytics", []);
        const lastSearch = [...analytics].reverse().find((event) => event.name === "marketplace_search");
        const query = lastSearch && lastSearch.payload ? String(lastSearch.payload.query || "").toLowerCase() : "";
        const points = window.LootifyLoyalty ? window.LootifyLoyalty.getPoints() : Number(localStorage.getItem("lootifyLoyaltyPoints") || 0);
        const recommended = marketplaceServices.find((service) => {
          return query && service.tags.some((tag) => query.includes(tag));
        }) || (points >= 50 ? marketplaceServices.find((service) => service.id === "creator-bundle") : marketplaceServices.find((service) => service.id === "pc-optimizations"));

        const predictedCode = points >= 100 ? "VIPDROP" : points >= 40 ? "LOOTIFYDROP" : "LOOTIFY10";
        aiRecommendation.textContent = recommended.name + ": " + recommended.recommendation + " Predictive Loot Code: " + predictedCode + ".";
      }

      function getAverageRating(serviceId) {
        const reviews = getReviews()[serviceId] || [];

        if (!reviews.length) {
          return "No reviews yet";
        }

        const average = reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length;
        return average.toFixed(1) + "/5 from " + reviews.length + " review" + (reviews.length === 1 ? "" : "s");
      }

      function renderCategories() {
        const categories = [...new Set(marketplaceServices.map((service) => service.category))];
        categorySelect.innerHTML = '<option value="all">All categories</option>' + categories.map((category) => {
          return '<option value="' + category + '">' + category + '</option>';
        }).join("");
      }

      function renderMarketplace() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;
        const wishlist = getWishlist();

        const filteredServices = marketplaceServices.filter((service) => {
          const searchable = [
            service.name,
            service.category,
            service.subcategory,
            String(service.price),
            service.description,
            service.promo,
            service.tags.join(" "),
            service.badges.join(" ")
          ].join(" ").toLowerCase();
          const matchesQuery = !query || searchable.includes(query);
          const matchesCategory = category === "all" || service.category === category;
          return matchesQuery && matchesCategory;
        });

        if (!filteredServices.length) {
          marketplaceContainer.innerHTML = '<div class="marketplace-panel">No services match your search.</div>';
          return;
        }

        marketplaceContainer.innerHTML = filteredServices.map((service) => {
          const saved = wishlist.includes(service.id);
          const price = service.price > 0 ? "$" + service.price : "Coming Soon";
          const discount = service.originalPrice > service.price && service.price > 0
            ? "Loot Code eligible: save from $" + service.originalPrice + " with LOOTIFY10"
            : "Ask Discord support for availability";
          const checkoutLabel = service.status === "coming-soon" ? "Notify Me" : "Buy Now";
          const actionClass = service.status === "coming-soon" ? "marketplace-notify" : "marketplace-buy";
          const badges = service.badges.map((badge) => '<span class="marketplace-badge">' + badge + '</span>').join("");
          const tags = service.tags.map((tag) => '<span class="service-tag">' + tag + '</span>').join("");
          const tweakingForm = service.id === "tweaking"
            ? `
              <form class="marketplace-form tweaking-form" data-tweaking-id="${service.id}">
                <div class="check-grid">
                  ${service.tweakOptions.map((option) => '<label><input type="checkbox" name="tweak" value="' + option + '" /> ' + option + '</label>').join("")}
                </div>
                <input type="email" name="email" placeholder="Email or Discord for early access" aria-label="Tweaking Notify Me contact" required />
                <button type="submit" data-maintenance-disable aria-label="Join Tweaking Notify Me list">Notify Me</button>
              </form>
            `
            : "";

          return `
            <article class="card marketplace-card" data-service-id="${service.id}">
              <div class="marketplace-card-top">
                <div class="marketplace-icon" role="img" aria-label="${service.category} icon">
                  <i class="${service.icon}" aria-hidden="true"></i>
                </div>
                <div class="marketplace-badges">${badges}</div>
              </div>
              <h3 class="service-title">${service.name}</h3>
              <div class="marketplace-meta">
                <span>${service.category}</span>
                <span>${service.subcategory}</span>
                <span>${service.trust}</span>
              </div>
              <p class="service-desc">${service.description}</p>
              <div class="price">${price}</div>
              <div class="marketplace-discount">${discount}</div>
              <div class="service-tags" aria-label="Service tags">${tags}</div>
              <p class="marketplace-discount">${service.promo}</p>
              <div class="marketplace-rating" aria-label="Average rating">${getAverageRating(service.id)}</div>
              <div class="card-actions">
                <a class="button button-primary ${actionClass}" href="${service.checkoutUrl}" target="${service.checkoutUrl.startsWith("#") ? "_self" : "_blank"}" rel="noopener noreferrer" aria-label="${checkoutLabel} for ${service.name}" data-service-id="${service.id}" data-maintenance-disable>${checkoutLabel}</a>
                <button class="wishlist-button ${saved ? "active" : ""}" type="button" aria-label="${saved ? "Remove" : "Save"} ${service.name} wishlist" data-wishlist-id="${service.id}">
                  <i class="fa-solid fa-heart" aria-hidden="true"></i> ${saved ? "Saved" : "Wishlist"}
                </button>
              </div>
              ${tweakingForm}
              <form class="marketplace-review" data-review-id="${service.id}">
                <div class="star-row" aria-label="Choose star rating">
                  ${[1, 2, 3, 4, 5].map((rating) => '<button class="star-button" type="button" aria-label="' + rating + ' star rating" data-rating="' + rating + '">' + rating + '</button>').join("")}
                </div>
                <input class="marketplace-review-input" type="text" placeholder="Leave a quick review" aria-label="Review for ${service.name}" />
                <button class="marketplace-submit-review" type="submit" aria-label="Submit review for ${service.name}">Submit Review</button>
              </form>
            </article>
          `;
        }).join("");

        marketplaceContainer.querySelectorAll(".marketplace-card").forEach((card) => marketplaceObserver.observe(card));

        if (typeof window.updateLootifyMaintenanceState === "function") {
          window.updateLootifyMaintenanceState();
        }
      }

      function renderDiscordActivity() {
        if (window.LootifyDiscord && typeof window.LootifyDiscord.renderServerPanel === "function") {
          window.LootifyDiscord.renderServerPanel();
          return;
        }

        if (!discordActivityPanel) {
          return;
        }

        const activeMembers = 42 + Math.floor(Math.random() * 18);
        const openTickets = 3 + Math.floor(Math.random() * 5);
        const recentOrders = 8 + Math.floor(Math.random() * 6);
        const pollVotes = Object.values(getStoredJson("lootifyPollVotes", {})).reduce((total, value) => total + Number(value), 0);

        discordActivityPanel.innerHTML = `
          <li>${activeMembers} members online</li>
          <li>${openTickets} support tickets active</li>
          <li>${recentOrders} recent marketplace actions</li>
          <li>${pollVotes} community poll votes</li>
        `;

        if (testimonialFeed) {
          testimonialFeed.innerHTML = [
            "Recently bought: Ranked Carry",
            "Top Seller: Fortnite 1v1 Coaching",
            "Review: PC Optimizations improved FPS",
            "Contest: Giveaway points reward active"
          ].map((item) => "<li>" + item + "</li>").join("");
        }
      }

      function applyTheme() {
        const savedTheme = localStorage.getItem("lootifyTheme") || "dark";
        document.body.classList.toggle("light-mode", savedTheme === "light");
      }

      marketplaceContainer.addEventListener("click", (event) => {
        const wishlistButton = event.target.closest("[data-wishlist-id]");
        const buyLink = event.target.closest(".marketplace-buy");
        const notifyLink = event.target.closest(".marketplace-notify");
        const starButton = event.target.closest(".star-button");

        if (wishlistButton) {
          const serviceId = wishlistButton.dataset.wishlistId;
          const wishlist = getWishlist();
          const nextWishlist = wishlist.includes(serviceId)
            ? wishlist.filter((id) => id !== serviceId)
            : [...wishlist, serviceId];

          setStoredJson("lootifyWishlist", nextWishlist);
          addLoyaltyPoints(2, "wishlist", "wishlist activity");
          trackEvent("wishlist_toggle", { serviceId });
          renderMarketplace();
        }

        if (buyLink) {
          if (window.lootifyMaintenanceActive) {
            event.preventDefault();
            window.showBotReply("Lootify maintenance is active right now. Order buttons are paused every Friday 2-4 PM EST.");
            return;
          }

          const serviceId = buyLink.dataset.serviceId;
          const service = marketplaceServices.find((item) => item.id === serviceId);
          const autoCode = localStorage.getItem("lootifyAutoLootCode") || "LOOTIFY10";
          localStorage.setItem("lootifyOrderStatus", "Order started for " + (service ? service.name : "marketplace service") + ". Complete checkout, then open Discord for fulfillment.");
          localStorage.setItem("lootifyPendingCheckout", JSON.stringify({
            serviceId,
            autoLootCode: autoCode,
            at: new Date().toISOString()
          }));
          addLoyaltyPoints(10, "purchase", "order start");
          trackEvent("purchase_click", { serviceId, autoLootCode: autoCode });
          window.sendWebhook("Lootify Order Started:\nService: " + (service ? service.name : serviceId) + "\nAuto Loot Code: " + autoCode);
        }

        if (notifyLink) {
          event.preventDefault();

          if (window.lootifyMaintenanceActive) {
            window.showBotReply("Lootify maintenance is active right now. Notify Me sign-ups are paused every Friday 2-4 PM EST.");
            return;
          }

          const serviceId = notifyLink.dataset.serviceId;
          const notifyList = getStoredJson("lootifyNotifyMe", []);

          if (!notifyList.includes(serviceId)) {
            notifyList.push(serviceId);
            setStoredJson("lootifyNotifyMe", notifyList);
          }

          addLoyaltyPoints(3, "notify", "Notify Me signup");
          trackEvent("notify_me_signup", { serviceId });
          window.showBotReply("You're on the Notify Me list for " + serviceId.replace(/-/g, " ") + ". We'll use Discord updates when this service opens.");
        }

        if (starButton) {
          const form = starButton.closest(".marketplace-review");
          form.dataset.selectedRating = starButton.dataset.rating;
          form.querySelectorAll(".star-button").forEach((button) => {
            button.classList.toggle("active", Number(button.dataset.rating) <= Number(starButton.dataset.rating));
          });
        }
      });

      marketplaceContainer.addEventListener("submit", (event) => {
        const tweakingForm = event.target.closest(".tweaking-form");
        const form = event.target.closest(".marketplace-review");

        if (tweakingForm) {
          event.preventDefault();

          if (window.lootifyMaintenanceActive) {
            window.showBotReply("Tweaking early access is paused during weekly maintenance. Try again after Friday 4 PM EST.");
            return;
          }

          const serviceId = tweakingForm.dataset.tweakingId;
          const contact = tweakingForm.querySelector('[name="email"]').value.trim();
          const selectedTweaks = [...tweakingForm.querySelectorAll('[name="tweak"]:checked')].map((input) => input.value);
          const signups = getStoredJson("lootifyTweakingSignups", []);

          signups.push({
            serviceId,
            contact,
            tweaks: selectedTweaks,
            at: new Date().toISOString()
          });
          setStoredJson("lootifyTweakingSignups", signups.slice(-80));
          addLoyaltyPoints(5, "tweak", "Tweaking early access");
          trackEvent("tweaking_notify_signup", { serviceId, tweaks: selectedTweaks });
          window.sendWebhook("Lootify Tweaking Notify Me:\nContact: " + contact + "\nTweaks: " + (selectedTweaks.join(", ") || "None selected"));
          window.showBotReply("Tweaking Notify Me saved. Selected tweaks: " + (selectedTweaks.join(", ") || "none yet") + ".");
          tweakingForm.reset();
          return;
        }

        if (!form) {
          return;
        }

        event.preventDefault();

        const serviceId = form.dataset.reviewId;
        const input = form.querySelector(".marketplace-review-input");
        const rating = Number(form.dataset.selectedRating || 5);
        const text = input.value.trim() || "Helpful service.";
        const reviews = getReviews();

        reviews[serviceId] = reviews[serviceId] || [];
        reviews[serviceId].push({ rating, text, at: new Date().toISOString() });
        setStoredJson("lootifyReviews", reviews);
        addLoyaltyPoints(4, "review", "service review");
        trackEvent("review_submit", { serviceId, rating });
        renderMarketplace();
      });

      searchInput.addEventListener("input", () => {
        trackEvent("marketplace_search", { query: searchInput.value });
        renderMarketplace();
      });

      categorySelect.addEventListener("change", () => {
        trackEvent("category_filter", { category: categorySelect.value });
        renderMarketplace();
      });

      if (themeToggle) {
        themeToggle.addEventListener("click", () => {
          const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
          localStorage.setItem("lootifyTheme", nextTheme);
          applyTheme();
          trackEvent("theme_toggle", { theme: nextTheme });
        });
      }

      if (referralButton) {
        referralButton.addEventListener("click", () => {
          const nextReferrals = Number(localStorage.getItem("lootifyReferralClaims") || 0) + 1;
          localStorage.setItem("lootifyReferralClaims", String(nextReferrals));
          addLoyaltyPoints(15, "referral", "referral claim");
          trackEvent("referral_claim", { count: nextReferrals });
        });
      }

      if (customRequestForm) {
        customRequestForm.addEventListener("submit", (event) => {
          event.preventDefault();

          if (window.lootifyMaintenanceActive) {
            window.showBotReply("Custom requests are paused during weekly maintenance. Try again after Friday 4 PM EST.");
            return;
          }

          const formData = new FormData(customRequestForm);
          const request = {
            name: String(formData.get("name") || "").trim(),
            category: String(formData.get("category") || "").trim(),
            details: String(formData.get("details") || "").trim(),
            at: new Date().toISOString()
          };
          const requests = getStoredJson("lootifyCustomRequests", []);

          requests.push(request);
          setStoredJson("lootifyCustomRequests", requests.slice(-50));
          addLoyaltyPoints(6, "request", "custom request");
          trackEvent("custom_request_submit", request);
          window.sendWebhook("Lootify Custom Request:\nTitle: " + request.name + "\nCategory: " + request.category + "\nDetails: " + request.details);
          window.showBotReply("Custom request saved. Live Support can help turn it into an order when you're ready.");
          customRequestForm.reset();
        });
      }

      if (communityPoll) {
        communityPoll.addEventListener("click", (event) => {
          const button = event.target.closest("[data-poll-vote]");

          if (!button) {
            return;
          }

          const vote = button.dataset.pollVote;
          const votes = getStoredJson("lootifyPollVotes", {});
          votes[vote] = Number(votes[vote] || 0) + 1;
          setStoredJson("lootifyPollVotes", votes);
          addLoyaltyPoints(2, "event", "community poll vote");
          trackEvent("community_poll_vote", { vote });

          if (pollResult) {
            pollResult.textContent = Object.entries(votes).map(([label, count]) => label + ": " + count).join(" â€¢ ");
          }

          renderDiscordActivity();
        });
      }

      applyTheme();
      renderCategories();
      renderLoyalty();
      renderDiscordActivity();
      renderMarketplace();
      window.addEventListener("lootify:loyalty-updated", renderLoyalty);
      window.addEventListener("lootify:loyalty-ready", renderLoyalty);
      window.setInterval(renderDiscordActivity, 12000);
    }

function initLootCodes() {
      const lootCodes = {
        LOOTIFY10: { discount: 10 },
        LOOTIFYDROP: { discount: 15 }
      };

      const container = document.getElementById("lootify-order-box");
      if (!container) {
        return;
      }

      const packageSelect = container.querySelector("#lootify-package-select");
      const basePrice = container.querySelector("#lootify-base-price");
      const codeInput = container.querySelector("#lootify-code-input");
      const applyButton = container.querySelector("#lootify-apply-button");
      const codeMessage = container.querySelector("#lootify-code-message");
      const finalPrice = container.querySelector("#lootify-final-price");
      const finalPriceBox = container.querySelector("#lootify-final-price-box");

      let activeDiscount = 0;

      function formatPrice(amount) {
        return "$" + amount.toFixed(2).replace(".00", "");
      }

      function updatePrice() {
        const selectedPrice = Number(packageSelect.value);
        const discountedPrice = selectedPrice - selectedPrice * (activeDiscount / 100);

        basePrice.textContent = formatPrice(selectedPrice);
        finalPrice.textContent = formatPrice(discountedPrice);
        finalPriceBox.classList.toggle("lootify-discount-active", activeDiscount > 0);
      }

      function showMessage(text, status) {
        codeMessage.textContent = text;
        codeMessage.classList.remove("lootify-success", "lootify-error");

        if (status === "success") {
          codeMessage.classList.add("lootify-success");
        }

        if (status === "error") {
          codeMessage.classList.add("lootify-error");
        }
      }

      function applyLootCode() {
        const enteredCode = codeInput.value.trim().toUpperCase();
        const matchedCode = lootCodes[enteredCode];

        if (matchedCode) {
          activeDiscount = matchedCode.discount;
          showMessage("âœ… Loot Code applied! You unlocked " + activeDiscount + "% off", "success");
          localStorage.setItem("lootifyAutoLootCode", enteredCode);
          if (window.LootifyLoyalty) {
            window.LootifyLoyalty.award("loot_code", 5, { reason: "Loot Code usage", notify: true });
          }

          try {
            const savedUser = JSON.parse(localStorage.getItem("lootifyUser"));
            const analytics = JSON.parse(localStorage.getItem("lootifyAnalytics")) || [];
            analytics.push({
              name: "loot_code_used",
              payload: { code: enteredCode, discount: activeDiscount },
              userId: savedUser && savedUser.id ? savedUser.id : "guest",
              at: new Date().toISOString()
            });
            localStorage.setItem("lootifyAnalytics", JSON.stringify(analytics.slice(-120)));

            if (typeof window.gtag === "function") {
              window.gtag("event", "loot_code_used", { code: enteredCode, discount: activeDiscount });
            }

            if (typeof window.hj === "function") {
              window.hj("event", "loot_code_used");
            }
          } catch (error) {
            localStorage.setItem("lootifyLastLootCode", enteredCode);
          }
        } else {
          activeDiscount = 0;
          showMessage("âŒ Invalid Loot Code", "error");
        }

        updatePrice();
      }

      packageSelect.addEventListener("change", updatePrice);
      applyButton.addEventListener("click", applyLootCode);
      codeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          applyLootCode();
        }
      });

      updatePrice();
    }

function init() {
  initRevealAnimations();
  initMarketplace();
  initLootCodes();
}

document.addEventListener("DOMContentLoaded", init);

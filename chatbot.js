function initChatbot() {
const chatbot = document.getElementById("chatbot");
    const chatbotPanel = document.getElementById("chatbotPanel");
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const chatbotOptions = document.getElementById("chatbotOptions");
    const chatbotActions = document.getElementById("chatbotActions");
    const chatbotInputForm = document.getElementById("chatbotInputForm");
    const chatbotInput = document.getElementById("chatbotInput");
    const DISCORD_INVITE_URL = "https://discord.gg/U9put8F4F";
    const DISCORD_WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE";
    window.lootifyMaintenanceActive = false;

    const botOptions = [
      {
        label: "View Packages",
        type: "packages"
      },
      {
        label: "Loot Codes",
        type: "lootCodes"
      },
      {
        label: "Live Support",
        type: "liveSupport"
      },
      {
        label: "Start Order",
        type: "startOrder"
      }
    ];

    let chatbotStarted = false;
    let typingTimer = null;

    function scrollChatToLatest() {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addMessage(text, sender, extraClass = "") {
      const message = document.createElement("div");
      message.className = `chatbot-message ${sender}${extraClass ? ` ${extraClass}` : ""}`;
      message.textContent = text;
      chatbotMessages.appendChild(message);
      scrollChatToLatest();
      return message;
    }

    function clearChatbotActions() {
      chatbotActions.innerHTML = "";
    }

    function addActionButton(label, handler) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chatbot-action";
      button.textContent = label;
      button.addEventListener("click", handler);
      chatbotActions.appendChild(button);
      scrollChatToLatest();
      return button;
    }

    function sendWebhook(content) {
      const isPlaceholder = !DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "YOUR_WEBHOOK_URL_HERE";

      if (isPlaceholder) {
        return;
      }

      fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      }).catch(() => {});
    }

    function setOptions(disabledLabels = []) {
      const fragment = document.createDocumentFragment();
      chatbotOptions.innerHTML = "";

      botOptions.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chatbot-option";
        button.textContent = option.label;
        button.setAttribute("aria-label", option.label);
        button.disabled = disabledLabels.includes(option.label);
        button.addEventListener("click", () => handleOptionClick(option, button));
        fragment.appendChild(button);
      });

      chatbotOptions.appendChild(fragment);
    }

    function showStartOrderAction() {
      clearChatbotActions();
      addActionButton("Start Order", () => {
        if (window.lootifyMaintenanceActive) {
          showBotReply("Lootify maintenance is active right now. Ordering may be limited every Friday 2-4 PM EST; please wait until the banner clears or contact Live Support.");
          return;
        }

        const selectedPackage = document.getElementById("lootify-package-select");
        const lootCode = document.getElementById("lootify-code-input");
        const packageText = selectedPackage
          ? selectedPackage.options[selectedPackage.selectedIndex].text
          : "Not selected";
        const codeText = lootCode && lootCode.value.trim() ? lootCode.value.trim().toUpperCase() : "None";
        let discordUser = "Not collected";

        try {
          const storedDiscordUser = JSON.parse(localStorage.getItem("lootifyUser"));

          if (storedDiscordUser && storedDiscordUser.username && storedDiscordUser.id) {
            discordUser = storedDiscordUser.username + " (" + storedDiscordUser.id + ")";
          }
        } catch (error) {
          discordUser = "Not collected";
        }

        addMessage("Start Order", "user");
        showBotReply("Pick your package in the Loot Code checkout, apply any Loot Code, then continue with your order. Advanced is the best value for most communities.", {
          supportActions: false
        });
        sendWebhook("New Lootify Order Started:\nPackage: " + packageText + "\nLoot Code: " + codeText + "\nDiscord User: " + discordUser);

        const orderBox = document.getElementById("loot-codes");
        if (orderBox) {
          orderBox.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    function showDiscordAction() {
      addActionButton("Open Discord", () => {
        window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
      });
    }

    function showLiveSupportChoices() {
      clearChatbotActions();

      ["New server setup", "Custom request", "General question"].forEach((supportType) => {
        addActionButton(supportType, () => {
          addMessage(supportType, "user");
          sendWebhook("Lootify Live Support Request:\nType: " + supportType);
          showBotReply("Click below to contact us on Discord.", { discordAction: true });
        });
      });
    }

    function smartReply(input) {
      const text = input.toLowerCase();

      if (/\b(price|cost|package|pay|pricing|payment)\b/.test(text)) {
        return {
          text: "Starter is $10, Advanced is $25, Pro is $50, and marketplace services include Coaching, PC Optimizations, Discord setups, and bundles. Loot Codes can reduce eligible pricing.",
          startOrder: true
        };
      }

      if (/\b(tweak|tweaking|cpu|ram|network|game mode|optimization|optimizations|fps|latency)\b/.test(text)) {
        return {
          text: "Tweaking is in early access with CPU, RAM, Network, and Game Mode options. PC Optimizations are live and are the best current pick for FPS, startup cleanup, and latency tuning."
        };
      }

      if (/\b(ai|recommend|suggest|best|personal|smart)\b/.test(text)) {
        const points = window.LootifyLoyalty ? window.LootifyLoyalty.getPoints() : Number(localStorage.getItem("lootifyLoyaltyPoints") || 0);
        const suggestion = points >= 50 ? "Creator Bundle" : "PC Optimizations";
        return {
          text: "Smart recommendation: " + suggestion + ". Your current loyalty level points toward " + (points >= 50 ? "bundle value and creator tools." : "performance help and starter services.")
        };
      }

      if (/\b(maintenance|down|friday|limited)\b/.test(text)) {
        return {
          text: "Lootify weekly maintenance runs every Friday 2-4 PM EST. Order buttons, Notify Me, and Tweaking actions pause automatically during that window."
        };
      }

      if (/\b(bot|bots|features|included|include|role|roles|channel|channels|permission|permissions)\b/.test(text)) {
        return {
          text: "Lootify server setups can include channels, roles, permissions, bot setup, and a clean Discord design."
        };
      }

      if (/\b(custom|special|unique)\b/.test(text)) {
        return {
          text: "Custom requests are supported. Tell us what you need, or use Live Support so we can help with the details.",
          supportActions: true
        };
      }

      if (/\b(time|delivery|long|wait|days)\b/.test(text)) {
        return {
          text: "Most Lootify orders take 1-3 days depending on package size and custom requests."
        };
      }

      if (/\b(code|discount|loot code|loot codes|lootcode)\b/.test(text)) {
        return {
          text: "Loot Codes unlock discounts on Lootify. Try LOOTIFY10 or LOOTIFYDROP when ordering."
        };
      }

      if (/\b(order|buy|start|checkout|purchase)\b/.test(text)) {
        return {
          text: "Advanced is the best value for most communities. You can also use a Loot Code before checkout. Start your order when you're ready.",
          startOrder: true
        };
      }

      if (/\b(faq|guide|marketplace|wishlist|review|rating|seller|service|services)\b/.test(text)) {
        return {
          text: "Use marketplace search and filters for categories, subcategories, prices, bundles, beta services, promotions, ratings, and badges. Wishlist items, submit reviews, vote in polls, and earn XP for activity."
        };
      }

      if (/\b(track|tracking|status|progress)\b/.test(text)) {
        const orderStatus = localStorage.getItem("lootifyOrderStatus") || "No active order is saved in this browser yet. After checkout, open Discord and we can track it with your ticket details.";
        return {
          text: "Order progress: " + orderStatus,
          supportActions: true
        };
      }

      if (/\b(support|help|owner|human|person|discord|contact)\b/.test(text)) {
        return {
          text: "Live Support can help with new server setups, custom requests, and general questions.",
          supportActions: true
        };
      }

      return {
        text: "I'm not fully sure yet, but I can help with prices, Loot Codes, orders, features, or live support."
      };
    }

    function showBotReply(reply, options = {}) {
      const replyData = typeof reply === "string" ? { text: reply, ...options } : reply;
      const maintenancePrefix = window.lootifyMaintenanceActive
        ? "Maintenance is active: ordering and notify actions may be limited until 4 PM EST.\n\n"
        : "";
      const typingMessage = addMessage("Lootify Bot is typing", "bot", "typing");

      typingTimer = window.setTimeout(() => {
        typingMessage.remove();
        addMessage(maintenancePrefix + replyData.text, "bot");
        clearChatbotActions();

        if (replyData.startOrder) {
          showStartOrderAction();
        }

        if (replyData.supportActions) {
          showLiveSupportChoices();
        }

        if (replyData.discordAction) {
          showDiscordAction();
        }
      }, 500);
    }

    function handleOptionClick(option, button) {
      if (button.disabled) {
        return;
      }

      if (window.LootifyLoyalty) {
        window.LootifyLoyalty.award("chat", 1, { reason: "chatbot option" });
      }

      addMessage(option.label, "user");
      button.disabled = true;

      if (option.type === "packages") {
        showBotReply(smartReply("price package cost"));
      }

      if (option.type === "lootCodes") {
        showBotReply("Loot Codes unlock discounts on Lootify. Try LOOTIFY10 or LOOTIFYDROP when ordering.");
      }

      if (option.type === "startOrder") {
        showBotReply(smartReply("start order buy"));
      }

      if (option.type === "liveSupport") {
        showBotReply(smartReply("support human owner"));
      }
    }

    function sendSmartMessage() {
      const input = chatbotInput.value.trim();

      if (!input) {
        return;
      }

      window.clearTimeout(typingTimer);
      if (window.LootifyLoyalty) {
        window.LootifyLoyalty.award("chat", 1, { reason: "chatbot message" });
      }
      addMessage(input, "user");
      chatbotInput.value = "";
      showBotReply(smartReply(input));
    }

    function startChatbot() {
      if (chatbotStarted) {
        return;
      }

      chatbotStarted = true;
      let greetingName = "";

      try {
        const savedUser = JSON.parse(localStorage.getItem("lootifyUser"));

        if (savedUser && savedUser.username) {
          greetingName = " " + savedUser.username;
        }
      } catch (error) {
        greetingName = "";
      }

      addMessage("Hey" + greetingName + "! Need help with the marketplace? Ask about prices, Loot Codes, reviews, order tracking, packages, or live support.", "bot");
      if (window.lootifyMaintenanceActive) {
        addMessage("Lootify weekly maintenance is active. Ordering and notify actions may be limited until 4 PM EST.", "bot");
      }
      setOptions();
    }

    function openChatbot() {
      chatbot.classList.add("open");
      chatbotPanel.setAttribute("aria-hidden", "false");
      chatbotToggle.setAttribute("aria-expanded", "true");
      startChatbot();
      scrollChatToLatest();
    }

    function closeChatbot() {
      chatbot.classList.remove("open");
      chatbotPanel.setAttribute("aria-hidden", "true");
      chatbotToggle.setAttribute("aria-expanded", "false");
    }

    chatbotToggle.addEventListener("click", () => {
      if (chatbot.classList.contains("open")) {
        closeChatbot();
      } else {
        openChatbot();
      }
    });

    chatbotClose.addEventListener("click", closeChatbot);

    chatbotInputForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendSmartMessage();
    });

    document.querySelectorAll("[data-chatbot-prompt]").forEach((button) => {
      button.addEventListener("click", () => {
        const prompt = button.getAttribute("data-chatbot-prompt") || "";
        if (window.LootifyLoyalty) {
          window.LootifyLoyalty.award("chat", 1, { reason: "chatbot guide" });
        }
        addMessage(button.textContent.trim(), "user");
        showBotReply(smartReply(prompt));
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && chatbot.classList.contains("open")) {
        closeChatbot();
      }
    });

  window.addMessage = addMessage;
  window.showBotReply = showBotReply;
  window.sendWebhook = sendWebhook;
  window.handleLootCodeHelp = function handleLootCodeHelp() {
    addMessage(" Got a Loot Code? Enter it on the site to unlock your discount!", "bot");
  };
}

function init() {
  initChatbot();
}

document.addEventListener("DOMContentLoaded", init);

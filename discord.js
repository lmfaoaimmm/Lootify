async function initDiscordLogin() {
  console.log("INIT LOGIN");

  const hash = window.location.hash;
  console.log("HASH:", window.location.hash);

  if (hash.includes("access_token")) {
    const params = new URLSearchParams(hash.replace("#", ""));
    const token = params.get("access_token");
    console.log("TOKEN:", token);

    if (token) {
      try {
        const response = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: "Bearer " + token
          }
        });

        if (!response.ok) {
          throw new Error("Discord user fetch failed");
        }

        const user = await response.json();
        console.log("USER OBJECT:", user);

        localStorage.setItem("lootifyUser", JSON.stringify(user));
        displayUser(user);
        renderServerPanel("activity");
        history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Discord login failed:", error);
      }
    }
  }

  const saved = localStorage.getItem("lootifyUser");

  if (saved) {
    console.log("FOUND SAVED USER");
    displayUser(JSON.parse(saved));
  }

  renderServerPanel("activity");
}

function displayUser(user) {
  const box = document.getElementById("userBox");

  if (!box) {
    console.error("userBox NOT FOUND");
    return;
  }

  const avatarUrl = user.avatar
    ? "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png?size=64"
    : "";

  box.className = "discord-auth-card is-logged-in";
  box.innerHTML = `
    <div class="discord-profile-card">
      <span class="discord-profile-status" aria-label="Discord user online"></span>
      ${avatarUrl ? '<img class="discord-profile-avatar" src="' + avatarUrl + '" alt="' + user.username + ' Discord avatar" loading="lazy" />' : '<span class="discord-profile-avatar fallback" aria-hidden="true">' + user.username.charAt(0).toUpperCase() + '</span>'}
      <div class="discord-profile-copy">
        <span>Logged in as</span>
        <strong>${user.username}</strong>
      </div>
      <button class="discord-logout-button" type="button" onclick="logout()" aria-label="Logout of Discord">Logout</button>
    </div>
  `;
}

function logout() {
  localStorage.removeItem("lootifyUser");
  window.location.reload();
}

function renderServerPanel(mode = window.LootifyDiscordMode || "activity") {
  const panel = document.getElementById("discord-activity-panel");

  if (!panel) {
    return;
  }

  window.LootifyDiscordMode = mode;

  const onlineUsers = ["Nova", "Clipz", "AimLab", "RankedAce"];
  const recentMessages = [
    "Nova claimed a Loot Code reward",
    "RankedAce started a Ranked Carry order",
    "Clipz joined the Tweaking waitlist"
  ];
  const items = mode === "users" ? onlineUsers : recentMessages;

  panel.innerHTML = `
    <li class="discord-panel-controls">
      <button class="discord-panel-tab ${mode === "activity" ? "active" : ""}" type="button" data-discord-panel="activity" aria-label="Show Discord activity">Activity</button>
      <button class="discord-panel-tab ${mode === "users" ? "active" : ""}" type="button" data-discord-panel="users" aria-label="Show online Discord users">Online Users</button>
    </li>
    <li><span class="discord-online-dot" aria-hidden="true"></span>${42 + Math.floor(Math.random() * 18)} members online</li>
    ${items.map((item) => "<li>" + item + "</li>").join("")}
  `;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-discord-panel]");

  if (!button) {
    return;
  }

  renderServerPanel(button.dataset.discordPanel);
});

window.logout = logout;
window.LootifyDiscord = {
  renderServerPanel
};

function init() {
  initDiscordLogin();
}

document.addEventListener("DOMContentLoaded", init);

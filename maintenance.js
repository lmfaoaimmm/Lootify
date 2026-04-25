function initMaintenance() {
      const banner = document.getElementById("maintenance-banner");

      function isMaintenanceWindow() {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          weekday: "short",
          hour: "numeric",
          hour12: false
        }).formatToParts(new Date());
        const weekday = parts.find((part) => part.type === "weekday")?.value;
        const hour = Number(parts.find((part) => part.type === "hour")?.value);

        return weekday === "Fri" && hour >= 14 && hour < 16;
      }

      function setDisabledState(element, disabled) {
        const isAnchor = element.tagName.toLowerCase() === "a";
        element.classList.toggle("maintenance-disabled", disabled);
        element.setAttribute("aria-disabled", String(disabled));

        if (isAnchor) {
          if (disabled) {
            element.dataset.maintenanceHref = element.getAttribute("href") || "";
            element.removeAttribute("href");
            element.setAttribute("tabindex", "-1");
          } else if (element.dataset.maintenanceHref) {
            element.setAttribute("href", element.dataset.maintenanceHref);
            element.removeAttribute("tabindex");
            delete element.dataset.maintenanceHref;
          }
        } else {
          element.disabled = disabled;
        }
      }

      window.updateLootifyMaintenanceState = function updateLootifyMaintenanceState() {
        const active = isMaintenanceWindow();
        window.lootifyMaintenanceActive = active;
        document.body.classList.toggle("maintenance-active", active);

        if (banner) {
          banner.hidden = !active;
        }

        document.querySelectorAll("[data-maintenance-disable]").forEach((element) => {
          setDisabledState(element, active);
        });
      };

      document.addEventListener("click", (event) => {
        const blocked = event.target.closest("[data-maintenance-disable]");

        if (blocked && window.lootifyMaintenanceActive) {
          event.preventDefault();
          window.showBotReply("Lootify weekly maintenance is active every Friday 2-4 PM EST. Ordering, Notify Me, and Tweaking service actions are paused until the banner clears.");
        }
      });

      window.updateLootifyMaintenanceState();
      window.setInterval(window.updateLootifyMaintenanceState, 60000);
    }

function init() {
  initMaintenance();
}

document.addEventListener("DOMContentLoaded", init);

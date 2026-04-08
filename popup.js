document.addEventListener("DOMContentLoaded", () => {
  const storage = chrome.storage.local;
  const togglesEl = document.getElementById("toggles");
  const siteNameEl = document.getElementById("siteName");
  const hiddenCountEl = document.getElementById("hiddenCount");

  // Determine current site
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    let hostname;
    try { hostname = new URL(tab.url).hostname.replace("www.", ""); } catch { return; }

    const siteKey = Object.keys(SITES).find((k) => hostname.includes(k));
    if (siteKey) {
      siteNameEl.textContent = siteKey.charAt(0).toUpperCase() + siteKey.slice(1);
    } else {
      siteNameEl.textContent = "Ikke støttet nettsted";
    }
  });

  // Build toggles from first site's categories (labels are shared)
  const firstSite = SITES[Object.keys(SITES)[0]];
  const categories = Object.keys(firstSite.categories);

  storage.get(DEFAULT_SETTINGS, (settings) => {
    categories.forEach((key) => {
      const cat = firstSite.categories[key];
      const row = document.createElement("div");
      row.className = "toggle-row";

      const label = document.createElement("label");
      label.className = "toggle-label";
      label.textContent = cat.label;
      label.setAttribute("for", "toggle-" + key);

      const sw = document.createElement("label");
      sw.className = "switch";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = "toggle-" + key;
      input.checked = settings[key] !== false;
      input.addEventListener("change", () => {
        storage.set({ [key]: input.checked });
      });

      const slider = document.createElement("span");
      slider.className = "slider";

      sw.appendChild(input);
      sw.appendChild(slider);
      row.appendChild(label);
      row.appendChild(sw);
      togglesEl.appendChild(row);
    });
  });

  // Listen for stats from content script
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "stats" || msg.type === "updateBadge") {
      hiddenCountEl.textContent = msg.count || 0;
    }
  });

  // Request stats
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getStats" }).catch(() => {});
    }
  });
});

(function () {
  "use strict";

  const hostname = location.hostname.replace("www.", "");
  const siteKey = Object.keys(SITES).find((k) => hostname.includes(k));
  if (!siteKey) return;

  const site = SITES[siteKey];
  let settings = { ...DEFAULT_SETTINGS };
  let hiddenCount = 0;

  function getSiteDisplayName() {
    return siteKey.charAt(0).toUpperCase() + siteKey.slice(1);
  }

  function findArticleContainer(el) {
    if (!el) return null;
    const containers = site.articleContainer.split(",").map((s) => s.trim());
    let current = el;
    while (current && current !== document.body) {
      for (const selector of containers) {
        if (current.matches(selector)) return current;
      }
      current = current.parentElement;
    }
    // If no container found, try the link's direct parent that looks like a card
    current = el.parentElement;
    while (current && current !== document.body) {
      const rect = current.getBoundingClientRect();
      if (rect.height > 50 && rect.width > 100) return current;
      current = current.parentElement;
    }
    return el.parentElement;
  }

  function isAiContent(el) {
    const text = (el.textContent || "").toLowerCase();
    const html = (el.innerHTML || "").toLowerCase();
    const imgAlts = el.querySelectorAll("img");
    let combined = text + " " + html;
    imgAlts.forEach((img) => {
      combined += " " + (img.alt || "") + " " + (img.title || "");
    });
    combined = combined.toLowerCase();
    return AI_SIGNALS.some((signal) => combined.includes(signal));
  }

  function hideArticles() {
    hiddenCount = 0;
    const disabledCategories = Object.keys(settings).filter((k) => !settings[k]);
    if (disabledCategories.length === 0) {
      // Show everything
      document.querySelectorAll("[data-defog-hidden]").forEach((el) => {
        el.style.display = "";
        el.removeAttribute("data-defog-hidden");
      });
      updateBadge();
      return;
    }

    // Reset previously hidden
    document.querySelectorAll("[data-defog-hidden]").forEach((el) => {
      el.style.display = "";
      el.removeAttribute("data-defog-hidden");
    });

    const alreadyHidden = new Set();

    for (const cat of disabledCategories) {
      const catConfig = site.categories[cat];
      if (!catConfig) continue;

      // URL/selector-based matching
      for (const selector of catConfig.selectors) {
        document.querySelectorAll(selector).forEach((link) => {
          const container = findArticleContainer(link);
          if (container && !alreadyHidden.has(container)) {
            container.style.display = "none";
            container.setAttribute("data-defog-hidden", cat);
            alreadyHidden.add(container);
            hiddenCount++;
          }
        });
      }
    }

    // AI detection pass
    if (disabledCategories.includes("ai")) {
      const allContainers = document.querySelectorAll(site.articleContainer);
      allContainers.forEach((container) => {
        if (!alreadyHidden.has(container) && isAiContent(container)) {
          container.style.display = "none";
          container.setAttribute("data-defog-hidden", "ai");
          alreadyHidden.add(container);
          hiddenCount++;
        }
      });
    }

    updateBadge();
  }

  function updateBadge() {
    chrome.runtime.sendMessage({
      type: "updateBadge",
      count: hiddenCount,
      site: getSiteDisplayName()
    });
  }

  function loadAndApply() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      settings = result;
      hideArticles();
    });
  }

  // Listen for setting changes from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      for (const key of Object.keys(changes)) {
        if (key in settings) {
          settings[key] = changes[key].newValue;
        }
      }
      hideArticles();
    }
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "getStats") {
      chrome.runtime.sendMessage({
        type: "stats",
        count: hiddenCount,
        site: getSiteDisplayName()
      });
    }
  });

  // Run on load
  loadAndApply();

  // Re-run on DOM changes (infinite scroll, dynamic loading)
  const observer = new MutationObserver(() => {
    loadAndApply();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

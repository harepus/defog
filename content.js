(function () {
  "use strict";

  const hostname = location.hostname.replace("www.", "");
  const siteKey = Object.keys(SITES).find((k) => hostname.includes(k));
  if (!siteKey) return;

  const site = SITES[siteKey];
  const storage = chrome.storage.local;
  let settings = { ...DEFAULT_SETTINGS };
  let hiddenCount = 0;

  function getSiteDisplayName() {
    return siteKey.charAt(0).toUpperCase() + siteKey.slice(1);
  }

  function getContentContainers() {
    return Array.from(document.querySelectorAll(site.articleContainer));
  }

  function getContainerHrefs(container) {
    return Array.from(container.querySelectorAll("a[href]")).map((link) => {
      const raw = (link.getAttribute("href") || "").toLowerCase();
      const resolved = (link.href || "").toLowerCase();
      return `${raw} ${resolved}`;
    });
  }

  function containerMatchesCategory(container, catConfig) {
    if (!container || !catConfig) return false;
    const hrefs = getContainerHrefs(container);
    if (hrefs.length === 0) return false;

    if (Array.isArray(catConfig.urlPatterns) && catConfig.urlPatterns.length > 0) {
      const patterns = catConfig.urlPatterns.map((p) => p.toLowerCase());
      for (const pattern of patterns) {
        if (hrefs.some((href) => href.includes(pattern))) return true;
      }
    }

    if (Array.isArray(catConfig.selectors) && catConfig.selectors.length > 0) {
      for (const selector of catConfig.selectors) {
        if (container.querySelector(selector)) return true;
      }
    }

    return false;
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
    const allContainers = getContentContainers();
    const nonAiCategories = disabledCategories.filter((cat) => cat !== "ai");

    for (const container of allContainers) {
      for (const cat of nonAiCategories) {
        const catConfig = site.categories[cat];
        if (!catConfig) continue;
        if (containerMatchesCategory(container, catConfig)) {
          container.style.display = "none";
          container.setAttribute("data-defog-hidden", cat);
          alreadyHidden.add(container);
          hiddenCount++;
          break;
        }
      }
    }

    // AI detection pass
    if (disabledCategories.includes("ai")) {
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
    storage.get(DEFAULT_SETTINGS, (result) => {
      settings = result;
      hideArticles();
    });
  }

  // Listen for setting changes from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
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

(function () {
  "use strict";

  const hostname = location.hostname.replace("www.", "");
  const siteKey = Object.keys(SITES).find((k) => hostname.includes(k));
  if (!siteKey) return;

  const site = SITES[siteKey];
  const storage = chrome.storage.local;
  let settings = { ...DEFAULT_SETTINGS };
  let hiddenCount = 0;
  let isContextAlive = true;
  let observer = null;

  function hasInvalidatedContext(error) {
    const message = (error && error.message ? error.message : String(error || "")).toLowerCase();
    return message.includes("extension context invalidated");
  }

  function deactivateContext() {
    if (!isContextAlive) return;
    isContextAlive = false;
    if (observer) observer.disconnect();
  }

  function safeRun(fn) {
    if (!isContextAlive) return;
    if (!chrome.runtime || !chrome.runtime.id) {
      deactivateContext();
      return;
    }
    try {
      return fn();
    } catch (error) {
      if (hasInvalidatedContext(error)) {
        deactivateContext();
        return;
      }
      throw error;
    }
  }

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

    if (Array.isArray(catConfig.textPatterns) && catConfig.textPatterns.length > 0) {
      const text = (container.textContent || "").toLowerCase();
      if (text.length > 0) {
        for (const pattern of catConfig.textPatterns) {
          if (text.includes(String(pattern).toLowerCase())) return true;
        }
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

  function hideArticlesCore() {
    try {
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

      // AI detection pass — site-specific textPatterns first, then general signals
      if (disabledCategories.includes("ai")) {
        const aiConfig = site.categories["ai"];
        allContainers.forEach((container) => {
          if (!alreadyHidden.has(container)) {
            const matchesSitePattern = aiConfig && containerMatchesCategory(container, aiConfig);
            if (matchesSitePattern || isAiContent(container)) {
              container.style.display = "none";
              container.setAttribute("data-defog-hidden", "ai");
              alreadyHidden.add(container);
              hiddenCount++;
            }
          }
        });
      }

      updateBadge();
    } catch (error) {
      if (hasInvalidatedContext(error)) {
        deactivateContext();
        return;
      }
      throw error;
    }
  }

  function hideArticles() {
    safeRun(() => {
      hideArticlesCore();
    });
  }

  function updateBadge() {
    safeRun(() => {
      chrome.runtime.sendMessage(
        {
          type: "updateBadge",
          count: hiddenCount,
          site: getSiteDisplayName()
        },
        () => {
          const err = chrome.runtime.lastError;
          if (err && hasInvalidatedContext(err)) {
            deactivateContext();
          }
        }
      );
    });
  }

  function loadAndApply() {
    safeRun(() => {
      storage.get(DEFAULT_SETTINGS, (result) => {
        safeRun(() => {
          settings = result;
          hideArticlesCore();
        });
      });
    });
  }

  // Listen for setting changes from popup
  chrome.storage.onChanged.addListener((changes, area) => {
    safeRun(() => {
      if (area === "local") {
        for (const key of Object.keys(changes)) {
          if (key in settings) {
            settings[key] = changes[key].newValue;
          }
        }
        hideArticlesCore();
      }
    });
  });

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "getStats") {
      sendResponse({ count: hiddenCount, site: getSiteDisplayName() });
      return true;
    }
  });

  // Run on load
  loadAndApply();

  // If the old script context survives a reload momentarily, stop spammy uncaught errors.
  window.addEventListener("error", (event) => {
    if (hasInvalidatedContext(event.error || event.message)) {
      deactivateContext();
      event.preventDefault();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (hasInvalidatedContext(event.reason)) {
      deactivateContext();
      event.preventDefault();
    }
  });

  // Re-run on DOM changes (infinite scroll, dynamic loading)
  observer = new MutationObserver(() => {
    safeRun(() => {
      loadAndApply();
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

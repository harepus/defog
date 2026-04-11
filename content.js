(function () {
  "use strict";

  const hostname = location.hostname.replace("www.", "");
  const siteKey = Object.keys(SITES).find((k) => hostname.includes(k));
  if (!siteKey) return;

  const site = SITES[siteKey];
  const storage = chrome.storage.local;
  let settings = { ...DEFAULT_SETTINGS };
  let hiddenCount = 0;
  let containerCount = 0;
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

  function resolveHideTarget(container) {
    let target = container;
    let current = container;

    for (let depth = 0; depth < 6; depth++) {
      const parent = current.parentElement;
      if (!parent || parent === document.body || parent === document.documentElement) break;

      const parentStyle = window.getComputedStyle(parent);
      const parentDisplay = parentStyle.display || "";
      const parentIsLayout = parentDisplay.includes("grid") || parentDisplay.includes("flex");

      if (parentIsLayout) {
        target = current;
        break;
      }

      const children = Array.from(parent.children).filter(
        (el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE"
      );

      if (children.length === 1) {
        current = parent;
        target = parent;
        continue;
      }

      const currentRect = current.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const nearSameWidth = Math.abs(parentRect.width - currentRect.width) <= 2;
      const nearSameHeight = Math.abs(parentRect.height - currentRect.height) <= 2;

      if (nearSameWidth && nearSameHeight) {
        current = parent;
        target = parent;
        continue;
      }

      break;
    }

    return target;
  }

  function hideContainer(container, category, alreadyHidden) {
    const hideTarget = resolveHideTarget(container);
    if (!hideTarget || alreadyHidden.has(hideTarget)) return false;

    hideTarget.style.display = "none";
    hideTarget.setAttribute("data-defog-hidden", category);
    alreadyHidden.add(hideTarget);
    return true;
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
    // Layer 1: targeted check using site-specific aiIndicators
    if (site.aiIndicators) {
      const { imageCredit = [], byline = [] } = site.aiIndicators;

      if (imageCredit.length > 0) {
        const creditEls = el.querySelectorAll(
          "figcaption, [class*='credit'], [class*='caption'], [class*='photo'], [class*='image-text']"
        );
        for (const credit of creditEls) {
          const text = (credit.textContent || "").toLowerCase();
          if (imageCredit.some((s) => text.includes(s.toLowerCase()))) return true;
        }
      }

      if (byline.length > 0) {
        const bylineEls = el.querySelectorAll(
          "[class*='byline'], [class*='author'], .author, .byline, [rel='author']"
        );
        for (const bEl of bylineEls) {
          const text = (bEl.textContent || "").toLowerCase();
          if (byline.some((s) => text.includes(s.toLowerCase()))) return true;
        }
      }
    }

    // Layer 2: general AI_SIGNALS scan across full element text + img attributes
    const text = (el.textContent || "").toLowerCase();
    const imgAlts = el.querySelectorAll("img");
    let combined = text;
    imgAlts.forEach((img) => {
      combined += " " + (img.alt || "") + " " + (img.title || "");
    });
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
        containerCount = getContentContainers().length;
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
      containerCount = allContainers.length;
      const nonAiCategories = disabledCategories.filter((cat) => cat !== "ai");

      for (const container of allContainers) {
        for (const cat of nonAiCategories) {
          const catConfig = site.categories[cat];
          if (!catConfig) continue;
          if (containerMatchesCategory(container, catConfig)) {
            if (hideContainer(container, cat, alreadyHidden)) {
              hiddenCount++;
            }
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
              if (hideContainer(container, "ai", alreadyHidden)) {
                hiddenCount++;
              }
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
      sendResponse({ count: hiddenCount, site: getSiteDisplayName(), containerCount });
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

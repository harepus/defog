# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Defog is a Manifest V3 Chrome extension that hides article categories on Norwegian news sites (VG, VGTV, NRK, Dagbladet, DN). Users toggle categories on/off via the popup; hidden article counts appear as a badge on the extension icon.

There is no build step — all files are plain JavaScript loaded directly by Chrome.

## Loading the Extension

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

After editing any file, click the reload icon on the extensions page and refresh the target news site.

## File Roles

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest — permissions, host patterns, script injection order |
| `sites.js` | All site definitions, category rules, AI signals, and `DEFAULT_SETTINGS`. Injected before `content.js` so its globals are available |
| `content.js` | Content script — runs on each page, reads settings from `chrome.storage.local`, hides matching article containers via `MutationObserver` |
| `background.js` | Service worker — receives `updateBadge` messages from content script and sets the badge text/color |
| `popup.html` / `popup.js` | Action popup — renders category toggles, writes settings to storage, queries current tab for live hidden count |

## Architecture

### Adding a new site

1. Add the hostname to `host_permissions` and `content_scripts.matches` in `manifest.json`.
2. Define `const mySiteCategoryRules` in `sites.js` following the same shape as `vgCategoryRules` — each category key maps to `{ urlPatterns, selectors, textPatterns }`.
3. Add an entry to the `SITES` object with `version: 1`, `categories: buildCategories(mySiteCategoryRules)`, an `articleContainer` CSS selector, and an `aiIndicators` object with `imageCredit` and `byline` string arrays.
4. See CONTRIBUTING.md for the full schema reference and test checklist.

### Adding a new category

1. Add the key and label to `COMMON_CATEGORIES` in `sites.js`.
2. Add matching rules for each site in their respective `*CategoryRules` objects.
3. The new key is automatically included in `DEFAULT_SETTINGS` (default `true`) and rendered as a toggle in the popup.

### Matching logic (content.js)

For each article container on the page, `containerMatchesCategory` checks three things in order (most to least stable against DOM changes):
- `urlPatterns` — substring match against all `href` attributes inside the container
- `selectors` — `querySelector` within the container
- `textPatterns` — substring match against `container.textContent`

AI content gets a second pass. `isAiContent` runs two layers:
1. Targeted check — queries figcaption/credit elements against `site.aiIndicators.imageCredit` and byline elements against `site.aiIndicators.byline` (more precise, avoids false positives from article body text).
2. General fallback — scans full element text + img alt/title against the global `AI_SIGNALS` list.

### Health check (popup)

The popup shows a colored dot in the site-info bar:
- Green — `articleContainer` selector found at least one container on the current page.
- Red — no containers found; selector likely needs updating after a site DOM change.
- Grey (default) — content script hasn't responded yet (tab not ready or unsupported site).

`resolveHideTarget` walks up the DOM from the matched element to find the outermost single-child or flex/grid-layout ancestor, so the correct layout slot is removed rather than just an inner element.

### Context invalidation

Content scripts survive extension reloads but lose the runtime connection. All chrome API calls are wrapped in `safeRun`, which checks `chrome.runtime.id` and intercepts "extension context invalidated" errors to gracefully disconnect the `MutationObserver`.

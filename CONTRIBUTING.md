# Contributing to Defog

## Site entry format

Each supported site lives in `sites.js` under the `SITES` object. The schema:

```js
"example.no": {
  version: 1,                // increment when articleContainer or matching logic changes
  categories: buildCategories(exampleCategoryRules),
  articleContainer: "article, .teaser",   // CSS selector for individual article cards
  aiIndicators: {
    imageCredit: ["midjourney", "ki-generert"],  // strings to match in figcaption / credit elements
    byline: ["kunstig intelligens"]              // strings to match in author / byline elements
  }
}
```

### Category rules

Define a `const exampleCategoryRules` object before `SITES`. Each key must be one of the keys in `COMMON_CATEGORIES` (`sport`, `sladder`, `nyheter`, `okonomi`, `kultur`, `debatt`, `video`, `ai`).

Each category entry supports three matching layers — use whichever apply, in priority order:

| Field | Matches against | Stability |
|-------|----------------|-----------|
| `urlPatterns` | All `href` attributes inside the container (substring match) | Most stable — URL paths change rarely |
| `selectors` | `querySelector` inside the container | Moderate — more stable than class names |
| `textPatterns` | `container.textContent` (case-insensitive substring) | Last resort — breaks if editorial language changes |

```js
const exampleCategoryRules = {
  sport: {
    urlPatterns: ["/sport/"],
    selectors: ['a[href*="/sport/"]'],
    textPatterns: []
  },
  // ... other categories
};
```

Omit categories you don't have rules for — `buildCategories` fills them with empty arrays.

## Adding a new site

1. Add the hostname to `host_permissions` and `content_scripts.matches` in `manifest.json`.
2. Define `const mySiteCategoryRules` in `sites.js`.
3. Add an entry to `SITES` with `version: 1` and an `articleContainer` selector.

## Testing your changes

1. Open `chrome://extensions`, enable Developer mode, click **Load unpacked**, select this directory.
2. Navigate to the target site (e.g. vg.no).
3. Open the Defog popup — the green dot means article containers were found. Red means your `articleContainer` selector needs updating.
4. Disable a category (e.g. Sport) — matching articles should disappear immediately.
5. Re-enable the category — articles should reappear.
6. Scroll down to trigger infinite-scroll loading — newly loaded articles should also be filtered.
7. After editing any file, click **Reload** on the extension card and refresh the news site.

## Updating version

Increment the `version` field when:
- The `articleContainer` selector changes.
- A `urlPatterns` entry is added or removed.
- The `aiIndicators` structure changes.

This makes it easier to track which sites need re-testing after DOM changes on the news sites.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const sitesPath = path.join(repoRoot, "sites.js");

const sitesSrc = fs.readFileSync(sitesPath, "utf8") + "\n;globalThis.__SITES__ = SITES;";
const context = { globalThis: {} };
vm.createContext(context);
vm.runInContext(sitesSrc, context);

const SITES = context.globalThis.__SITES__;
if (!SITES) {
  throw new Error("Kunne ikke lese SITES fra sites.js");
}

const targets = [
  ["vg.no", "https://www.vg.no/"],
  ["vg.no", "https://www.vg.no/sport"],
  ["vg.no", "https://www.vg.no/rampelys"],
  ["vg.no", "https://www.vg.no/nyheter"],
  ["vg.no", "https://www.vg.no/meninger"],
  ["nrk.no", "https://www.nrk.no/"],
  ["nrk.no", "https://www.nrk.no/sport/"],
  ["nrk.no", "https://www.nrk.no/fotballvm2026/"],
  ["nrk.no", "https://www.nrk.no/kultur/"],
  ["nrk.no", "https://www.nrk.no/norge/"],
  ["nrk.no", "https://www.nrk.no/stor-oslo/"],
  ["nrk.no", "https://www.nrk.no/ostfold/"],
  ["nrk.no", "https://www.nrk.no/nordland/"],
  ["nrk.no", "https://www.nrk.no/okonomi/"],
  ["nrk.no", "https://www.nrk.no/urix/"],
  ["nrk.no", "https://www.nrk.no/ytring/"]
];

const expectedMissingCategories = {};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(haystack, needle) {
  const regex = new RegExp(escapeRegExp(needle), "gi");
  const matches = haystack.match(regex);
  return matches ? matches.length : 0;
}

async function fetchPage(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (Defog smoke test)" }
  });

  return {
    status: response.status,
    finalUrl: response.url,
    html: await response.text()
  };
}

function countCategoryHits(html, siteConfig) {
  const byCategory = {};
  for (const [category, config] of Object.entries(siteConfig.categories)) {
    if (!config.urlPatterns || config.urlPatterns.length === 0) continue;
    byCategory[category] = config.urlPatterns.reduce((sum, pattern) => {
      return sum + countMatches(html, pattern);
    }, 0);
  }
  return byCategory;
}

function getAggregatedSummary(results) {
  const summary = {};
  for (const row of results) {
    const siteSummary = summary[row.site] || {};
    for (const [category, hits] of Object.entries(row.categoryHits)) {
      siteSummary[category] = (siteSummary[category] || 0) + hits;
    }
    summary[row.site] = siteSummary;
  }
  return summary;
}

async function run() {
  const rows = [];

  for (const [siteKey, url] of targets) {
    const site = SITES[siteKey];
    if (!site) continue;

    const page = await fetchPage(url);
    rows.push({
      site: siteKey,
      url,
      status: page.status,
      finalUrl: page.finalUrl,
      articleTagCount: countMatches(page.html, "<article"),
      categoryHits: countCategoryHits(page.html, site)
    });
  }

  for (const row of rows) {
    const catText = Object.entries(row.categoryHits)
      .map(([cat, hits]) => `${cat}:${hits}`)
      .join(" | ");

    console.log(`${row.site} | ${row.url}`);
    console.log(`  status=${row.status} final=${row.finalUrl}`);
    console.log(`  articleTags=${row.articleTagCount} | ${catText}`);
  }

  const summary = getAggregatedSummary(rows);
  console.log("\nOppsummering per site:");
  for (const [site, categories] of Object.entries(summary)) {
    const list = Object.entries(categories)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([cat, hits]) => `${cat}:${hits}`)
      .join(" | ");
    console.log(`  ${site} -> ${list}`);
  }

  console.log("\nMulige avvik (sum == 0):");
  let issues = 0;
  for (const [site, categories] of Object.entries(summary)) {
    for (const [cat, hits] of Object.entries(categories)) {
      const expectedMissing = expectedMissingCategories[site]?.includes(cat) === true;
      if (expectedMissing) continue;
      if (hits === 0) {
        issues++;
        console.log(`  ${site} -> ${cat} matcher ingen lenker i testsettet`);
      }
    }
  }
  if (issues === 0) {
    console.log("  Ingen uventede null-treff funnet i testsettet.");
  }

  console.log("\nForventet fravær:");
  let expectedCount = 0;
  for (const [site, categories] of Object.entries(expectedMissingCategories)) {
    for (const cat of categories) {
      expectedCount++;
      const hits = summary[site]?.[cat] ?? 0;
      console.log(`  ${site} -> ${cat} (hits: ${hits})`);
    }
  }
  if (expectedCount === 0) {
    console.log("  Ingen.");
  }
}

run().catch((error) => {
  console.error("Smoke-test feilet:", error);
  process.exit(1);
});

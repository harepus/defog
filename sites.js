const COMMON_CATEGORIES = {
  sport: { label: "Sport" },
  sladder: { label: "Sladder / Rampelys" },
  nyheter: { label: "Nyheter" },
  okonomi: { label: "Økonomi" },
  kultur: { label: "Kultur / Underholdning" },
  debatt: { label: "Debatt / Meninger" },
  video: { label: "Video / TV" },
  ai: { label: "AI-generert innhold" }
};

function buildCategories(siteOverrides) {
  const categories = {};
  for (const [key, baseConfig] of Object.entries(COMMON_CATEGORIES)) {
    const override = siteOverrides[key] || {};
    categories[key] = {
      label: baseConfig.label,
      urlPatterns: [],
      selectors: [],
      textPatterns: [],
      ...override
    };
  }
  return categories;
}

const vgCategoryRules = {
  sport: {
    urlPatterns: ["/sport/"],
    selectors: ['a[href*="/sport/"]']
  },
  sladder: {
    urlPatterns: ["/rampelys/"],
    selectors: ['a[href*="/rampelys/"]']
  },
  nyheter: {
    urlPatterns: ["/nyheter/"],
    selectors: ['a[href*="/nyheter/"]']
  },
  okonomi: {
    urlPatterns: [
      "/okonomi/",
      "/dinepenger",
      "e24.no/",
      "/boers",
      "/bors"
    ],
    selectors: [
      'a[href*="/okonomi/"]',
      'a[href*="/dinepenger"]',
      'a[href*="e24.no/"]',
      'a[href*="/boers"]',
      'a[href*="/bors"]'
    ]
  },
  kultur: {
    urlPatterns: ["/kultur/", "/underholdning"],
    selectors: [
      'a[href*="/kultur/"]',
      'a[href*="/underholdning"]'
    ]
  },
  debatt: {
    urlPatterns: ["/meninger/", "/kommentar-"],
    selectors: [
      'a[href*="/meninger/"]',
      'a[href*="/kommentar-"]'
    ]
  },
  video: {
    urlPatterns: ["/video/", "vgtv.no/"],
    selectors: ['a[href*="/video/"]', 'a[href*="vgtv.no/"]']
  }
};

const nrkCategoryRules = {
  sport: {
    urlPatterns: ["/sport/", "/fotballvm2026/", "resultater.nrk.no/fotball/"],
    selectors: [
      'a[href*="/sport/"]',
      'a[href*="/fotballvm2026/"]',
      'a[href*="resultater.nrk.no/fotball/"]'
    ]
  },
  sladder: {
    urlPatterns: ["/underholdning/", "/livsstil/", "p3.no", "p3.no/"],
    selectors: [
      'a[href*="/underholdning/"]',
      'a[href*="/livsstil/"]',
      'a[href*="p3.no"]'
    ]
  },
  nyheter: {
    urlPatterns: [
      "/norge/",
      "/verden/",
      "/urix/",
      "/stor-oslo/",
      "/ostfold/",
      "/nordland/",
      "/buskerud/",
      "/sorlandet/",
      "/rogaland/",
      "/trondelag/",
      "/vestfoldogtelemark/",
      "/tromsogfinnmark/",
      "/innlandet/",
      "/mr/",
      "/vestland/",
      "/sapmi/",
      "/distrikt/"
    ],
    selectors: [
      'a[href*="/norge/"]',
      'a[href*="/verden/"]',
      'a[href*="/urix/"]',
      'a[href*="/stor-oslo/"]',
      'a[href*="/ostfold/"]',
      'a[href*="/nordland/"]',
      'a[href*="/buskerud/"]',
      'a[href*="/sorlandet/"]',
      'a[href*="/rogaland/"]',
      'a[href*="/trondelag/"]',
      'a[href*="/vestfoldogtelemark/"]',
      'a[href*="/tromsogfinnmark/"]',
      'a[href*="/innlandet/"]',
      'a[href*="/mr/"]',
      'a[href*="/vestland/"]',
      'a[href*="/sapmi/"]',
      'a[href*="/distrikt/"]'
    ],
    textPatterns: [
      "stor-oslo",
      "østfold",
      "ostfold",
      "nordland",
      "buskerud",
      "sørlandet",
      "sorlandet",
      "rogaland",
      "trøndelag",
      "trondelag",
      "vestfold og telemark",
      "troms og finnmark",
      "innlandet",
      "møre og romsdal",
      "more og romsdal",
      "vestland",
      "sápmi",
      "sapmi",
      "distrikt"
    ]
  },
  okonomi: {
    urlPatterns: ["/okonomi/"],
    selectors: ['a[href*="/okonomi/"]']
  },
  kultur: {
    urlPatterns: ["/kultur/"],
    selectors: ['a[href*="/kultur/"]']
  },
  debatt: {
    urlPatterns: ["/ytring/", "/debatt"],
    selectors: ['a[href*="/ytring/"]', 'a[href*="/debatt"]']
  },
  video: {
    urlPatterns: ["/video/", "tv.nrk.no/"],
    selectors: ['a[href*="/video/"]', 'a[href*="tv.nrk.no/"]']
  },
  ai: {
    textPatterns: [
      "illustrasjon: ki",
      "illustrasjon av ki",
      "foto: ki",
      "ki-illustrasjon",
      "ki-bilete",
      "generert av ki",
      "laget av ki"
    ]
  }
};

const dagbladetCategoryRules = {
  sport: {
    urlPatterns: ["/sport/"],
    selectors: ['a[href*="/sport/"]']
  },
  sladder: {
    urlPatterns: ["/kjendis/"],
    selectors: ['a[href*="/kjendis/"]']
  },
  nyheter: {
    urlPatterns: ["/nyheter/"],
    selectors: ['a[href*="/nyheter/"]']
  },
  okonomi: {
    urlPatterns: ["/okonomi/"],
    selectors: ['a[href*="/okonomi/"]']
  },
  kultur: {
    urlPatterns: ["/kultur/", "/underholdning"],
    selectors: ['a[href*="/kultur/"]', 'a[href*="/underholdning"]']
  },
  debatt: {
    urlPatterns: ["/meninger/"],
    selectors: ['a[href*="/meninger/"]']
  },
  video: {
    urlPatterns: ["/video/"],
    selectors: ['a[href*="/video/"]']
  }
};

const dnCategoryRules = {
  sport: {
    urlPatterns: ["/sport/"],
    selectors: ['a[href*="/sport/"]']
  },
  nyheter: {
    urlPatterns: ["/nyheter/", "/politikk/", "/internasjonal/"],
    selectors: [
      'a[href*="/nyheter/"]',
      'a[href*="/politikk/"]',
      'a[href*="/internasjonal/"]'
    ]
  },
  okonomi: {
    urlPatterns: [
      "/okonomi/",
      "/bors/",
      "/boers/",
      "/marked/",
      "/investor/",
      "/makrookonomi/"
    ],
    selectors: [
      'a[href*="/okonomi/"]',
      'a[href*="/bors/"]',
      'a[href*="/boers/"]',
      'a[href*="/marked/"]',
      'a[href*="/investor/"]',
      'a[href*="/makrookonomi/"]'
    ]
  },
  kultur: {
    urlPatterns: ["/kultur/"],
    selectors: ['a[href*="/kultur/"]']
  },
  debatt: {
    urlPatterns: ["/kommentar/", "/innlegg/", "/leder/"],
    selectors: [
      'a[href*="/kommentar/"]',
      'a[href*="/innlegg/"]',
      'a[href*="/leder/"]'
    ]
  },
  video: {
    urlPatterns: ["/video/"],
    selectors: ['a[href*="/video/"]']
  }
};

const SITES = {
  "vg.no": {
    version: 1,
    categories: buildCategories(vgCategoryRules),
    articleContainer: "article.article-extract, article, .article-extract",
    aiIndicators: {
      imageCredit: ["midjourney", "dall-e", "dall·e", "stable diffusion", "ai-generert", "ki-generert", "generert med ki"],
      byline: ["kunstig intelligens", "chatgpt", "copilot"]
    }
  },
  "vgtv.no": {
    version: 1,
    categories: buildCategories(vgCategoryRules),
    articleContainer: "article, .article-extract, .content-item, .video-item",
    aiIndicators: {
      imageCredit: ["midjourney", "dall-e", "dall·e", "stable diffusion", "ai-generert", "ki-generert"],
      byline: ["kunstig intelligens", "chatgpt"]
    }
  },
  "nrk.no": {
    version: 1,
    categories: buildCategories(nrkCategoryRules),
    articleContainer: "article, .kur-room, .lp_plug",
    aiIndicators: {
      imageCredit: ["illustrasjon: ki", "illustrasjon av ki", "foto: ki", "ki-illustrasjon", "ki-bilete", "generert av ki", "laget av ki"],
      byline: ["kunstig intelligens"]
    }
  },
  "dagbladet.no": {
    version: 1,
    categories: buildCategories(dagbladetCategoryRules),
    articleContainer: "article, .news-item, .frontpage-article",
    aiIndicators: {
      imageCredit: ["midjourney", "dall-e", "ai-generert", "ki-generert", "chatgpt"],
      byline: ["kunstig intelligens"]
    }
  },
  "dn.no": {
    version: 1,
    categories: buildCategories(dnCategoryRules),
    articleContainer: "article, .teaser, .story-list-item, .article-item",
    aiIndicators: {
      imageCredit: ["midjourney", "dall-e", "ai-generert", "ki-generert"],
      byline: ["kunstig intelligens"]
    }
  }
};

const AI_SIGNALS = [
  "midjourney", "dall-e", "dall·e",
  "ai-generert", "ai-illustrasjon", "kunstig intelligens",
  "stable diffusion", "chatgpt", "copilot", "sora",
  "ki-generert", "ki generert", "generert med ki",
  "illustrasjon: ki", "illustrasjon: midjourney", "illustrasjon: dall",
  "illustrasjon: stable diffusion",
  "foto: ki", "ki-bilete", "laget av ki", "generert av ki"
];

const DEFAULT_SETTINGS = Object.keys(COMMON_CATEGORIES).reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

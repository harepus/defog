const SITES = {
  "vg.no": {
    categories: {
      sport: {
        label: "Sport",
        urlPatterns: ["/sport/"],
        selectors: ['a[href*="/sport/"]']
      },
      sladder: {
        label: "Sladder / Rampelys",
        urlPatterns: ["/rampelys/"],
        selectors: ['a[href*="/rampelys/"]']
      },
      nyheter: {
        label: "Nyheter",
        urlPatterns: ["/nyheter/"],
        selectors: ['a[href*="/nyheter/"]']
      },
      okonomi: {
        label: "Økonomi",
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
        label: "Kultur / Underholdning",
        urlPatterns: ["/kultur/", "/underholdning"],
        selectors: [
          'a[href*="/kultur/"]',
          'a[href*="/underholdning"]'
        ]
      },
      debatt: {
        label: "Debatt / Meninger",
        urlPatterns: ["/meninger/", "/kommentar-"],
        selectors: [
          'a[href*="/meninger/"]',
          'a[href*="/kommentar-"]'
        ]
      },
      ai: {
        label: "AI-generert innhold",
        urlPatterns: [],
        selectors: []
      }
    },
    articleContainer: "article.article-extract, article, .article-extract"
  },
  "nrk.no": {
    categories: {
      sport: {
        label: "Sport",
        urlPatterns: ["/sport/", "/fotballvm2026/", "resultater.nrk.no/fotball/"],
        selectors: [
          'a[href*="/sport/"]',
          'a[href*="/fotballvm2026/"]',
          'a[href*="resultater.nrk.no/fotball/"]'
        ]
      },
      sladder: {
        label: "Sladder / Rampelys",
        urlPatterns: ["/underholdning/", "p3.no", "p3.no/"],
        selectors: ['a[href*="/underholdning/"]', 'a[href*="p3.no"]']
      },
      nyheter: {
        label: "Nyheter",
        urlPatterns: ["/norge/", "/verden/", "/urix/"],
        selectors: ['a[href*="/norge/"]', 'a[href*="/verden/"]', 'a[href*="/urix/"]']
      },
      okonomi: {
        label: "Økonomi",
        urlPatterns: ["/okonomi/"],
        selectors: ['a[href*="/okonomi/"]']
      },
      kultur: {
        label: "Kultur / Underholdning",
        urlPatterns: ["/kultur/"],
        selectors: ['a[href*="/kultur/"]']
      },
      debatt: {
        label: "Debatt / Meninger",
        urlPatterns: ["/ytring/", "/debatt"],
        selectors: ['a[href*="/ytring/"]', 'a[href*="/debatt"]']
      },
      ai: {
        label: "AI-generert innhold",
        urlPatterns: [],
        selectors: []
      }
    },
    articleContainer: "article, .kur-room, .lp_plug"
  },
  "dagbladet.no": {
    categories: {
      sport: {
        label: "Sport",
        urlPatterns: ["/sport/"],
        selectors: ['a[href*="/sport/"]']
      },
      sladder: {
        label: "Sladder / Rampelys",
        urlPatterns: ["/kjendis/"],
        selectors: ['a[href*="/kjendis/"]']
      },
      nyheter: {
        label: "Nyheter",
        urlPatterns: ["/nyheter/"],
        selectors: ['a[href*="/nyheter/"]']
      },
      okonomi: {
        label: "Økonomi",
        urlPatterns: ["/okonomi/"],
        selectors: ['a[href*="/okonomi/"]']
      },
      kultur: {
        label: "Kultur / Underholdning",
        urlPatterns: ["/kultur/", "/underholdning/"],
        selectors: ['a[href*="/kultur/"]', 'a[href*="/underholdning/"]']
      },
      debatt: {
        label: "Debatt / Meninger",
        urlPatterns: ["/meninger/"],
        selectors: ['a[href*="/meninger/"]']
      },
      ai: {
        label: "AI-generert innhold",
        urlPatterns: [],
        selectors: []
      }
    },
    articleContainer: "article, .news-item, .frontpage-article"
  }
};

const AI_SIGNALS = [
  "midjourney", "dall-e", "dall·e", "generert", "ai-generert",
  "kunstig intelligens", "ai-illustrasjon", "illustrasjon:",
  "stable diffusion", "chatgpt", "copilot",
  "ki-generert", "ki generert", "generert med ki"
];

const DEFAULT_SETTINGS = {
  sport: true,
  sladder: true,
  nyheter: true,
  okonomi: true,
  kultur: true,
  debatt: true,
  ai: true
};

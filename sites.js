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
        urlPatterns: ["/underholdning/", "/livsstil/", "p3.no", "p3.no/"],
        selectors: [
          'a[href*="/underholdning/"]',
          'a[href*="/livsstil/"]',
          'a[href*="p3.no"]'
        ]
      },
      nyheter: {
        label: "Nyheter",
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
        selectors: [],
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
  "midjourney", "dall-e", "dall·e",
  "ai-generert", "ai-illustrasjon", "kunstig intelligens",
  "stable diffusion", "chatgpt", "copilot", "sora",
  "ki-generert", "ki generert", "generert med ki",
  "illustrasjon: ki", "illustrasjon: midjourney", "illustrasjon: dall",
  "illustrasjon: stable diffusion",
  "foto: ki", "ki-bilete", "laget av ki", "generert av ki"
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

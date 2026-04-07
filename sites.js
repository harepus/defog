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
    articleContainer: "article, [data-component], .article-extract, .af, .peer"
  },
  "nrk.no": {
    categories: {
      sport: {
        label: "Sport",
        urlPatterns: ["/sport/"],
        selectors: ['a[href*="/sport/"]']
      },
      sladder: {
        label: "Sladder / Rampelys",
        urlPatterns: ["/underholdning/"],
        selectors: ['a[href*="/underholdning/"]']
      },
      nyheter: {
        label: "Nyheter",
        urlPatterns: ["/norge/", "/verden/"],
        selectors: ['a[href*="/norge/"]', 'a[href*="/verden/"]']
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
        urlPatterns: ["/ytring/"],
        selectors: ['a[href*="/ytring/"]']
      },
      ai: {
        label: "AI-generert innhold",
        urlPatterns: [],
        selectors: []
      }
    },
    articleContainer: "article, .kur-room, .lp_plugin"
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
  "stable diffusion", "chatgpt", "copilot"
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

# Defog — Nettside Redesign

**Dato:** 2026-04-08  
**Scope:** `defog-site/index.html` — fullstendig visuell redesign  
**Mål:** Nettsiden skal speile Chrome extension-paletten og bære den visuelle narrativen "lys som bryter gjennom tåke"

---

## Narrativ og konsept

Defog handler om å rydde bort støy — tåke — fra nyhetsbildet. Designet bærer denne metaforen gjennom hele siden:

1. **Hero (mørkt)** — brukeren starter i tåka. Mørk bakgrunn, mystiske fog-striper.
2. **Gjennombrudd** — logoen er lyskilden. Lysstråler skjærer ned gjennom fog-stripene. Amber-glow under CTA-knappen.
3. **Overgang** — en gradient smelter fra natt til dag. Amber-burst markerer gjennombruddsøyeblikket.
4. **Innhold (lyst)** — brukeren har brutt gjennom. Alt er klart og lyst. Ingen retur til mørket.

---

## Palett

| Token | Verdi | Bruk |
|---|---|---|
| `--dark-bg` | `#0e0e11` | Hero-bakgrunn |
| `--amber` | `#f59e0b` | Primær aksent, logo, CTA-knapp, toggles "på", steg-numre |
| `--amber-glow` | `rgba(245,158,11,0.22)` | CTA-glød, text-shadow på highlight-ord |
| `--amber-light` | `#fef3c7` | Feature-ikoners bakgrunn (amber-100) |
| `--amber-icon` | `#d97706` | SVG-ikon stroke inni feature-ikonboks |
| `--light-1` | `#ffffff` | Hvite seksjoner (features, categories) |
| `--light-2` | `#f3f4f6` | Lysgrå seksjoner (sites-bar, how-it-works, CTA) |
| `--text` | `#111827` | Primær brødtekst |
| `--text-soft` | `#374151` | Sekundær tekst |
| `--text-muted` | `#6b7280` | Tertiary tekst, subtitles |
| `--text-fog` | `#71717a` | Hero-undertekst (zinc-500, litt kjølig) |
| `--border` | `#e5e7eb` | Kortgrenser, skillelinjer |
| `--zinc-off` | `#e5e7eb` | Toggle "av"-tilstand |

Extension-popup bruker `#1a1a1e` som bakgrunn og `#f59e0b`/`#fbbf24` som amber. Nettsiden deler amber-tonene direkte — det er bindeleddet mellom popup og nettside.

---

## Typografi

Uendret fra eksisterende:
- **Fraunces** (serif, Google Fonts) — overskrifter (`h1`, `h2`)
- **DM Sans** (sans-serif, Google Fonts) — brødtekst, knapper, labels

Ny bruk av typografisk hierarki:
- Amber-farget **section badge** (`#d97706`, uppercase, border-radius 100px) introduserer hver seksjon
- `h1` i hero: `clamp(36px, 5vw, 56px)`, letter-spacing `-0.03em`
- `h2` i seksjoner: `clamp(24px, 3.5vw, 36px)`, letter-spacing `-0.025em`

---

## Hero

**Bakgrunn:** `#0e0e11`  
**Min-høyde:** `100vh`

### Logo som lyskilde
Logoen (`32×32px` amber-firkant + "Defog"-tekst) sitter pinnet øverst i midten med kraftig glow:
```
box-shadow: 0 0 28px rgba(245,158,11,0.85),
            0 0 80px rgba(245,158,11,0.4),
            0 0 160px rgba(245,158,11,0.18)
```

### Lysstråler
7 absolutt-posisjonerte `div`-er med `transform-origin: top center`, rotert fra −46° til +46° i steg på ~13°. Hver stråle er en vertikal gradient fra amber til transparent:
- Senterstrøm: `2px` bred, `rgba(245,158,11,0.55)` → transparent over `85%` høyde
- Sidestrøm (±13°): `1.5px`, `0.30` opacity
- Ytre (±28°): `1px`, `0.16` opacity
- Ytterst (±46°): `1px`, `0.08` opacity, `44%` høyde

### Fog-striper
2 grupper med absolutt-posisjonerte `div`-er (top `30%` og `46%`), `filter: blur(6–7px)`, `rgba(100,100,115, 0.10–0.22)`. Krysser strålene.

### Hero-innhold (z-index 2)
- Eyebrow: `"Chrome-utvidelse for norske nyheter"`, uppercase, `#52525b`
- `h1`: `"Fjern støyen fra nyhetsbildet"` — "støyen" er `color: #f59e0b` med `text-shadow: 0 0 32px rgba(245,158,11,0.55), 0 0 80px rgba(245,158,11,0.25)`
- Subtitle: `#71717a`, maks `400px` bred
- CTA-par: "Installer gratis" (amber, med glow-shadow) + "Hvordan virker det?" (ghost, `border: 1px solid #3f3f46`)

### CTA-glød
Absolutt `div` under knappene: `radial-gradient(ellipse, rgba(245,158,11,0.22)…)`, `380×130px`. Gjør at knappen ser ut til å ligge i varmt lys.

---

## Overgang — hero til innhold

En `200px` høy `div` med gradient:
```css
background: linear-gradient(180deg,
  #0e0e11 0%,
  #151209 25%,
  #251a05 50%,
  #f5f0e8 78%,
  #f3f4f6 100%
);
```
Pluss en sentrert `radial-gradient` ellipse (`rgba(245,158,11,0.28)`) som amber-gjennombruddsmoment ved `50%`.

---

## Innholdsseksjoner

Alternerer mellom `--light-1` (`#ffffff`) og `--light-2` (`#f3f4f6`):

| Seksjon | Bakgrunn |
|---|---|
| Sites-bar | `#f3f4f6` |
| Features | `#ffffff` |
| Slik fungerer det | `#f3f4f6` |
| Du bestemmer (toggles) | `#ffffff` |
| CTA | `#f3f4f6` |
| Footer | `#ffffff` |

### Section badges
Alle seksjoner introduseres med en liten pill-badge: `background: #fef3c7`, `color: #d97706`, `border-radius: 100px`. Binder seksjonene til amber-paletten.

### Feature-ikoner
**Fjerner alle emojier.** Erstatter med Lucide SVG-ikoner i en `38×38px` amber-boks (`background: #fef3c7`, `border-radius: 9px`). SVG stroke: `#d97706`. Ikoner per feature:
1. Skjul kategorier → `layout-list`
2. AI-slop → `cpu` (maskin/prosessor — tydelig AI-referanse)
3. Synkronisert → `globe`
4. Null ytelsestap → `zap`
5. Flere sider → `tag`
6. Gratis → `heart`

### Slik fungerer det (tidligere mørk seksjon)
Nå `#f3f4f6`. Amber-linje til venstre for hvert steg (`linear-gradient(180deg, #f59e0b, transparent)`). Steg-nummer i amber.

### Toggle-liste
Uendret struktur, oppdaterte farger: "på" = `#f59e0b`, "av" = `#e5e7eb`. Hvit bakgrunn.

### CTA-seksjon
Primærknapp: `background: #111827` (mørk, ikke amber — gir tyngde uten å kopiere hero). Ghost-knapp: `border: 1.5px solid #d1d5db`.

---

## Hva som fjernes / endres fra dagens design

| Element | Før | Etter |
|---|---|---|
| Hero-bakgrunn | `#FAFAF9` (lys papir) | `#0e0e11` (natt) |
| Hero sol-ikon | SVG sol-ikon | Fjernes — logoen er lyskilden |
| Fog-striper | Animerte striper nederst i hero | Statiske striper som krysser strålene (kan animeres som bonus) |
| "Slik fungerer det"-seksjon | `background: #111111` (mørk) | `#f3f4f6` (lys) |
| Feature-ikoner | Emojier | Lucide SVG i amber-boks |
| Knapp-stil | `border-radius: 100px` (pill) | `border-radius: 8px` (lett avrundet — mer extension-aktig) |
| Palett-navn | `--sun`, `--fog`, `--paper`, `--ink` | Nytt token-sett ovenfor |

---

## Filer som endres

- `defog-site/index.html` — eneste fil, all HTML og CSS er inline

---

## Ikke i scope

- Animasjoner på fog-striper (kan legges til som bonus)
- Mørk-modus toggle
- JavaScript-interaktivitet på toggle-lista (visuell demo kun)
- Nye sider eller ruter

# Defog Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `defog-site/index.html` with a dark hero (lysstråler fra logoen, fog-striper), mykt gradient-gjennombrudd, og lyse innholdsseksjoner som speiler Chrome extension-paletten.

**Architecture:** Én fil — all HTML og CSS er inline i `index.html`. Ingen build-system, ingen npm. Endringer gjøres seksjonsvis: CSS tokens først, deretter hero, overgang, og innholdsseksjoner i rekkefølge.

**Tech Stack:** Vanilla HTML/CSS, Fraunces + DM Sans (Google Fonts), inline Lucide SVG-paths

---

## Fil som endres

- Modify: `defog-site/index.html` — eneste fil, alle tasks er edits her

---

## Task 1: Erstatt CSS custom properties og basis-stiler

Bytt ut hele `:root`-blokken og `body`-regelen med ny palett. Fjern gamle animasjoner (`rise`, `drift`) og klasser som ikke lenger brukes (`.sun-icon`, `.fog-strips`, `.fog-strip`).

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Åpne filen og finn `:root`-blokken**

  Den begynner på linje ~19 og ser slik ut:
  ```css
  :root {
    --sun: #FBBF24;
    --sun-deep: #F59E0B;
    ...
  }
  ```

- [ ] **Steg 2: Erstatt `:root` med ny palett**

  Finn og erstatt hele `:root { ... }`-blokken med:
  ```css
  :root {
    --dark-bg:    #0e0e11;
    --amber:      #f59e0b;
    --amber-deep: #d97706;
    --amber-glow: rgba(245,158,11,0.22);
    --amber-light:#fef3c7;
    --light-1:    #ffffff;
    --light-2:    #f3f4f6;
    --text:       #111827;
    --text-soft:  #374151;
    --text-muted: #6b7280;
    --text-fog:   #71717a;
    --border:     #e5e7eb;
    --zinc-off:   #e5e7eb;
  }
  ```

- [ ] **Steg 3: Oppdater `body`**

  Finn:
  ```css
  body {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    background: var(--paper);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ```
  Erstatt med:
  ```css
  body {
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    background: var(--light-1);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }
  ```

- [ ] **Steg 4: Fjern ubrukte CSS-blokker**

  Slett disse CSS-blokkene helt (de erstattes av nye i Task 2):
  - `@keyframes rise { ... }`
  - `@keyframes drift { ... }`
  - `.sun-icon { ... }`
  - `.fog-strips { ... }`
  - `.fog-strip { ... }`
  - `.fog-strip:nth-child(...) { ... }` (alle fire)

- [ ] **Steg 5: Legg til `.section-badge`-stil**

  Legg til etter `:root`-blokken:
  ```css
  .section-badge {
    display: inline-block;
    background: var(--amber-light);
    color: var(--amber-deep);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 14px;
  }
  ```

- [ ] **Steg 6: Legg til `.transition-gradient`-stil**

  ```css
  .transition-gradient {
    height: 200px;
    background: linear-gradient(180deg,
      #0e0e11 0%,
      #151209 25%,
      #251a05 50%,
      #f5f0e8 78%,
      #f3f4f6 100%
    );
    position: relative;
    overflow: hidden;
  }

  .transition-burst {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 120px;
    background: radial-gradient(ellipse,
      rgba(245,158,11,0.28) 0%,
      rgba(245,158,11,0.1) 45%,
      transparent 75%
    );
    pointer-events: none;
  }
  ```

- [ ] **Steg 7: Verifiser i nettleser**

  Åpne `defog-site/index.html` direkte i Chrome. Siden vil se delvis ødelagt ut (hvit bakgrunn, hero uten innhold ennå) — det er forventet. Sjekk at ingen CSS-syntax-feil dukker opp i DevTools console.

- [ ] **Steg 8: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "refactor: replace CSS tokens and add new utility styles"
  ```

---

## Task 2: Erstatt hero-seksjonen med CSS

Ny hero-CSS: mørk bakgrunn, ray-layout, fog-klasser, logo-beacon, hero-innhold.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Finn og erstatt `.hero`-regelen**

  Finn:
  ```css
  .hero {
    min-height: 100vh;
    display: flex;
    ...
    overflow: hidden;
  }
  ```
  Erstatt med:
  ```css
  .hero {
    background: var(--dark-bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px 100px;
    position: relative;
    overflow: hidden;
  }

  /* Fjern gammel ::before glow */
  .hero::before { display: none; }

  .hero-ray {
    position: absolute;
    top: 0;
    pointer-events: none;
    transform-origin: top center;
  }

  .hero-fog-group {
    position: absolute;
    left: -5%;
    right: -5%;
    pointer-events: none;
  }

  .hero-logo-wrap {
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 3;
    white-space: nowrap;
  }

  .hero-logo-mark {
    width: 32px;
    height: 32px;
    background: var(--amber);
    border-radius: 7px;
    flex-shrink: 0;
    box-shadow:
      0 0 28px rgba(245,158,11,0.85),
      0 0 80px rgba(245,158,11,0.4),
      0 0 160px rgba(245,158,11,0.18);
  }

  .hero-logo-name {
    color: #fff;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.4px;
  }
  ```

- [ ] **Steg 2: Finn og erstatt `.hero-content`**

  Finn:
  ```css
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 680px;
  }
  ```
  Erstatt med:
  ```css
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 580px;
  }
  ```

- [ ] **Steg 3: Finn og erstatt `.hero h1`**

  Finn:
  ```css
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: clamp(2.8rem, 6vw, 4.2rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 1.25rem;
    animation: rise 1s ease-out 0.1s both;
  }
  ```
  Erstatt med:
  ```css
  .hero h1 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: clamp(2.25rem, 5vw, 3.5rem);
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: #f4f4f5;
    margin-bottom: 1.1rem;
  }
  ```

- [ ] **Steg 4: Finn og erstatt `.hero h1 .highlight`**

  Finn:
  ```css
  .hero h1 .highlight {
    background: linear-gradient(135deg, var(--sun-deep), var(--sun));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```
  Erstatt med:
  ```css
  .hero h1 .highlight {
    color: var(--amber);
    text-shadow:
      0 0 32px rgba(245,158,11,0.55),
      0 0 80px rgba(245,158,11,0.25);
    -webkit-text-fill-color: var(--amber);
    background: none;
    background-clip: unset;
    -webkit-background-clip: unset;
  }
  ```

- [ ] **Steg 5: Finn og erstatt `.hero .subtitle`**

  Finn:
  ```css
  .hero .subtitle {
    font-size: clamp(1.1rem, 2.5vw, 1.3rem);
    color: var(--ink-soft);
    line-height: 1.6;
    max-width: 520px;
    margin: 0 auto 2.5rem;
    animation: rise 1s ease-out 0.2s both;
  }
  ```
  Erstatt med:
  ```css
  .hero .subtitle {
    font-size: clamp(1rem, 2vw, 1.1rem);
    color: var(--text-fog);
    line-height: 1.65;
    max-width: 400px;
    margin: 0 auto 2.5rem;
  }
  ```

- [ ] **Steg 6: Finn og erstatt `.hero .hero-eyebrow` (ny klasse — legg til)**

  Legg til etter `.hero .subtitle { ... }`:
  ```css
  .hero-eyebrow {
    color: #52525b;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 1.1rem;
  }
  ```

- [ ] **Steg 7: Finn og erstatt `.hero-actions`**

  Finn:
  ```css
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: rise 1s ease-out 0.3s both;
  }
  ```
  Erstatt med:
  ```css
  .hero-actions {
    display: flex;
    gap: 0.9rem;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
  }

  .hero-cta-glow {
    position: absolute;
    bottom: -48px;
    left: 50%;
    transform: translateX(-50%);
    width: 380px;
    height: 130px;
    background: radial-gradient(ellipse,
      rgba(245,158,11,0.22) 0%,
      rgba(245,158,11,0.08) 50%,
      transparent 75%
    );
    pointer-events: none;
  }
  ```

- [ ] **Steg 8: Finn og erstatt `.btn`, `.btn-primary`, `.btn-ghost`**

  Finn:
  ```css
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    border-radius: 100px;
    ...
  }
  ```
  Erstatt `.btn`, `.btn-primary`, `.btn-primary:hover`, `.btn-ghost`, `.btn-ghost:hover`, `.btn svg` med:
  ```css
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
  }

  .btn-primary {
    background: var(--amber);
    color: #000;
    box-shadow:
      0 0 0 1px rgba(245,158,11,0.3),
      0 4px 24px rgba(245,158,11,0.5),
      0 12px 48px rgba(245,158,11,0.22);
    position: relative;
    z-index: 1;
  }
  .btn-primary:hover {
    background: #e59009;
    transform: translateY(-1px);
  }

  .btn-ghost {
    background: transparent;
    color: #a1a1aa;
    border: 1px solid #3f3f46;
    position: relative;
    z-index: 1;
  }
  .btn-ghost:hover {
    color: #fff;
    border-color: #71717a;
  }

  .btn svg { width: 18px; height: 18px; flex-shrink: 0; }
  ```

- [ ] **Steg 9: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "refactor: update hero and button CSS for dark theme"
  ```

---

## Task 3: Erstatt hero HTML

Bytt ut selve `<section class="hero">` med ny markup: rays, fog-striper, logo-beacon, eyebrow, og CTA-glow.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Finn og erstatt hero-seksjonen**

  Finn (fra `<section class="hero">` til og med `</section>`):
  ```html
  <section class="hero">
    <div class="hero-content">
      <div class="sun-icon">
        ...
      </div>
      <h1>Fjern <span class="highlight">støyen</span> fra nyhetsbildet</h1>
      <p class="subtitle">...</p>
      <div class="hero-actions">
        <a href="#" class="btn btn-primary">...</a>
        <a href="#hvordan" class="btn btn-ghost">Hvordan virker det?</a>
      </div>
    </div>
    <div class="fog-strips">
      ...
    </div>
  </section>
  ```

  Erstatt med:
  ```html
  <section class="hero">

    <!-- Lysstråler fra logoen -->
    <div class="hero-ray" style="left:50%;width:2px;height:100%;background:linear-gradient(180deg,rgba(245,158,11,0.55) 0%,rgba(245,158,11,0.1) 55%,transparent 85%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(-13deg);width:1.5px;height:80%;background:linear-gradient(180deg,rgba(245,158,11,0.30) 0%,transparent 100%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(13deg);width:1.5px;height:80%;background:linear-gradient(180deg,rgba(245,158,11,0.30) 0%,transparent 100%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(-28deg);width:1px;height:62%;background:linear-gradient(180deg,rgba(245,158,11,0.16) 0%,transparent 100%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(28deg);width:1px;height:62%;background:linear-gradient(180deg,rgba(245,158,11,0.16) 0%,transparent 100%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(-46deg);width:1px;height:44%;background:linear-gradient(180deg,rgba(245,158,11,0.08) 0%,transparent 100%);"></div>
    <div class="hero-ray" style="left:50%;transform:rotate(46deg);width:1px;height:44%;background:linear-gradient(180deg,rgba(245,158,11,0.08) 0%,transparent 100%);"></div>

    <!-- Fog-striper som krysser strålene -->
    <div class="hero-fog-group" style="top:30%;">
      <div style="height:10px;background:rgba(100,100,115,0.22);border-radius:100px;filter:blur(7px);margin-bottom:18px;"></div>
      <div style="height:7px;background:rgba(100,100,115,0.15);border-radius:100px;filter:blur(5px);margin-left:10%;margin-right:6%;"></div>
    </div>
    <div class="hero-fog-group" style="top:46%;">
      <div style="height:6px;background:rgba(100,100,115,0.10);border-radius:100px;filter:blur(5px);margin-left:18%;margin-right:12%;"></div>
    </div>

    <!-- Logo — lyskilden -->
    <div class="hero-logo-wrap" aria-hidden="true">
      <div class="hero-logo-mark"></div>
      <span class="hero-logo-name">Defog</span>
    </div>

    <!-- Hero-innhold -->
    <div class="hero-content">
      <p class="hero-eyebrow">Chrome-utvidelse for norske nyheter</p>
      <h1>Fjern <span class="highlight">støyen</span><br>fra nyhetsbildet</h1>
      <p class="subtitle">Skjuler sport, sladder og AI-generert innhold fra VG, NRK og Dagbladet. Du bestemmer hva du ser.</p>
      <div class="hero-actions">
        <div class="hero-cta-glow" aria-hidden="true"></div>
        <a href="#" class="btn btn-primary">Installer gratis</a>
        <a href="#hvordan" class="btn btn-ghost">Hvordan virker det?</a>
      </div>
    </div>

  </section>
  ```

- [ ] **Steg 2: Verifiser i nettleser**

  Åpne `defog-site/index.html` i Chrome. Forventet resultat:
  - Helsvart/mørk hero
  - Logoen øverst i midten med gul glow
  - Lysstråler stråler ned fra logoen
  - Grålige fog-striper krysser strålene
  - "Fjern støyen fra nyhetsbildet" i hvit tekst, "støyen" i amber
  - Amber CTA-knapp med glow, ghost-knapp ved siden av
  - Varm glød under knappene

- [ ] **Steg 3: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "feat: rebuild hero with light rays, fog strips, and amber beacon"
  ```

---

## Task 4: Legg til overgangsgradienten

Erstatt tomt mellomrom mellom hero og sites-bar med `transition-gradient`-blokken.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Finn stedet mellom `</section>` (hero) og `<div class="sites-bar">`**

  Det er ingen HTML mellom dem i dag. Legg inn følgende rett etter `</section>` (hero-sluttpunktet):

  ```html
  <!-- Overgang: tåke smelter til lys -->
  <div class="transition-gradient" aria-hidden="true">
    <div class="transition-burst"></div>
  </div>
  ```

- [ ] **Steg 2: Verifiser i nettleser**

  Scroll ned fra heroen. Det skal nå være en `200px` gradient som går fra `#0e0e11` (natt) via en varm amber-glo til `#f3f4f6` (lys). Ingen brå overgang.

- [ ] **Steg 3: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "feat: add gradient transition from dark hero to light content"
  ```

---

## Task 5: Oppdater sites-bar

Sett `#f3f4f6` bakgrunn og oppdater typografi-farger.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Finn og erstatt `.sites-bar`-CSS**

  Finn:
  ```css
  .sites-bar {
    padding: 3rem 1.5rem;
    text-align: center;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  ```
  Erstatt med:
  ```css
  .sites-bar {
    background: var(--light-2);
    padding: 3rem 1.5rem;
    text-align: center;
  }
  ```

- [ ] **Steg 2: Finn og erstatt `.sites-bar p`**

  Finn:
  ```css
  .sites-bar p {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-muted);
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
  ```
  Erstatt med:
  ```css
  .sites-bar p {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #9ca3af;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
  ```

- [ ] **Steg 3: Finn og erstatt `.site-logo`**

  Finn:
  ```css
  .site-logo {
    font-family: 'Fraunces', serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--fog);
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }
  .site-logo:hover { color: var(--ink-soft); }
  ```
  Erstatt med:
  ```css
  .site-logo {
    font-family: 'Fraunces', serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: #d1d5db;
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }
  .site-logo:hover { color: var(--text-soft); }
  ```

- [ ] **Steg 4: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "refactor: update sites-bar to light-2 background and new palette"
  ```

---

## Task 6: Erstatt feature-ikoner og legg til section badge

Fjern alle emojier. Legg inn inline Lucide SVG i amber-ikonbokser. Legg til section badge over overskriften.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Oppdater `.feature-icon` CSS**

  Finn:
  ```css
  .feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--sun-glow), var(--sun));
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
  }
  ```
  Erstatt med:
  ```css
  .feature-icon {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    background: var(--amber-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }

  .feature-icon svg {
    width: 18px;
    height: 18px;
    stroke: var(--amber-deep);
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  ```

- [ ] **Steg 2: Oppdater `.feature-card:hover`**

  Finn:
  ```css
  .feature-card:hover {
    border-color: var(--sun);
    box-shadow: 0 8px 30px rgba(251, 191, 36, 0.08);
    transform: translateY(-2px);
  }
  ```
  Erstatt med:
  ```css
  .feature-card:hover {
    border-color: var(--amber);
    box-shadow: 0 8px 30px rgba(245, 158, 11, 0.08);
    transform: translateY(-2px);
  }
  ```

- [ ] **Steg 3: Finn `<div class="features-header">` i HTML og legg til badge**

  Finn:
  ```html
  <div class="features-header">
    <h2>Nyheter uten støy</h2>
    <p>Slå av kategoriene du ikke bryr deg om. Defog fjerner dem fra forsiden — enkelt og greit.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="features-header">
    <span class="section-badge">Funksjoner</span>
    <h2>Nyheter uten støy</h2>
    <p>Slå av kategoriene du ikke bryr deg om. Defog fjerner dem fra forsiden — enkelt og greit.</p>
  </div>
  ```

- [ ] **Steg 4: Erstatt alle seks feature-cards**

  Finn den første feature-card (med 🏀):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">🏀</div>
    <h3>Skjul hele kategorier</h3>
    <p>Sport, sladder, økonomi, kultur, debatt — slå av det du ikke vil se med ett klikk.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
        <path d="M14 4h7M14 9h7M14 15h7M14 20h7"/>
      </svg>
    </div>
    <h3>Skjul hele kategorier</h3>
    <p>Sport, sladder, økonomi, kultur, debatt — slå av det du ikke vil se med ett klikk.</p>
  </div>
  ```

  Finn den andre feature-card (med 🤖):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">🤖</div>
    <h3>AI-slop-deteksjon</h3>
    <p>Oppdager og skjuler artikler med AI-genererte bilder og innhold. Ingen API — bare smart gjenkjenning.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>
      </svg>
    </div>
    <h3>AI-slop-deteksjon</h3>
    <p>Oppdager og skjuler artikler med AI-genererte bilder og innhold. Ingen API — bare smart gjenkjenning.</p>
  </div>
  ```

  Finn den tredje feature-card (med 🔄):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">🔄</div>
    <h3>Synkronisert</h3>
    <p>Innstillingene dine følger Chrome-profilen din. Sett opp én gang, virker overalt.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </div>
    <h3>Synkronisert</h3>
    <p>Innstillingene dine følger Chrome-profilen din. Sett opp én gang, virker overalt.</p>
  </div>
  ```

  Finn den fjerde feature-card (med ⚡):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">⚡</div>
    <h3>Null ytelsestap</h3>
    <p>Ingen eksterne kall, ingen tracking, ingen analytics. Alt kjører lokalt i nettleseren din.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    </div>
    <h3>Null ytelsestap</h3>
    <p>Ingen eksterne kall, ingen tracking, ingen analytics. Alt kjører lokalt i nettleseren din.</p>
  </div>
  ```

  Finn den femte feature-card (med 🧩):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">🧩</div>
    <h3>Flere sider kommer</h3>
    <p>VG, NRK og Dagbladet først. Flere norske — og internasjonale — sider på vei.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    </div>
    <h3>Flere sider kommer</h3>
    <p>VG, NRK og Dagbladet først. Flere norske — og internasjonale — sider på vei.</p>
  </div>
  ```

  Finn den sjette feature-card (med ☕):
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">☕</div>
    <h3>100% gratis</h3>
    <p>Ingen betalingsmur, ingen premium-versjon. Liker du det? Sleng en kaffe.</p>
  </div>
  ```
  Erstatt med:
  ```html
  <div class="feature-card">
    <div class="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
    <h3>100% gratis</h3>
    <p>Ingen betalingsmur, ingen premium-versjon. Liker du det? Sleng en kaffe.</p>
  </div>
  ```

- [ ] **Steg 5: Verifiser i nettleser**

  Scroll til features-seksjonen. Forventet:
  - Amber section badge "Funksjoner" over overskriften
  - Alle seks kort har amber SVG-ikoner (ingen emojier)
  - Hover på kort gir amber border og subtil glow

- [ ] **Steg 6: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "feat: replace emoji icons with Lucide SVGs in amber boxes"
  ```

---

## Task 7: Gjør "Slik fungerer det"-seksjonen lys

Fjern mørk bakgrunn. Oppdater alle farger til å fungere på lys bakgrunn.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Finn og erstatt `.how`-CSS**

  Finn:
  ```css
  .how {
    background: var(--ink);
    color: #fff;
    padding: 6rem 1.5rem;
  }
  ```
  Erstatt med:
  ```css
  .how {
    background: var(--light-2);
    color: var(--text);
    padding: 6rem 1.5rem;
  }
  ```

- [ ] **Steg 2: Finn og erstatt `.how h2`**

  Finn:
  ```css
  .how h2 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    letter-spacing: -0.02em;
    margin-bottom: 3.5rem;
  }
  ```
  Erstatt med:
  ```css
  .how h2 {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    color: var(--text);
  }

  .how-inner > .section-badge { margin-bottom: 1rem; }
  .how-inner > h2 { margin-bottom: 3.5rem; }
  ```

- [ ] **Steg 3: Finn og erstatt `.step p`**

  Finn:
  ```css
  .step p {
    font-size: 0.88rem;
    color: #9CA3AF;
    line-height: 1.55;
  }
  ```
  Erstatt med:
  ```css
  .step p {
    font-size: 0.88rem;
    color: var(--text-muted);
    line-height: 1.55;
  }
  ```

- [ ] **Steg 4: Legg til section badge i HTML**

  Finn:
  ```html
  <div class="how-inner">
    <h2>Tre steg til klarere nyheter</h2>
  ```
  Erstatt med:
  ```html
  <div class="how-inner">
    <span class="section-badge">Slik fungerer det</span>
    <h2>Tre steg til klarere nyheter</h2>
  ```

- [ ] **Steg 5: Verifiser i nettleser**

  Seksjonen skal nå ha lys grå bakgrunn (`#f3f4f6`), mørk tekst, amber steg-numre og amber-linje til venstre. Ingen hvit tekst på mørk bakgrunn.

- [ ] **Steg 6: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "refactor: convert how-it-works section from dark to light background"
  ```

---

## Task 8: Oppdater toggle-seksjonen og CTA

Legg til section badge i toggles. Oppdater CTA-knapp-stiler og legg til badge.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Oppdater `.pill`-farger i CSS**

  Finn:
  ```css
  .pill.on { background: var(--sun); }
  .pill.off { background: var(--fog-light); }
  ```
  Erstatt med:
  ```css
  .pill.on  { background: var(--amber); }
  .pill.off { background: var(--zinc-off); }
  ```

- [ ] **Steg 2: Legg til section badge i toggle-seksjon HTML**

  Finn:
  ```html
  <section class="categories">
    <h2>Du bestemmer</h2>
  ```
  Erstatt med:
  ```html
  <section class="categories">
    <span class="section-badge">Du bestemmer</span>
    <h2>Velg hva du ser</h2>
  ```

- [ ] **Steg 3: Oppdater CTA-seksjon CSS**

  Finn:
  ```css
  .cta {
    text-align: center;
    padding: 5rem 1.5rem 6rem;
    border-top: 1px solid var(--border);
  }
  ```
  Erstatt med:
  ```css
  .cta {
    background: var(--light-2);
    text-align: center;
    padding: 5rem 1.5rem 6rem;
  }
  ```

- [ ] **Steg 4: Legg til section badge og oppdater CTA-knapper i HTML**

  Finn:
  ```html
  <section class="cta">
    <h2>Klar for klarere nyheter?</h2>
    <p>Gratis, åpen kildekode, ingen tracking.</p>
    <div class="cta-actions">
      <a href="#" class="btn btn-primary">Installer Defog</a>
      <a href="https://buymeacoffee.com/getdefog" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">☕ Støtt prosjektet</a>
    </div>
  </section>
  ```
  Erstatt med:
  ```html
  <section class="cta">
    <span class="section-badge">Kom i gang</span>
    <h2>Klar for klarere nyheter?</h2>
    <p>Gratis, åpen kildekode, ingen tracking.</p>
    <div class="cta-actions">
      <a href="#" class="btn btn-cta-primary">Installer Defog</a>
      <a href="https://buymeacoffee.com/getdefog" class="btn btn-cta-ghost" target="_blank" rel="noopener noreferrer">Støtt prosjektet</a>
    </div>
  </section>
  ```

- [ ] **Steg 5: Legg til `.btn-cta-primary` og `.btn-cta-ghost` CSS**

  Legg til etter `.btn-ghost:hover`-regelen:
  ```css
  .btn-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    background: var(--text);
    color: #fff;
    transition: background 0.2s, transform 0.2s;
  }
  .btn-cta-primary:hover {
    background: #000;
    transform: translateY(-1px);
  }

  .btn-cta-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    color: var(--text-muted);
    border: 1.5px solid #d1d5db;
    transition: border-color 0.2s, color 0.2s;
  }
  .btn-cta-ghost:hover {
    border-color: #9ca3af;
    color: var(--text);
  }
  ```

- [ ] **Steg 6: Commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "feat: update toggles, CTA section with badges and new button styles"
  ```

---

## Task 9: Rydd opp footer og fjern gjenværende gamle variabler

Fjern referanser til gamle CSS-tokens (`--ink`, `--ink-muted` etc.) som kan ligge igjen i footer-CSS. Verifiser hele siden.

**Files:**
- Modify: `defog-site/index.html`

- [ ] **Steg 1: Oppdater `footer`-CSS**

  Finn:
  ```css
  footer {
    padding: 2.5rem 1.5rem;
    text-align: center;
    color: var(--ink-muted);
    font-size: 0.82rem;
    border-top: 1px solid var(--border);
  }
  footer a { color: var(--ink-muted); text-decoration: none; }
  footer a:hover { color: var(--ink); }
  ```
  Erstatt med:
  ```css
  footer {
    background: var(--light-1);
    padding: 2.5rem 1.5rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.82rem;
    border-top: 1px solid var(--border);
  }
  footer a { color: var(--text-muted); text-decoration: none; }
  footer a:hover { color: var(--text); }
  ```

- [ ] **Steg 2: Fjern footer emoji**

  Finn:
  ```html
  <a href="https://buymeacoffee.com/getdefog" target="_blank" rel="noopener noreferrer">Støtt Defog</a>
  ```
  Verifiser at det ikke er emojier i footer. Hvis `☕` er der, fjern det.

- [ ] **Steg 3: Søk etter gjenværende gamle token-referanser**

  Kjør i terminalen:
  ```bash
  grep -n "var(--sun\|var(--fog\|var(--ink\|var(--paper\|var(--card" /Users/sh/dev-inv/defog-site/index.html
  ```
  Forventet output: ingen treff. Hvis det er treff, erstatt med korrekt ny token fra paletten.

- [ ] **Steg 4: Verifiser hele siden i nettleser**

  Scroll gjennom hele siden og sjekk:
  - [ ] Hero: mørk, lysstråler, fog-striper, amber logo-glow, amber CTA-glow
  - [ ] Overgang: gradient smelter fra natt til dag
  - [ ] Sites-bar: lys grå, grå logonavn
  - [ ] Features: hvit bakgrunn, amber section badge, SVG-ikoner (ingen emojier), amber hover
  - [ ] Slik fungerer det: lys grå, amber section badge, amber steg-numre, mørk tekst
  - [ ] Du bestemmer: hvit bakgrunn, amber badge, amber toggles "på"
  - [ ] CTA: lys grå, amber badge, mørk primærknapp
  - [ ] Footer: hvit, ingen emojier

- [ ] **Steg 5: Sjekk DevTools for feil**

  Åpne Chrome DevTools (F12) → Console-fanen. Forventet: ingen feil.

- [ ] **Steg 6: Final commit**

  ```bash
  git -C /Users/sh/dev-inv/defog-site add index.html
  git -C /Users/sh/dev-inv/defog-site commit -m "refactor: clean up footer and remove all legacy CSS token references"
  ```

---

## Spec coverage check

| Spec-krav | Implementert i |
|---|---|
| Mørk hero `#0e0e11` | Task 2 (CSS), Task 3 (HTML) |
| Lysstråler fra logoen | Task 3 (HTML) |
| Fog-striper krysser strålene | Task 3 (HTML) |
| Amber text-shadow på "støyen" | Task 2 (CSS) |
| CTA-glød under knapper | Task 2 (CSS + HTML) |
| Amber logo-beacon med glow | Task 2 (CSS + HTML) |
| Gradient-overgang mørk→lys | Task 4 |
| Amber-burst i overgangen | Task 4 |
| Sites-bar `#f3f4f6` | Task 5 |
| Features `#ffffff` | Uendret (allerede hvit) |
| Section badges i amber | Task 6, 7, 8 |
| Lucide SVG-ikoner (ingen emojier) | Task 6 |
| "Slik fungerer det" lys `#f3f4f6` | Task 7 |
| Toggle "på" = `#f59e0b` | Task 8 |
| CTA `#f3f4f6`, mørk primærknapp | Task 8 |
| Footer ren, ingen emojier | Task 9 |
| Ingen gjenværende `--ink`/`--sun`-tokens | Task 9 |
| `border-radius: 8px` på knapper | Task 2, 8 |

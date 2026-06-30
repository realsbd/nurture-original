# Nurture — Design System
**Naturally Alkaline Spring Water · Brand Reference Document**

---

## 1. Brand Philosophy

> *"Youthful Hydration. Naturally Nurtured."*

Nurture's visual identity draws from the purity of alpine spring water, the permanence of mountains, and the vitality of natural living. The design language is **bold, alive, and unapologetically clean** — it doesn't whisper wellness, it *moves* it.

Inspired by the kinetic, high-energy typographic style of [takeboost.com](https://takeboost.com), Nurture's digital presence uses expressive display type, continuous scroll animations, and purposeful whitespace to communicate the brand's core tension: **nature's calm meets youthful energy**.

---

## 2. Colour Palette

### Primary Colours

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| 🔵 Primary | Deep Nurture Blue | `#0047C7` | CTAs, primary headlines, nav, logo |
| 🔷 Secondary | Bright Blue | `#1E6BFF` | Highlights, links, hover states, accents |
| 🩵 Accent | Sky Blue | `#6FBBFF` | Background accents, section dividers, graphics |
| 🧊 Light Accent | Ice Blue | `#DCEEFF` | Light backgrounds, cards, packaging details |

### Neutral Colours

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| ⬜ Base | Pure White | `#FFFFFF` | Page backgrounds, clean foundation |
| 🩶 Utility | Mountain Gray | `#5F6B7A` | Body text, secondary labels, supporting elements |

### Nature Accents

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| 🌲 Deep Nature | Forest Green | `#2F6B3A` | Nature badges, sustainability tags, CTAs (alt) |
| 🌿 Energy | Fresh Spring Green | `#8BC34A` | Wellness indicators, vitality callouts, micro-accents |

### Usage Rules

```
Primary CTA button   → #0047C7 background, #FFFFFF text
Secondary CTA        → #1E6BFF background, #FFFFFF text
Ghost/outline button → #0047C7 border + text, transparent bg
Destructive/alert    → #5F6B7A with #DCEEFF background
Nature badge         → #2F6B3A background, #FFFFFF text
Energy tag           → #8BC34A background, #0047C7 text
```

### CSS Custom Properties

```css
:root {
  /* Brand Blues */
  --color-primary:        #0047C7;
  --color-secondary:      #1E6BFF;
  --color-sky:            #6FBBFF;
  --color-ice:            #DCEEFF;

  /* Neutrals */
  --color-white:          #FFFFFF;
  --color-gray:           #5F6B7A;

  /* Nature */
  --color-forest:         #2F6B3A;
  --color-spring:         #8BC34A;

  /* Derived */
  --color-bg:             #FFFFFF;
  --color-bg-alt:         #DCEEFF;
  --color-text:           #0047C7;
  --color-text-body:      #5F6B7A;
  --color-text-light:     #6FBBFF;
}
```

---

## 3. Typography

Inspired by takeboost.com's signature approach: **large, mixed-case display headlines** that pair a chunky geometric sans with an expressive italic serif — energy through contrast.

### Type Stack

```css
/* Display — hero headlines, section titles */
--font-display: 'Bricolage Grotesque', 'Space Grotesk', sans-serif;

/* Italic Accent — mid-sentence italics, pull quotes */
--font-accent-italic: 'Playfair Display', 'Lora', serif;

/* Body — paragraphs, descriptions */
--font-body: 'Inter', 'DM Sans', system-ui, sans-serif;

/* Utility — labels, captions, nav, badges */
--font-utility: 'Space Mono', 'Courier New', monospace;
```

> **Takeboost signature trick:** Mid-headline italic switches — e.g. `STAY` (sans, bold) + `*sick*` (serif, italic) + `NOT` (sans, bold). Use this in Nurture's hero: `STAY` + `*pure*` + `STAY STRONG`.

### Type Scale

```css
:root {
  --text-xs:    0.75rem;   /* 12px — badges, legal */
  --text-sm:    0.875rem;  /* 14px — captions, nav */
  --text-base:  1rem;      /* 16px — body copy */
  --text-md:    1.25rem;   /* 20px — lead text */
  --text-lg:    1.5rem;    /* 24px — subheadings */
  --text-xl:    2rem;      /* 32px — section titles */
  --text-2xl:   3rem;      /* 48px — page headlines */
  --text-3xl:   4.5rem;    /* 72px — hero display */
  --text-4xl:   6rem;      /* 96px — oversized statements */
  --text-hero:  clamp(3rem, 10vw, 8rem); /* fluid hero */
}
```

### Typographic Treatments

```css
/* Hero Display — Takeboost-style mixed construction */
.display-hero {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.display-hero em {
  font-family: var(--font-accent-italic);
  font-style: italic;
  font-weight: 400;
  text-transform: none;
  letter-spacing: -0.01em;
  color: var(--color-secondary);
}

/* Section Titles */
.title-section {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--color-primary);
}

/* Body Copy */
.body-copy {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.7;
  color: var(--color-text-body);
}

/* Eyebrow Labels — utility mono */
.label-eyebrow {
  font-family: var(--font-utility);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-sky);
}
```

---

## 4. Animation System

Inspired by takeboost.com's three core motion patterns: **marquee scroll tickers**, **staggered scroll-reveal**, and **ambient hover micro-interactions**.

### 4.1 Marquee Ticker (Takeboost Signature)

Used for product taglines, certification labels, and brand statements. Continuous horizontal scroll, infinite loop.

```css
/* Ticker Container */
.ticker-wrap {
  overflow: hidden;
  background: var(--color-primary);
  padding: 0.75rem 0;
  border-top: 2px solid var(--color-secondary);
  border-bottom: 2px solid var(--color-secondary);
}

.ticker-track {
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: ticker-scroll 30s linear infinite;
}

.ticker-item {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-white);
  white-space: nowrap;
}

.ticker-item::before {
  content: "•";
  margin-right: 2rem;
  color: var(--color-sky);
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

**Example ticker text for Nurture:**
```
• NATURALLY ALKALINE • PH 8.0+ • SOURCE-PROTECTED SPRING WATER
• ZERO ADDITIVES • 100% NATURAL • YOUTHFUL HYDRATION •
• MOUNTAIN FRESH • GLASS OPTION AVAILABLE •
```

---

### 4.2 Scroll Reveal — Stagger Up

Elements fade in and translate upward on scroll entry, staggered by index for a cascade effect.

```css
/* Base hidden state */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for child elements */
.reveal-group .reveal:nth-child(1) { transition-delay: 0ms; }
.reveal-group .reveal:nth-child(2) { transition-delay: 100ms; }
.reveal-group .reveal:nth-child(3) { transition-delay: 200ms; }
.reveal-group .reveal:nth-child(4) { transition-delay: 300ms; }
```

```js
// Intersection Observer — attach to all [.reveal] elements
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
```

---

### 4.3 Hero Headline Split Animation

Takeboost-style: headline words animate in one by one from below, each word its own reveal unit.

```css
.hero-word {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-right: 0.15em;
}

.hero-word span {
  display: block;
  transform: translateY(110%);
  opacity: 0;
  animation: word-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero-word:nth-child(1) span { animation-delay: 0.1s; }
.hero-word:nth-child(2) span { animation-delay: 0.25s; }
.hero-word:nth-child(3) span { animation-delay: 0.4s; }
.hero-word:nth-child(4) span { animation-delay: 0.55s; }

@keyframes word-rise {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

### 4.4 Hover Micro-interactions

```css
/* CTA Button — lift + glow */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 1rem 2.5rem;
  border-radius: 100px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.25s ease,
    background 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  background: var(--color-secondary);
  box-shadow: 0 12px 40px rgba(0, 71, 199, 0.35);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* Cards — float on hover */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-ice);
  border-radius: 20px;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-6px);
  border-color: var(--color-sky);
  box-shadow: 0 20px 60px rgba(111, 187, 255, 0.25);
}

/* Nav links — underline draw */
.nav-link {
  position: relative;
  color: var(--color-primary);
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-secondary);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover::after { width: 100%; }
```

---

### 4.5 Ambient Background Pulse

Subtle pulsing gradient orb behind hero sections — evokes the movement of spring water.

```css
.hero-ambient {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.hero-ambient::before {
  content: '';
  position: absolute;
  width: 80vw;
  height: 80vw;
  top: -20%;
  right: -20%;
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(30, 107, 255, 0.12) 0%,
    rgba(220, 238, 255, 0.08) 50%,
    transparent 70%
  );
  animation: orb-pulse 8s ease-in-out infinite;
}

@keyframes orb-pulse {
  0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.7; }
  50%       { transform: scale(1.12) translate(-2%, 3%); opacity: 1; }
}
```

---

### 4.6 Reduced Motion Override

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .ticker-track { animation: none; }
  .hero-word span { transform: none; opacity: 1; animation: none; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

---

## 5. Layout & Spacing

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  --radius-sm:   8px;
  --radius-md:   16px;
  --radius-lg:   20px;
  --radius-xl:   32px;
  --radius-pill: 100px;

  --container-max: 1280px;
  --container-pad: clamp(1rem, 5vw, 5rem);
}

.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-inline: var(--container-pad);
}
```

---

## 6. Component Patterns

### 6.1 Hero Section

```
┌─────────────────────────────────────────────────────┐
│  NAV                                    [SHOP NOW]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   STAY                                              │
│       *pure.*                                       │
│            STAY STRONG.                             │
│                                                     │
│   Nurture helps you hydrate better —                │
│   naturally, every single day.                      │
│                                                     │
│   [BUY NURTURE]    [LEARN MORE →]                   │
│                                                     │
│   [ ambient orb / product hero image ]              │
│                                                     │
└─────────────────────────────────────────────────────┘
• NATURALLY ALKALINE • PH 8.0+ • ZERO ADDITIVES • PURE SPRING •
```

### 6.2 Ingredient Feature Card

```
┌──────────────────────┐
│   [ icon / image ]   │
│                      │
│   MOUNTAIN MINERAL   │  ← eyebrow (utility mono, sky blue)
│   Magnesium          │  ← title (display, primary blue)
│                      │
│   Supports muscle    │  ← body (inter, gray)
│   recovery and       │
│   hydration balance. │
│                      │
│   [ Learn More →  ]  │
└──────────────────────┘
```

### 6.3 Testimonial Ticker

```
css class: .ticker-wrap
Content: alternating testimonials + brand statements
Direction: left scroll on desktop, stationary on reduced-motion
```

---

## 7. Voice & Copy Tone

Inspired by takeboost's irreverent but purposeful copy — Nurture adapts this for a **natural wellness** audience:

| ❌ Generic | ✅ Nurture Voice |
|-----------|-----------------|
| "Pure hydration for your health journey" | "Being dehydrated sucks. Don't be dehydrated." |
| "Premium alkaline spring water" | "Not tap. Not filtered. Actually from a spring." |
| "Supports your wellness goals" | "Your body's 60% water. Make it good water." |
| "Buy now" | "Get Nurtured 💧" |

**Headline formula (Takeboost-inspired):**
```
[SANS CAPS] + *italic serif word* + [SANS CAPS CONTINUATION]

Examples:
DRINK    *better.*    FEEL STRONG.
STAY     *hydrated.*  STAY YOU.
PURE     *water,*     REAL RESULTS.
```

---

## 8. Tailwind Config Reference

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        nurture: {
          primary:   '#0047C7',
          secondary: '#1E6BFF',
          sky:       '#6FBBFF',
          ice:       '#DCEEFF',
          white:     '#FFFFFF',
          gray:      '#5F6B7A',
          forest:    '#2F6B3A',
          spring:    '#8BC34A',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Space Grotesk', 'sans-serif'],
        serif:   ['Playfair Display', 'Lora', 'serif'],
        body:    ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['Space Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'ticker': 'ticker-scroll 30s linear infinite',
        'orb-pulse': 'orb-pulse 8s ease-in-out infinite',
        'word-rise': 'word-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'ticker-scroll': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'orb-pulse': {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.7' },
          '50%':      { transform: 'scale(1.12) translate(-2%, 3%)', opacity: '1' },
        },
        'word-rise': {
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};
```

---

## 9. Do / Don't

| ✅ Do | ❌ Don't |
|------|---------|
| Use Deep Nurture Blue `#0047C7` for primary actions | Use green as a primary CTA — it's a nature accent only |
| Mix display sans with italic serif in headlines | Use italic on body text — keep it for display moments only |
| Run the marquee ticker on brand/certification statements | Use the ticker for long-form copy or paragraphs |
| Animate with `cubic-bezier(0.16, 1, 0.3, 1)` — it feels alive | Use linear easing on any UI transitions |
| Keep backgrounds white or `#DCEEFF` Ice Blue | Use Mountain Gray as a background — it's a text colour |
| Respect `prefers-reduced-motion` — always | Auto-play video or loop animations without pause controls |
| Write copy from the consumer's side of the experience | Lead with product features before consumer benefit |

---

*Nurture Design System v1.0 — Aspire IT Hub*
*Palette: Nurture Brand Colour Palette · Motion: Adapted from takeboost.com*

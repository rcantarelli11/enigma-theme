# Enigma Rebrand — Design System

## Typography

### Display / Headlines
- **Primary:** Bold serif display font (editorial feel — think Bluu Next, Freight Display, or similar from freefaces.gallery)
- **Usage:** Hero headlines, pillar titles, section headers
- **Weight:** Bold / Black
- **Style:** Confident, premium, not generic

### Body
- **Primary:** Clean sans-serif (Inter, Satoshi, or General Sans)
- **Usage:** Descriptions, product details, trust section
- **Weight:** Regular 400 / Medium 500

### Accent
- **Scribble elements** from scribbbles.design for:
  - Underlines on key words
  - Circle highlights around stats/numbers
  - Arrow callouts for ingredients
  - Hand-drawn badges ("clinically dosed", "no fillers")

---

## Color System

### Base Palette
- **Background (Dark):** `#1A1A1A` — dark charcoal/stone (NOT pure black)
- **Background (Light sections):** `#F5F2ED` — warm off-white/cream
- **Text Primary:** `#F5F2ED` on dark / `#1A1A1A` on light
- **Text Secondary:** `#8A8580` — warm gray
- **Brand Accent:** `#2DD4BF` — Enigma teal (used sparingly — CTAs, links, hover states)

### Pillar Color Accents
Each pillar gets a subtle color shift in background/accent during the scroll experience:

1. ⚡ **Energy (Pre Workout)** — Warm Orange `#F97316`
2. 💧 **Hydration** — Cool Blue `#3B82F6`  
3. 🥛 **Protein** — Warm Cream `#F5D5A0`
4. 💪 **Creatine** — Bold Red `#EF4444`
5. 🧘 **Ashwagandha** — Sage Green `#6DA37E`

These are NOT full backgrounds — they're subtle accent glows, gradient hints, or tinted overlays that shift as you scroll through.

---

## Layout Principles

### Spacing
- **Generous whitespace** — let products breathe
- Minimum 120px section padding on desktop
- Product images should be LARGE — hero treatment, not thumbnails

### Grid
- Max content width: 1200px
- Product grid: 3-col on desktop, 2-col tablet, 1-col mobile
- Pillar sections: Full viewport, no container constraints

### Motion
- Subtle, purposeful — not flashy
- Parallax on product images (slight float as you scroll)
- Smooth color transitions between pillars (CSS transitions, not jarring)
- Cycle wheel assembly animation (products slide into position)

---

## Component Patterns

### Cards (Product)
- Dark card on light background OR light card on dark background
- Rounded corners (12-16px)
- Product image dominant (70% of card)
- Minimal text: name, one-line description, price

### CTAs
- Primary: Teal background, dark text, bold
- Secondary: Outline/ghost button, teal border
- Hover: Subtle scale + glow effect

### Trust Badges
- Scribble-style circles around key stats
- "Clinically Dosed" / "No Proprietary Blends" / "Third Party Tested"
- Small, repeated throughout — not one big trust section

### Scribble Usage Rules
- MAX 2-3 scribble elements per viewport
- Always in brand teal or pillar accent color
- Used for: underlines, circles, arrows, small annotations
- NOT used for: backgrounds, large decorative elements, logos

---

## Photography Direction
- Dark studio lighting — moody, editorial
- Products shot on dark stone/concrete surfaces
- Warm directional light creating shadows
- NOT flat lay / NOT white background / NOT gym bro lifestyle
- Think: Aesop product photography meets athletic context

---

## Reference Sites (Design DNA)
- **inflatable.wannathis.one** → Texture/material inspiration, premium dark aesthetic
- **freefaces.gallery** → Typography selection
- **scribbbles.design** → Hand-drawn accent elements
- **viewport-ui.design** → Clean UI patterns, card layouts
- **air.inc** → Editorial confidence, scroll storytelling
- **Apple product pages** → Horizontal scroll-lock mechanic, reveal animations
- **Aesop** → Warm premium minimalism, product photography

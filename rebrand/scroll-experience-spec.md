# Enigma Scroll Experience — Technical Spec

## Overview
The homepage is a scroll-driven narrative experience. The user doesn't browse — they experience the Enigma Cycle from Phase 01 to Phase 05, then see the complete system revealed.

---

## Section Breakdown

### 1. Hero (Viewport 1)
- **Scroll behavior:** Normal vertical scroll
- **Background:** Dark (#1A1A1A) with subtle video loop (slow product pan)
- **Elements:** Headline (bold serif), subhead (sans), CTA button
- **Scribble:** Underline on "cycles" in headline
- **Transition:** Scroll down triggers scroll-lock into horizontal mode

### 2. Pillar Experience (Viewports 2-6) — HORIZONTAL SCROLL-LOCK
- **Trigger:** When hero exits viewport, the pillar container pins to the screen
- **Scroll behavior:** Vertical scroll input translates to horizontal movement
- **Total width:** 5x viewport width (one full screen per pillar)
- **Each pillar layout:**
  ```
  ┌─────────────────────────────────────────┐
  │  [Kicker: Phase 0X — Name]             │
  │                                         │
  │  [Headline]          [Product Image]    │
  │  [Body copy]         (parallax float)   │
  │  [Micro-stats]                          │
  │                                         │
  │  [Scribble icon]     [Subtle glow]      │
  └─────────────────────────────────────────┘
  ```
- **Color transitions:** Background accent glow shifts per pillar using CSS custom properties
  - Energy: `--pillar-accent: #F97316`
  - Hydration: `--pillar-accent: #3B82F6`
  - Protein: `--pillar-accent: #F5D5A0`
  - Creatine: `--pillar-accent: #EF4444`
  - Ashwagandha: `--pillar-accent: #6DA37E`
- **Product parallax:** Product image has slight Y-offset parallax (moves slower than scroll)
- **Progress indicator:** Small dots or line at bottom showing which pillar you're on (1-5)
- **Mobile:** Falls back to vertical scroll with snap points (full viewport per pillar)

### 3. Cycle Reveal (Viewport 7)
- **Trigger:** After Pillar 5 completes, scroll-lock releases
- **Animation sequence:**
  1. Background shifts to dark (#1A1A1A)
  2. Enigma logo appears center
  3. Each product icon/image slides in from its last position into a circular orbit
  4. Products settle into wheel formation (like a clock — Energy at 12, Hydration at 2, etc.)
  5. Connecting lines or circle path draws between products
  6. Headline fades in: "The complete system."
  7. CTA button appears: "Build Your Cycle →"
- **Duration:** ~2 seconds total animation, triggered by scroll position
- **Interaction:** Hovering a product on the wheel highlights its pillar name

### 4. Below the Fold (Normal Scroll)
- Trust section, product grid, brand story, footer — all normal vertical scroll
- Light background (#F5F2ED) contrast against dark cycle experience above

---

## Technical Implementation Notes

### Scroll-Lock Mechanic
- Use CSS `position: sticky` on the pillar container
- `overflow-x: hidden` on body during lock
- JavaScript: map `wheel` / `touchmove` delta-Y to container `translateX`
- Libraries: GSAP ScrollTrigger or vanilla IntersectionObserver + requestAnimationFrame
- **For Shopify Liquid:** Include as a custom section with inline `<script>` and `<style>`

### Performance
- Lazy load product images (only load when pillar is ±1 viewport away)
- Use `will-change: transform` on animated elements
- Color transitions via CSS custom properties (GPU-accelerated)
- Video hero: compressed MP4, max 3MB, poster image fallback

### Responsive Breakpoints
- **Desktop (1024px+):** Full horizontal scroll-lock experience
- **Tablet (768-1023px):** Horizontal scroll-lock with smaller product images
- **Mobile (<768px):** Vertical scroll with snap points. Each pillar = full viewport height. Swipe-friendly. No horizontal scroll-lock (too janky on mobile).

### Accessibility
- `prefers-reduced-motion`: Skip scroll-lock, show all pillars vertically
- Keyboard navigation: Arrow keys move between pillars when locked
- ARIA labels on each pillar section
- All product images have descriptive alt text

---

## Bundle Builder (Post-Cycle)
- Opens as modal or inline section
- Default: All 5 pillars selected (full cycle bundle at discount)
- User can toggle pillars on/off
- Each pillar shows: product thumbnail, name, individual price
- Running total updates live
- Bundle discount shown as savings vs individual purchase
- CTA: "Add Cycle to Cart" → Shopify cart with line items

---

## File Structure (Liquid Sections)
```
sections/
  enigma-hero.liquid
  enigma-pillar-experience.liquid
  enigma-cycle-reveal.liquid
  enigma-trust.liquid
  enigma-product-grid.liquid
  enigma-brand-story.liquid
  enigma-bundle-builder.liquid
  enigma-footer-cta.liquid

assets/
  enigma-scroll.js          (scroll-lock logic)
  enigma-animations.js      (GSAP/cycle reveal)
  enigma-bundle-builder.js  (bundle interaction)
  enigma-base.css            (design system tokens)
  enigma-pillar.css          (pillar-specific styles)
  
snippets/
  enigma-pillar-card.liquid  (reusable pillar template)
  enigma-product-card.liquid (reusable product card)
  enigma-scribble.liquid     (SVG scribble elements)
```

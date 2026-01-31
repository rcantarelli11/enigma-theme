# Enigma — Homepage V3: Design + Copy Spec
## The 50% → 80% Push

> This is the definitive build spec. Bolt: follow this exactly. Every section, every transition, every word.

---

## Design System

### Typography
- **Display/Headlines:** Clash Display (Bold/Semibold) — geometric, confident, feels like a brand
- **Body:** General Sans or Satoshi — warm but clean, not cold like Inter
- **Phase labels/eyebrows:** All caps, 12px, 600 weight, tracked 0.15em
- **Sizes:** Hero H1 = 72px desktop / 40px mobile. Section H2 = 48px / 32px. Body = 18px / 16px

### Color
- **Background:** #0A0A0A (true dark, not gray-dark)
- **Text primary:** #F0F0F0 (warm off-white)
- **Text secondary:** #888888
- **Accent:** #14B8A6 (Enigma teal) — ONLY on CTAs, active states, phase indicators
- **Accent glow:** rgba(20, 184, 166, 0.15) for card borders, subtle halos
- **Cards:** rgba(255, 255, 255, 0.03) background, 1px border rgba(255,255,255,0.06)

### Spacing
- Section padding: 120px vertical desktop, 80px mobile
- Content max-width: 1200px
- Card padding: 48px desktop, 32px mobile

### Animation Principles
- Everything scroll-progress-driven (not intersection observer)
- Lenis smooth scroll for momentum feel
- Parallax on background elements (0.3x–0.7x speed)
- Text reveals: word-by-word opacity + translateY on scroll progress
- Transitions between sections: background color morphing, not hard cuts
- All transitions ease-out, 300-500ms for interactions, scroll-linked for reveals

---

## Page Flow

### 1. Announcement Bar (Fixed top)
```
Free shipping on The Full Cycle | Save 20% when you complete your cycle
```
- Dark bg, teal text, small. Dismissible.

---

### 2. Navigation
- Logo: "ENIGMA." (Clash Display Bold, white, no script font — the script font on the current site kills the premium feel)
- Links: The Cycle | Products | Our Story | Bundle
- Right: Cart icon with count
- Sticky on scroll, blurs background (backdrop-filter: blur(20px))
- Transparent on hero, solid dark on scroll

---

### 3. Hero Section — "The System"
**Layout:** Full viewport height. Left text, right visual.

**Left side:**
```
Eyebrow: THE PERFORMANCE SYSTEM
H1: Train. Recover. Repeat.
Sub: 5 phases. One cycle. Clean nutrition engineered 
for every stage of your training — from first rep 
to full recovery.
CTA Primary: [Shop The Cycle →]  (teal, solid)
CTA Secondary: [See How It Works ↓]  (ghost, border only)
```

**Right side:** The Cycle Wheel — 5 phase nodes in a pentagon formation
- Each node = icon + label, glowing teal border when active
- Auto-rotates: each phase lights up in sequence (3s per phase)
- On hover/click: expands to show product image + one-liner
- Center of wheel: subtle radial glow animation, pulsing
- Behind wheel: very subtle particle/dot grid, parallax at 0.3x

**Scroll behavior:** As you scroll past hero, the wheel stays center and begins to dissolve/fade while the first phase section takes over.

**Copy notes:**
- "Train. Recover. Repeat." is punchy and loops (like the cycle concept)
- Drop "Power Beyond Limits" — it's generic supplement energy
- No script/cursive font on the hero. Ever.

---

### 4. Cycle Story — Sticky Scroll Section
**This is the signature section.** 500vh of scroll space, content pinned.

**Structure:** The section pins to the viewport. As you scroll through 500vh, you progress through all 5 phases. Each phase cross-fades in/out.

**Layout (pinned):**
- Left: Product image (large, ~50% width, dark bg with teal accent glow behind product)
- Right: Phase content

**Phase 1: ENERGY**
```
Phase tag: ⚡ PHASE 1 — PRE-TRAINING
Time: 15-20 minutes before your session
H2: Dial In Before You Start
Body: Clean energy, smooth focus, zero crash. Every ingredient 
on the label — because you should know what's fueling your session.
Features:
✓ Full label transparency — no proprietary blends
✓ Sustained energy without jitters
✓ 7 bold flavors from Cotton Candy to Lychee Splash
[Shop Energy →]
```

**Phase 2: HYDRATION**
```
Phase tag: 💧 PHASE 2 — DURING TRAINING
Time: Sip throughout your session
H2: Water Isn't Enough
Body: Full electrolyte profile — sodium, potassium, magnesium — 
in the ratios your body actually needs. Not a sugar bomb 
with electrolyte marketing.
Features:
✓ Functional electrolytes, not just flavor
✓ Unique flavors: Matcha Green Tea, Passion Fruit, Lychee
✓ Sustains performance through the longest sessions
[Shop Hydration →]
```

**Phase 3: PROTEIN**
```
Phase tag: 🥛 PHASE 3 — POST-TRAINING
Time: Within 30 minutes of your last set
H2: Recovery Starts the Moment You Finish
Body: 25g of pure whey isolate. Fast-absorbing, easy on the 
stomach, no bloating. Make the 30-minute window count.
Features:
✓ 100% whey protein isolate — not a concentrate blend
✓ 25g protein, minimal lactose, lean macros
✓ Smooth mixability — no clumps, no chalky aftertaste
[Shop Protein →]
```

**Phase 4: STRENGTH**
```
Phase tag: 💪 PHASE 4 — DAILY
Time: Every day, with or without training
H2: The Foundation
Body: The most studied supplement in fitness. 5g pure creatine, 
properly dosed, no filler. Strength, power output, recovery — 
the fundamentals, done right.
Features:
✓ 5g creatine monohydrate per serving
✓ Micronized for absorption
✓ Unflavored — stack with anything
[Shop Creatine →]
```

**Phase 5: RECOVERY**
```
Phase tag: 🧘 PHASE 5 — EVENING
Time: Daily, preferably evening
H2: The Phase Most Athletes Skip
Body: Training breaks you down. Sleep builds you up. 
Ashwagandha manages cortisol, supports deep rest, and gives your 
body what it needs to actually grow. Skip this phase and 
you're leaving gains on the table.
Features:
✓ KSM-66® Ashwagandha — the gold standard extract
✓ Cortisol management + stress reduction
✓ Better sleep quality = better recovery
[Shop Ashwagandha →]
```

**Scroll progress indicator:** Vertical line on right side with 5 dots, active dot = current phase. Or horizontal progress bar at bottom of pinned section.

**Transition out:** After Phase 5, the pinned section releases. A text line fades in center-screen:

```
"That's the cycle. Now build yours."
```

This morphs/scrolls directly into the bundle builder. No hard section break.

---

### 5. Bundle Builder — "Build Your Cycle"

**Header:**
```
Eyebrow: COMPLETE YOUR CYCLE
H2: Build Your Cycle
Sub: Choose your flavors. Save 20%.
```

**Layout:** Two columns — builder left (60%), summary right (40% sticky)

**Left column — Phase cards:**
Each phase = a glass card. BUT instead of plain list:
- Phase number + name + product image thumbnail (40px) on the left
- Price on the right
- Flavor options below as pills (teal border on select, fill on selected)
- **Selected flavor shows the actual product image** — dynamic swap
- Creatine + Ashwagandha = "Included" badge, no flavor choice, teal checkmark
- Green animated checkmark appears when a phase is configured
- **Micro-interaction:** card border glows teal briefly when you make a selection

**Right column — Sticky summary:**
```
THE FULL CYCLE

⚡ Energy          [Selected Flavor]    $29
💧 Hydration       [Selected Flavor]    $27
🥛 Protein         [Selected Flavor]    $44
💪 Creatine        Unflavored           $26
🧘 Ashwagandha     KSM-66®             $19
─────────────────────────────────────────
Retail total                          $145
Cycle discount (20%)               −$29.00
─────────────────────────────────────────
Your price                         $116.00

[Add Full Cycle to Cart →]
```

- CTA button: Large, teal, full-width within the summary card
- **Pulsing teal glow** on the button when all 3 flavors are selected
- Below CTA: trust badges (Free shipping · 30-day guarantee · Full transparency)
- **Social proof line:** "1,200+ cycles built" or similar (even if estimated — update when real)

**Mobile:** Summary becomes a fixed bottom bar showing price + CTA. Tapping expands to full summary.

---

### 6. Social Proof Section

**Layout:** Dark bg, centered text

```
Eyebrow: BUILT FOR PEOPLE WHO READ LABELS
H2: No Proprietary Blends. No Mystery Powders.
Sub: Every ingredient, every dose — right on the label. 
We don't hide behind blends because we don't need to.
```

Below: 3-column grid of proof points:
```
[Lab Tested]              [Full Transparency]       [Clinically Dosed]
Third-party verified      Every ingredient visible   Real doses, not 
by independent labs       on every product label     fairy dust amounts
```

Below that: Testimonial carousel (if reviews exist) or a bold quote:
```
"We're not interested in hype. Just results."
```

---

### 7. Bottom CTA — Full-Width

**Layout:** Glass card, full-width, generous padding

```
Eyebrow: THE COMPLETE SYSTEM
H2: Start Your Cycle
Sub: All 5 phases. One system. Save 20%.

Inline phase flow:
⚡ Energy → 💧 Hydration → 🥛 Protein → 💪 Creatine → 🧘 Recovery

[Retail: $145] → [Your Price: $116]  (crossed out → bold)

[Build Your Cycle →]  (large teal CTA)
```

---

### 8. Footer
Clean, minimal. 3 columns:
- **ENIGMA** + tagline + social icons
- **Shop:** All Products, The Cycle Bundle, Pre-Workouts, Hydration, Protein, Creatine, Ashwagandha
- **Company:** Our Story, Contact, FAQ, Shipping & Returns

---

## Critical "Feel" Notes

1. **No emoji in the actual render** — the emoji in this spec are for reference. Use custom SVG icons or minimal line icons for the phase badges. Emoji look cheap.

2. **Product images need dark backgrounds** — if the current Shopify images are white-bg, they need to be composited onto dark or have background removed. AI-render on dark bg with teal accent lighting is the ideal.

3. **Speed matters** — Lenis + scroll animations are great but if the page stutters on a 2020 MacBook Air, it's worse than no animations. Test on throttled CPU.

4. **The scroll-pinned cycle section IS the brand differentiator.** If one thing needs to be perfect, it's this. Everything else can be "good." This has to be exceptional.

5. **No "Add to Cart" on individual products from the homepage.** The entire homepage funnels to the bundle. Individual product pages handle single purchases.

6. **Mobile-first** — 65% of traffic. The pinned scroll section should degrade gracefully to a vertical timeline on mobile, NOT try to be a pinned section on a phone.

---

## What's NOT on the homepage

- No blog section
- No Instagram feed
- No "As Seen In" press logos (don't have them yet)
- No popup on first visit (yet — add email capture after conversion baseline is established)
- No chatbot widget
- No loyalty program callout

Keep it focused. Sell the cycle. That's it.

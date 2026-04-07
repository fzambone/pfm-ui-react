# Design System Specification: Chromatic Refraction

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"

This design system moves away from the sterile, flat world of traditional SaaS interfaces toward a "Digital Curator" aesthetic. It treats the UI as a high-end editorial gallery—an immersive environment where content isn't just displayed, but staged. By utilizing heavy atmospheric refraction, intentional asymmetry, and a deep-space tonal palette, we create a sense of tangible luxury.

The system breaks the "template" look by leveraging high-contrast typography scales and overlapping containers that defy rigid, boxy layouts. We prioritize depth and light over structural lines, resulting in an experience that feels fluid, organic, and premium.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a deep `background` (`#0e0e0e`), allowing vibrant accent gradients to provide the visual "soul."

### The "No-Line" Rule

Traditional 1px solid borders for sectioning are strictly prohibited. Layout boundaries must be defined solely through background color shifts. Use `surface-container-low` for secondary sections and `surface-container-highest` for prominent cards. Differentiation is achieved through tonal contrast, not strokes.

### Surface Hierarchy & Nesting

Treat the UI as physical layers of frosted material.

- **Base Level:** `surface` (`#0e0e0e`).
- **Secondary Level:** `surface-container-low` (`#131313`).
- **Interactive Level:** `surface-container-highest` (`#262626`).

### The "Glass & Gradient" Rule

Floating elements should leverage the core "Refraction" effect:

- **Background:** `bg-white/5` or `bg-black/40`.
- **Effect:** `backdrop-blur-[40px]`.
- **The Signature Highlight:** A 1px "Ghost Border" using `white/10` or `white/20`, supplemented by a CSS `box-shadow: inset 1px 1px 0px 0px rgba(255,255,255,0.15)` to simulate a light-catching top-left edge.

### Signature Accents

Main CTAs and hero elements must use a multi-stop gradient transitioning from `primary` (`#ff9f4a`) to `secondary` (`#ffd709`) or `tertiary` (`#c3feff`). This mimics the refraction of light through a prism.

---

## 3. Typography

The system uses **Inter** exclusively, utilizing a high-contrast scale to establish an editorial hierarchy.

- **Display (lg/md/sm):** Reserved for hero moments. Use `display-lg` (`3.5rem`) with tight letter-spacing (-0.02em) to create an authoritative, "magazine cover" feel.
- **Headline (lg/md/sm):** Used for primary section titles. These should be paired with generous vertical breathing room.
- **Body (lg/md):** Set in `on_surface_variant` (`#adaaaa`) for secondary text to maintain a sophisticated low-contrast look, while primary body text remains `on_surface` (`#ffffff`).
- **Label (md/sm):** Used for micro-copy and metadata. Always uppercase with increased letter-spacing (+0.05em) for a technical, high-end feel.

---

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering**, not structural shadows.

- **The Layering Principle:** To lift a card, place a `surface-container-lowest` element onto a `surface-container-low` background. The subtle shift in hex value creates a natural, soft lift.
- **Ambient Shadows:** For floating glass panels, use ultra-diffused shadows.
  - _Shadow:_ `0 20px 50px rgba(0, 0, 0, 0.5)`
  - _Color:_ Always use a tinted version of the background, never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **10% opacity**. Never use 100% opaque borders.
- **Glassmorphism Integration:** Use `backdrop-blur-3xl`. This allows background gradients to bleed through the UI, ensuring the interface feels integrated into the environment rather than a sticker placed on top.

---

## 5. Components

### Buttons

- **Primary:** A vibrant gradient of `primary` to `primary_container`. No border. Roundedness: `full`.
- **Secondary:** Glass-based. `bg-white/10` with `backdrop-blur-md` and the "Ghost Border" top-left highlight.
- **Tertiary:** Text-only using `primary` color, strictly for low-priority actions.

### Input Fields

- **Style:** `surface_container_highest` background with a `none` border.
- **Focus State:** A subtle `1px` glow using the `tertiary` (`#c3feff`) color at 30% opacity.
- **Error State:** Background shifts to `error_container` at 10% opacity with `error` colored helper text.

### Cards & Lists

- **No Dividers:** Prohibit the use of horizontal lines. Separate list items using `8px` of vertical space or a `surface_variant` hover state.
- **Structure:** Main containers must use `xl` (`1.5rem`) corner radius. Nested cards inside use `md` (`0.75rem`).

### Navigation Rail (Signature Component)

A vertical, glass-morphic pill floating on the left. Use `backdrop-blur-3xl`, `bg-white/5`, and a `full` roundedness. Active states should be a circular glow of `secondary_fixed`.

---

## 6. Do's and Don'ts

### Do

- **DO** use negative space as a structural element. If a layout feels crowded, increase the margin rather than adding a line.
- **DO** overlap elements (e.g., a glass card partially covering a background gradient) to emphasize the `backdrop-blur` effect.
- **DO** use `on_surface_variant` for labels to create a sophisticated, muted hierarchy.

### Don't

- **DON'T** use 1px solid borders to separate content areas.
- **DON'T** use standard "drop shadows" with high opacity.
- **DON'T** use pure white (`#ffffff`) for backgrounds; always use the `surface` tokens to maintain the dark mode depth.
- **DON'T** align everything to a rigid grid. Allow some elements to float or offset to create visual interest.

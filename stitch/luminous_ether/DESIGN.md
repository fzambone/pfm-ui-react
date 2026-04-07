# Design System Specification: Luminous Ledger

## 1. Overview & Creative North Star

### The Creative North Star: "The Luminous Ledger"

The objective of this design system is to transform personal finance from a clinical, spreadsheet-driven chore into a cinematic, editorial experience. We are moving away from the "SaaS-standard" dashboard and toward a "Digital Curator" aesthetic.

The interface should feel like data suspended in a physical, atmospheric space. We achieve this by breaking the rigid, boxy grid through intentional asymmetry, varying component scales, and overlapping elements. By utilizing high-contrast typography and deep, translucent layers, we create a sense of prestige and focus, ensuring the user feels empowered by their financial data rather than overwhelmed by it.

---

### 2. Colors & Surface Philosophy

The palette is rooted in a deep, nocturnal base (`background: #0e0e0e`) to allow vibrant accent gradients to "glow" with purpose.

#### The "No-Line" Rule

**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment.
Boundaries must be defined through:

- **Tonal Shifts:** Placing a `surface-container-low` component against a `surface` background.
- **Translucency:** Utilizing `surface-variant` with reduced opacity to create a natural edge against the background.

#### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers—stacked sheets of frosted glass.

- **Base Layer:** `surface` (#0e0e0e)
- **Primary Containers:** `surface-container` tiers (Lowest to Highest) to create "nested" depth. For example, a secondary action area might use `surface-container-low`, while the main content card uses `surface-container-highest` to appear closer to the user.

#### The Glass & Gradient Rule

To achieve the premium feel seen in the inspiration:

- **Glassmorphism:** Use semi-transparent surface colors (e.g., `surface-variant` at 40-60% opacity) combined with a `backdrop-filter: blur(24px)`.
- **Signature Gradients:** Main CTAs and high-impact data visualizations (like progress bars or credit cards) must use vibrant gradients.
  - _Primary Gradient:_ `primary` (#ffa84f) to `primary-container` (#fe9400).
  - _Secondary Gradient:_ `secondary` (#5af8fb) to `secondary-container` (#00696b).

---

### 3. Typography

We use **Inter** as our sole typeface, relying on a sophisticated hierarchy to drive the editorial narrative.

- **Display (lg, md, sm):** Used for primary financial figures (e.g., Total Balance). These should feel authoritative. Use a slight negative letter-spacing (-0.02em) to create a tight, premium look.
- **Headline (lg, md, sm):** Used for page titles and section headers. High contrast between Headline and Body text is essential for the editorial feel.
- **Title (lg, md, sm):** Used for card headings and sub-sections.
- **Body & Labels:** `body-lg` for general reading; `label-md` and `label-sm` for metadata and micro-copy.

**Hierarchy Strategy:** Never lead with the label; lead with the data. A "Total Balance" label should be significantly smaller (`label-md`) and less opaque than the amount itself (`display-md`).

---

### 4. Elevation & Depth

In this system, depth is a function of light and transparency, not just shadows.

- **The Layering Principle:** Avoid traditional "floating" cards. Instead, stack containers. An inner card should use a higher surface tier than its parent to "lift" naturally.
- **Ambient Shadows:** When a true float is required (e.g., a modal or a primary action button), use extra-diffused shadows.
  - **Blur:** 40px–60px.
  - **Opacity:** 4%–8%.
  - **Color:** Tint the shadow with `on-surface` (white) or the component’s primary accent color to mimic natural light dispersion.
- **The "Ghost Border":** If a boundary is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque lines.
- **Edge Highlights:** For glass components, add a subtle top-left inner shadow or a thin (0.5pt) light-colored stroke at 10% opacity to mimic the "catchlight" on the edge of real glass.

---

### 5. Components

#### Buttons

- **Primary:** Gradient-filled (`primary` to `primary-container`) with `on-primary` text. Roundedness: `full`.
- **Secondary:** Glassmorphic base (`surface-bright` at 20% opacity) with a "Ghost Border."
- **Tertiary:** Text-only with an icon, using `primary` color for the text to denote interactivity.

#### Cards & Lists

- **The "No-Divider" Rule:** Forbid the use of divider lines in lists. Use vertical white space from the spacing scale (minimum `1rem`) or subtle background shifts between items.
- **Corner Radius:** All main cards must use `rounded-lg` (2rem) or `rounded-xl` (3rem) to reflect the organic, soft nature of the system.

#### Input Fields

- **Styling:** Use a `surface-container-low` background with a `rounded-md` (1.5rem) corner.
- **States:** On focus, the background should shift to `surface-container-highest` with a subtle glow from the `secondary` color.

#### Financial Visualizations (Custom)

- **The "Glow Trace" Chart:** Use the Teal-to-Blue gradient for line charts. Apply a soft glow (shadow) to the line itself to make it appear as if it is illuminating the glass surface beneath it.
- **Progress Rings:** Use heavy stroke weights and the Orange-to-Yellow gradient, paired with a `surface-container-highest` track.

---

### 6. Do's and Don'ts

#### Do

- **Use "Breathing Room":** Leverage large margins and padding to create a sense of luxury.
- **Embrace Asymmetry:** Align high-level stats to the left while keeping navigation or secondary actions in a floating, asymmetrical rail (see sidebar in inspiration).
- **Layer with Purpose:** Ensure that the background elements (like blurry decorative orbs or subtle textures) are visible through the glass components.

#### Don't

- **Don't use pure black:** While the background is `#0e0e0e`, avoid using `#000000` for components as it kills the depth and makes the glass effect look muddy.
- **Don't use hard edges:** Every element—from buttons to the largest containers—must have a minimum radius of `rounded-DEFAULT` (1rem).
- **Don't use standard grey borders:** If you need to separate content, use light and shadow, not a pen tool.
- **Don't clutter:** If a page feels "busy," remove a container background and let the text sit directly on the `surface`.

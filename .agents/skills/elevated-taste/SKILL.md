---
name: Elevated taste
description: >-
  use this when shipping or reviewing visitor-facing UI so the change keeps the
  existing look and feel and raises visual taste instead of adding generic AI
  chrome
---
# Elevated taste

Use this when a change will be seen by a person: layout, type, color, spacing, motion, or copy-in-chrome. Skip pure infra, tests, and docs with no visitor surface.

Industry practice (Vercel `design.md` / in-repo product-design skills, Linear–Stripe–Vercel craft): agents raise taste by **matching the existing language first**, then making one considered improvement. They do not invent a second visual system.

## 1. Respect look and feel

Before writing CSS or markup:

- Reuse existing tokens, type ramp, radii, shadows, and motion. Do not add a new font, palette, or framework.
- Match spacing to the scale already on the page. Do not pick a one-off `px` because it “looks close.”
- Keep structure. Flatten extra boxes. A new card, overlay, or gradient needs a job the old layout did not already do.
- Motion is a response (press, focus, enter), not decoration. Honor `prefers-reduced-motion`.

If the file already has a pattern for the same control, copy that pattern. Divergence is a bug unless the brief is to change the pattern.

## 2. Elevate

One pass, in this order:

1. **Hierarchy** — one primary, everything else quieter. If two things shout, neither is primary.
2. **Spacing rhythm** — consistent gaps; more space between groups than within them.
3. **Type** — size and weight already in the ramp; do not introduce a display face.
4. **Color** — existing accent for action only. Neutral for the rest. No extra gradient.
5. **Motion** — 150–300ms, ease-out, on the thing the visitor touched. No loop, no bounce on idle chrome.
6. **Focus** — `:focus-visible` on real controls only; ring follows the control’s existing radius.

Stop after one elevation. A second “make it nicer” pass is how taste turns into chrome.

## 3. Anti-slop (do not ship)

These are the default AI tells. Treat any of them as FAIL:

- Purple/violet mesh, aurora blobs, or glow as the page identity
- Glassmorphism on inert pills, chips, or badges
- Bounce, spin, or pulse on idle chrome
- Bento grids, 3D heroes, “AI startup landing” composition
- Fake affordance: hover/press on something that does not act
- New shadow, blur, or radius that does not already exist on the page
- Copy that sounds like a template (“unlock”, “seamless”, “delight”)

## 4. Freeze check

Before a visitor-facing PR is ready for review, answer:

- Would this still look like the same product if you squint?
- Did I add a surface, motion, or color that is not already in the system?
- Is there one thing a visitor can do more clearly than before?

If the first answer is no, or the second is yes without a brief, strip it. If the third is no, the change has no taste job — do not ship it as a visual PR.

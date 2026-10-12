## HARD ABORT — Apex /experimental MVPs (owner lock 2026-10-12)

Read this before scouting. It overrides any idea below.

- Never build a new `/experimental/**` MVP route or page.
- A noindex experimental route is not a visitor surface.
- If the change isn't visible to a visitor, stop and exit the cycle without opening a PR. Do not downscope into a sibling pass.

Recent farm runs: #1695.

---

# HARD ABORT — farmed experimental stack/uses pages

Read this before scouting. If the idea is one of these, ABORT the cycle. Do not downscope into a sibling route with the same job. Do not open a PR.

Do NOT recreate:

- `/experimental/dx-stack`
- `/experimental/uses`
- `/experimental/stack`
- any noindex experimental stack/uses page

Already closed as farm: #768, #732, #718, #702.

Prefer visitor-facing craft on live surfaces (Home, Work, Biography, Contact, and other shipped pages). Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-08-29 - Farm abort | Signal: closed #768/#732/#718/#702 | Lean Implementation: HARD ABORT dx-stack/uses/stack experimental routes; prefer live visitor surfaces

## 2026-05-25 - Strategic Pulse | Signal: "/now" page trend | Lean Implementation: Flagged experimental route, < 50 lines total delta.

## 2026-05-26 - Product Manifesto | Signal: Product Leadership "Guiding Principles" trend | Lean Implementation: Isolated experimental route, uses Hero/Icon primitives, ~45 lines delta.

## 2026-05-27 - Strategic Reading List | Signal: Portfolio "Bookshelf" trend | Lean Implementation: Isolated experimental route, static data array, uses Hero/Pill/Icon primitives, ~48 lines delta.

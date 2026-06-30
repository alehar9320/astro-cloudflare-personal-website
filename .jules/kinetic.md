# Kinetic Journal ⚡

## 2025-05-15 - Interactive Glassmorphism for Skills Section

- **Signal:** Standardized skills box lacked interactive affordance and depth.
- **Action:**
  - Upgraded `.box` in `src/components/Skills.astro` with `backdrop-filter: blur(16px)` for enhanced glassmorphism.
  - Implemented hardware-accelerated hover state with `translateY(-4px)` for better visual hierarchy.
  - Aligned hover shadow with "Northern Lights" palette using `hsla(210, 100%, 45%, 0.3)`.
  - Added `prefers-reduced-motion` safety for accessibility.
- **Tokens Added:**
  - Glass Blur: `16px`
  - Affordance: `translateY(-4px)`
  - Glow: `hsla(210, 100%, 45%, 0.3)`

## 2026-06-12 - Upgrade Mention Cards with Interactive Glassmorphism

- **Signal:** Mention cards in the home page lacked the depth and interactivity present in other portfolio elements.
- **Action:**
  - Upgraded `.mention-card` in `src/pages/index.astro` with interactive glassmorphism using scoped CSS variables (`--card-blur`, `--card-bg-opacity`, `--card-hover-offset`, `--card-glow-color`).
  - Enhanced hover/focus state with hardware-accelerated `translateY` and a themed marine blue glow.
  - Implemented `prefers-reduced-motion` safety for accessibility.
- **Tokens Added (Scoped):**
  - `--card-blur`: `16px`
  - `--card-hover-offset`: `-4px`
  - `--card-glow-color`: `hsla(210, 100%, 45%, 0.3)`

## 2026-06-12 - Infrastructure & Security Alignment (Remediation)

- **Signal:** CI failure due to 24 security vulnerabilities (npm audit) and deprecated core dependencies.
- **Action:**
  - Upgraded project to **Astro 7.0.3** and aligned `@astrojs/cloudflare` and `@astrojs/node` to resolve peer dependency conflicts.
  - Implemented mandatory security remediation via `package.json` overrides:
    - Pinned `undici` to `7.28.0` to resolve critical vulnerabilities while maintaining `jsdom` compatibility.
    - Overrode `esbuild` (`^0.28.1`) and `vite` (`^8.1.0`) to latest secure versions.
    - Updated `dompurify`, `postcss`, and `yaml` to address transitive CVEs.
- **Outcome:** 0 vulnerabilities reported by `npm audit`, passing CI security gates.

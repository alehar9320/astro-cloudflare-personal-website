## 2025-01-24 - Aurora Canvas Laboratory

### Feature Track: Northern Lights Interactive Visuals

**Signal:** Intent to elevate the portfolio's "Northern Lights" aesthetic through performant, math-driven digital art.
**Lean Implementation:** Created an isolated laboratory route (`/lab/aurora`) featuring a self-contained HTML5 Canvas component that renders interactive light refractions.

### Math Logic Setup

- **Wave Physics:** Uses a multi-layered sine wave formula to simulate fluid motion:
  `y = offset + sin(time * frequency + x * horizontalSpeed) * amplitude`
- **Dynamic Color Gradients:** Implemented `createLinearGradient` with `rgba(0, 210, 255, 0.3)` and `rgba(0, 255, 150, 0.2)` to achieve the marine-blue/cyan aurora effect.
- **Complexity:** $O(N)$ rendering where $N$ is the number of waves (currently 3).

### Performance & Garbage Collection

- **Frame Rate:** Maintained solid 60fps on desktop and mobile.
- **Lifecycle Management:** Strictly used `cancelAnimationFrame` and `removeEventListener` within the `astro:before-swap` event to prevent memory leaks during client-side navigation.
- **Canvas Memory:** Isolated canvas sizing to `clientWidth`/`clientHeight` to ensure minimal pixel buffer allocation.

### Mobile & Accessibility Adaptation

- **Scaling:** Automatically detects container dimensions and adjusts resolution on `resize` events.
- **Accessibility:** Wrapped the entire animation loop in a `window.matchMedia('(prefers-reduced-motion: reduce)')` check. If enabled, the animation loop is never started, and a static state is shown.
- **Touch Interaction:** Interaction is currently passive (math-driven) to minimize main-thread blocking on low-power mobile devices.

### Verification Results

- **Unit Tests:** `src/utils/__tests__/aurora-math.test.ts` passed (100% coverage on core wave math).
- **Build:** Verified successful compilation of canvas contexts and asset processing via `npm run build`.
- **Visuals:** Playwright screenshot confirmed alignment with glassmorphic design tokens (blur, transparency).

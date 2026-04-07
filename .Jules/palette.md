# 🎨 Palette's Journal

## Accessibility & UX Learnings

### Standardized Focus States for Glassmorphic Cards
In Astro projects using Vanilla CSS, reusable components like `PortfolioPreview` benefit from mirroring their hover states in the `:focus-visible` pseudo-class.
- **Pattern:** Use `transform: translateY(-6px)` combined with a themed `box-shadow` (using `hsla` for transparency) to provide high-visibility feedback for keyboard users.
- **Implementation:**
  ```css
  .card:hover,
  .card:focus-visible {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px -5px hsla(210, 100%, 45%, 0.4), var(--shadow-lg);
  }
  ```

### Premium "Skip to Content" Redesign
The default accessibility "skip link" is often an unstyled block. To align with a glassmorphic aesthetic:
- Use `position: fixed` to place it at the top-center of the viewport.
- Apply `backdrop-filter: blur(16px)` and a translucent background.
- Use `transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)` for a smooth "slide-down" entrance.
- Ensure the focus state is triggered by `.sr-only:focus-visible`.

### Interaction Constraints
- **Cloudflare Workers:** Avoid heavy client-side JS for simple UX polish. CSS-only solutions for focus states and skip links are more performant and reliable in this environment.
- **Astro Scoping:** Be mindful of `global.css` overrides. Component-scoped styles in `.astro` files should explicitly handle focus states to avoid falling back to browser defaults that might clash with dark/glassmorphic themes.

## 2026-04-08 - SVG Path Removal & LCP Priority

Learning: [Inlining SVG paths in a TypeScript object means they are bundled into the main JavaScript payload. Removing unused paths directly reduces the initial JS download size, which is a high-leverage win for performance-obsessed agents. Additionally, explicitly signaling high fetch priority for the hero image improves LCP by ensuring the browser starts the download as early as possible.]

Action: [Always profile IconPaths.ts for unused icons when working on performance. Audit the home page for the primary LCP candidate and apply fetchpriority="high". Avoid decoding="async" for LCP candidates to ensure rapid painting.]

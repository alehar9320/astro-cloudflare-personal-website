2025-04-10 - Pruning Unused Icon Paths
Learning: The IconPaths.ts file was carrying several unused SVG paths, which increases the baseline JS bundle size for all pages using the Icon component. Pruning them yielded a ~38% reduction in file size (9.1KB to 5.6KB).
Action: Audit shared asset/config files regularly for dead code or unused definitions to keep the bundle lean.

2025-04-10 - Prioritizing LCP Image
Learning: Standard image loading (lazy) on hero elements can delay the Largest Contentful Paint. Using fetchpriority="high" and loading="eager" signals the browser to start the download immediately.
Action: Always check if an image is part of the initial viewport (above-the-fold) and apply high priority loading attributes.

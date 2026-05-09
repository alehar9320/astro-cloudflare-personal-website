2026-05-09 - Pruning unused icon paths
Learning: Icon collections in `IconPaths.ts` can grow over time with unused assets, increasing the bundle size of components that import the entire collection.
Action: Periodically audit icon usage and prune unused SVG paths. Today's audit reduced `IconPaths.ts` by ~38% (9.1KB to 5.6KB) by removing 11 unused icons.

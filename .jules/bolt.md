2025-05-15 - Remove unused icon paths
Learning: Audit `IconPaths.ts` periodically as the set of unused icons can grow over time, increasing the JS bundle size unnecessarily.
Action: Implement a check for unused icon paths in the build process or linting step to catch these early.

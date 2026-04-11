## 2025-02-12 - Synchronize hover lift and focus-visible states

**Learning:** For interactive components that 'lift' on hover (using `transform: translateY`), the `:focus-visible` state should include the same transformation to maintain a consistent spatial mental model for keyboard users.
**Action:** Always apply the Focus Animation Standard when implementing hover lift effects, ensuring `:focus-visible` matches the transformation and provides a standardized accessible outline.

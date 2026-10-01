# Architecture Decision Records (ADRs)

This directory documents the architectural decisions made for Alexander Härenstam's personal portfolio repository. Every significant architectural pattern, infrastructure boundary, or technical evolution is recorded here to maintain explicit ground-truth context for human developers and autonomous AI agents.

## ADR Status Lifecycle

- **Proposed:** Architectural shift or technology adoption under evaluation.
- **Accepted:** Approved decision currently implemented or active in the repository.
- **Superseded:** Replaced by a newer ADR (must link to replacement ADR).
- **Deprecated:** No longer recommended or supported.

## Index of Architectural Decisions

| Number                                                       | Title                                                                                                            | Status     | Date       | Summary                                                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-cloudflare-production-render-jules.md)           | [Cloudflare as Production Runtime, Render as Jules Test Environment](0001-cloudflare-production-render-jules.md) | `Accepted` | 2026-08-24 | Cloudflare Workers + Assets is strict production; Render is isolated Node server test env for AI debugging.               |
| [0002](0002-static-feature-flags-via-content-collections.md) | [Static Feature Flags via Type-Safe Content Collections](0002-static-feature-flags-via-content-collections.md)   | `Accepted` | 2026-08-24 | Experimental features and UI toggles use static JSON flags in `src/content/flags/config.json` with Zod schema validation. |

## Directives for AI Agents

- **Do:** Ensure new ADRs strictly increment sequentially (`0003`, `0004`, etc.) and follow the standard template in `0001` and `0002`.
- **Do:** Keep this master index table updated whenever creating or modifying ADRs.
- **Don't:** Delete or overwrite existing ADRs without linking replacement ADRs in `docs/adr/README.md`.

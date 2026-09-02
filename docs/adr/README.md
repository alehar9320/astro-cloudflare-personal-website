# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Personal Portfolio repository.

## Index

| ADR                                                            | Title                                                      | Status   | Date       |
| :------------------------------------------------------------- | :--------------------------------------------------------- | :------- | :--------- |
| [0001](0001-cloudflare-production-render-jules.md)             | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 |
| [0002](0002-feature-flag-isolation-and-content-collections.md) | Feature Flag Isolation and Type-Safe Content Collections   | Accepted | 2026-03-30 |

## ADR Creation Guidelines

When creating a new ADR:

1. File names follow sequential zero-padded numbering: `NNNN-[kebab-case-title].md`.
2. Every ADR must include:
   - Header metadata (`Status`, `Date`, `Deciders`).
   - `Context`
   - `Decision`
   - `Consequences & Tradeoffs`
   - `Directives for AI Agents` (mandatory `Do` and `Don't` guidelines).
3. Always update this `README.md` master index in the same pull request.

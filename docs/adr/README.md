# Architecture Decision Records (ADR)

This directory contains sequence-indexed Architecture Decision Records (ADRs) governing the architectural evolution, technology choices, and operational constraints of this repository.

## Index

| ID                                                               | Title                                              | Status   | Date       | Deciders             | Summary                                                                                                    |
| ---------------------------------------------------------------- | -------------------------------------------------- | -------- | ---------- | -------------------- | ---------------------------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md)             | Cloudflare as Production, Render as Jules Test Env | Accepted | 2026-08-24 | Autonomous Architect | Establishes Cloudflare Workers as primary production and Render as a Node-isolated agent test environment. |
| [0002](./0002-feature-flags-and-experimental-route-isolation.md) | Feature Flags and Experimental Route Isolation     | Accepted | 2026-03-31 | Autonomous Architect | Mandates JSON feature flags and experimental route isolation for autonomous agent feature development.     |

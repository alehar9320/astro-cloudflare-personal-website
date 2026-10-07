2026-08-25 - Codification of Static Feature Flags ADR and Master Architecture Artifacts
Learning: Architectural decisions and feature flags were being utilized across agents without a centralized master index (`docs/adr/README.md`), explicit AI directives in early ADRs, or a repo Tech Radar. This left new AI agent personas susceptible to context drift or recommending dynamic runtime feature flags.
Action: Maintain `docs/adr/README.md` and `docs/tech-radar.md` synchronously whenever new architectural conventions are codified, ensuring every ADR includes explicit "Directives for AI Agents".

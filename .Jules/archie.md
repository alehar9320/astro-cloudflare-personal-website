2026-10-11 - Static Pre-Rendering Architecture & Tech Radar Alignment
Learning: The repository lacked a master ADR index, a second ADR codifying its primary static pre-rendering architecture (`output: 'static'` + Cloudflare Assets binding), and a Tech Radar (`docs/tech-radar.md`). Establishing explicit "Directives for AI Agents" in ADRs prevents autonomous agent drift toward unwanted SSR or missing asset bindings.
Action: Maintain `docs/adr/README.md` and `docs/tech-radar.md` in sync across all future architectural decisions and ensure every new ADR includes enforceable AI agent directives.

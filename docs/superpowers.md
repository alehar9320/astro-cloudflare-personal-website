# Superpowers for AI Agents

This repo vendors the [Superpowers](https://github.com/obra/superpowers) skill set so every
harness used here shares one library of disciplined engineering workflows (brainstorming,
planning, test-driven development, systematic debugging, code review, and more).

The skills are **vendored** into `.agents/skills/` and pinned in
[`scripts/vendor-superpowers.mjs`](../scripts/vendor-superpowers.mjs). There are no runtime
dependencies and no network access at build time.

## Layout

| Path                                                     | Role                                                                                                                        |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `.agents/skills/<name>/SKILL.md`                         | Canonical skill location, shared by all harnesses. Contains both the repo's own skills and the vendored Superpowers skills. |
| `.agents/skills/using-superpowers/SKILL.md`              | Bootstrap skill. Read this first; it routes to the rest.                                                                    |
| `.agents/skills/using-superpowers/references/*-tools.md` | Per-harness tool mappings (what a "subagent" or "todo" action means on each harness).                                       |
| `.opencode/plugins/superpowers.js`                       | opencode adapter: registers the skills path and injects the bootstrap.                                                      |
| `.pi/extensions/superpowers.ts`                          | pi adapter: registers the skills path and injects the bootstrap.                                                            |
| `scripts/vendor-superpowers.mjs`                         | Idempotent updater that re-vendors the skills from upstream.                                                                |

## Per-harness wiring

| Harness          | Skill discovery                                                      | Bootstrap delivery                                                                                                | Tool mapping                                      |
| :--------------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| **opencode**     | Native `.agents/skills/` discovery, plus the plugin's config hook    | `.opencode/plugins/superpowers.js` injects the bootstrap into the first user message of top-level sessions        | `references/opencode-tools.md` + injected mapping |
| **pi**           | `pi.skills` in `package.json` + the extension's `resources_discover` | `.pi/extensions/superpowers.ts` injects on the `context` event                                                    | `references/pi-tools.md` + injected mapping       |
| **Grok Build**   | Native project `.agents/skills/` discovery                           | Passive: `SessionStart` cannot inject, so the bootstrap comes from `AGENTS.md` and the surfaced skill description | `references/grok-tools.md`                        |
| **Google Jules** | Reads repo files and `AGENTS.md` (no skill loader)                   | Read `.agents/skills/using-superpowers/SKILL.md` directly                                                         | `references/jules-tools.md`                       |

Grok Build and Jules have no context-injection hook, so for those two the **bootstrap lives in
[`AGENTS.md`](../AGENTS.md)**. Keep that section accurate if the wiring changes.

## Updating the vendored skills

The skills are kept verbatim from upstream. Do not hand-edit them.

1. Bump `REF` in `scripts/vendor-superpowers.mjs` to the new upstream tag.
2. Run `npm run vendor:superpowers`. This re-clones upstream at the pinned tag, copies
   `skills/` into `.agents/skills/`, and re-applies the Platform Adaptation pointer list.
3. Run `npm run test`, `npm run lint`, and `npm run format:check`.

The script is idempotent: re-running it at the same tag produces no diff. The only local edit it
re-applies is the `using-superpowers` Platform Adaptation list, which points readers at the
repo's harness tool mappings (the vendored skills are otherwise untouched).

The repo's **own** skills live in the same directory and are authored here — they are safe to
edit and are not overwritten by the vendor script (it only writes files that exist upstream).

## Verification

`__tests__/superpowers.spec.ts` guards the wiring:

- the bootstrap skill and every adapted-harness reference file exist,
- the Platform Adaptation list names every adapted harness,
- `patchPlatformAdaptation` inserts the pointers and is idempotent,
- `copySkills` copies recursively and preserves executable modes,
- the pinned ref is an explicit tag.

## Keeping vendored content out of the site build

The vendored skills are not part of the Astro/Cloudflare build. They are excluded from
`tsconfig.json`, `eslint.config.mjs`, and `.prettierignore` so upstream formatting and script
files never break CI. The repo's own skills remain format-checked.

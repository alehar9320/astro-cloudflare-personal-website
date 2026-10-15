# OpenCode Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file").
On OpenCode these resolve to the tools below. Verify against your installed
OpenCode build — the exact built-in set varies by version.

| Action skills request | OpenCode equivalent |
| --- | --- |
| Invoke a skill | OpenCode's native `skill` tool: `skill({ name: "<skill-name>" })` |
| Read a file | `read` |
| Create a file | `write` |
| Edit a file | `edit` |
| Delete a file | `bash` (`rm`) |
| Run a shell command | `bash` |
| Search file contents | `grep` |
| Find files by name | `glob` |
| Fetch a URL | `webfetch` |
| Search the web | `websearch` |
| Dispatch a subagent (`Subagent (general-purpose):` template) | `task` with `subagent_type: "general"` (or `"explore"` for codebase exploration) |
| Create or update todos | `todowrite` |

Older OpenCode builds that expose mutation only through `apply_patch` should map
"create / edit / delete a file" to `apply_patch` instead of `write` / `edit`.

## Skills

Use OpenCode's native `skill` tool to list and load skills. The Superpowers
skills are discovered from `.agents/skills/<name>/SKILL.md` (project
`agent-compatible` path); personal skills live in
`~/.config/opencode/skills/<name>/SKILL.md`. The `using-superpowers` bootstrap
is injected automatically by the local plugin at
`.opencode/plugins/superpowers.js`; do not re-load it manually.

## Subagents

`task` is the subagent tool. Pass `subagent_type: "general"` for a
general-purpose child, or `"explore"` for read-only codebase exploration. The
Superpowers skills that fan out (`dispatching-parallel-agents`,
`subagent-driven-development`) expect this action; if the tool is unavailable,
do the work inline rather than inventing a call.

## Task tracking

`todowrite` is the task-list tool. Treat older `TodoWrite` references as this
action.

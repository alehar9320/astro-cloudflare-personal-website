# Grok Build Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file").
On Grok Build these resolve to the tools below. Grok maps Claude-style tool
names onto its own, so both names usually work; trust your live tool list over
this table when they disagree.

| Action skills request | Grok equivalent |
| --- | --- |
| Read a file | `read_file` (alias `Read`) |
| Create / edit a file | `search_replace` (aliases `Edit`, `Write`, `MultiEdit`) |
| Run a shell command | `run_terminal_command` (alias `Bash`) |
| Search file contents | `grep` |
| Find files by name | `list_dir` (aliases `Glob`, `ListDir`) |
| Search the web | `web_search` (alias `WebSearch`) |
| Dispatch a subagent (`Subagent (general-purpose):` template) | `spawn_subagent` (alias `Task`) |

Grok has no `Skill` tool: skills are auto-invoked when a task matches, or called
by name. Treat "invoke a skill" as Grok's native skill mechanism — and, when a
skill is named, read its `.agents/skills/<name>/SKILL.md` so the full body is in
context.

## Skill discovery and the bootstrap

Grok discovers the vendored Superpowers skills from `.agents/skills/` (project)
and surfaces each skill's name and description. The `using-superpowers`
description is what should prompt you to load it. Because Grok's `SessionStart`
hook is passive and cannot inject context, the Superpowers bootstrap reaches you
through the "Superpowers" section of `AGENTS.md` plus that surfaced description —
so read `AGENTS.md` and act on it at the start of a session.

## Task tracking and subagents

Use whatever todo/task tool your Grok build exposes; treat older `TodoWrite`
references as that action. `spawn_subagent` is the subagent tool for the
fan-out skills (`dispatching-parallel-agents`, `subagent-driven-development`);
if multi-agent is disabled, do the work inline rather than inventing a call.

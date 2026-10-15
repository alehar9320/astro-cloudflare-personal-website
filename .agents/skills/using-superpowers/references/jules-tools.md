# Google Jules Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file").
Google Jules runs asynchronously against the repository and reads `AGENTS.md` at
the start of a task. It exposes no named harness tools to the model, so map the
action vocabulary to plain repository operations.

| Action skills request | Jules equivalent |
| --- | --- |
| Read a file | Read the file from the checkout |
| Create / edit / delete a file | Write the file in the checkout |
| Run a shell command | Run it in the Jules environment (tests, build, format) |
| Search file contents / find files by name | Grep / list the checkout |
| Fetch a URL / web search | Use your available network access, or skip and note it |
| Dispatch a subagent | Not available — do the work inline, sequentially |
| Create or update todos | Keep a checklist in the task plan or a `TODO.md` |

## Loading skills

Jules has no `Skill` tool. The blessed path is to **read the skill's
`SKILL.md`** when the skill applies — this is not a violation of the "always use
your platform's skill mechanism" rule, because on Jules that mechanism *is*
reading the file.

- Bootstrap: read `.agents/skills/using-superpowers/SKILL.md` and follow it
  before acting on any task.
- Discovery: list `.agents/skills/*/SKILL.md` and read the `name` and
  `description` frontmatter to find a skill that matches the task. Read the full
  body of any match before proceeding.

## Subagents and task tracking

Jules does not dispatch subagents from within a task, so skills that fan out
(`dispatching-parallel-agents`, `subagent-driven-development`) should be
executed inline — one task at a time — rather than by inventing a dispatch
call. Track progress in the task plan or a repo-local `TODO.md`; treat older
`TodoWrite` references as that action.

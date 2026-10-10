---
source: https://atlcli.sh/reference/research/
---

# Jira and Confluence Research

`atlcli research` produces one cited Markdown report from read-only Jira and Confluence evidence.
`atlcli chat` answers a scoped question without a research graph.

Both commands are read-only. Neither command writes to Jira or Confluence.

## Prerequisites

- A profile with access to the target Jira projects and Confluence spaces. Check the profile with `atlcli auth status`.
- `ANTHROPIC_API_KEY` must come from the process environment. Export it from the shell or a CI secret store. No CLI flag accepts it. Never put it on the command line.

## Research (CLI)

Run `--plan-only` first to review the scope and plan before you spend model budget. This mode persists the brief and graph and prints the sanitized plan. It runs no research.

```bash
atlcli research "Which Jira work is explicitly linked to our Confluence documentation?" \
  --profile work --project PLATFORM --space DOCS --plan-only
```

After you approve the plan, run with explicit limits:

```bash
atlcli research "Which work completed this week is documented, and which relationships are only inferred?" \
  --profile work \
  --project PLATFORM --project DELIVERY \
  --space ENGINEERING,DOCS \
  --from 2026-07-24 --to 2026-07-31 \
  --as-of 2026-07-31T12:00:00+02:00 --timezone Europe/Berlin \
  --max-run-minutes 10 --max-cost-usd 2 \
  --output /absolute/path/report.md
```

Repeated and comma-separated `--project`/`--space` values keep their order. They form a locked scope. Omitted keys use the profile default.

### Options

| Flag                                 | Default         | Constraints                                                      |
| ------------------------------------ | --------------- | ---------------------------------------------------------------- |
| `--profile <name>`                   | active profile  | Must name an existing profile                                    |
| `--project <key>`                    | profile default | A Jira key. Can be repeated                                      |
| `--space <key>`                      | profile default | A Confluence key. Can be repeated                                |
| `--from`, `--to`                     | none            | `YYYY-MM-DD`. Inclusive                                          |
| `--as-of <date/time>`                | none            | A date, or an ISO 8601 timestamp with a timezone                 |
| `--timezone <name>`                  | none            | An IANA name, for example `Europe/Berlin`                        |
| `--language <en\|de>`                | `en`            | Language of the prose and Markdown copy                          |
| `--max-run-minutes <n>`              | `10`            | 1–10                                                             |
| `--max-cost-usd <n>`                 | `2`             | $0 < n ≤ 25. Fixed for a durable session, including resumes      |
| `--max-total-model-input-tokens <n>` | `350000`        | 1,000–1,000,000. Run-wide ceiling for input tokens               |
| `--effort <mode>`                    | `auto`          | `auto`, `lookup`, `analysis`, `deep`                             |
| `--plan-approval <mode>`             | —               | `automatic`. Omitted deep plans stop for review                  |
| `--scope-expansion <m>`              | `ask`           | `strict`, `ask`, `exact-linked`                                  |
| `--reconciliation <m>`               | `auto`          | `off`, `auto`, `required`                                        |
| `--plan-only`                        | off             | Persists and prints the plan. Runs nothing                       |
| `--resume <session-id>`              | —               | Resumes an undispatched wait or an issued retrieval continuation |
| `--session <session-id>`             | —               | Follow-up in a terminal session. Keeps its scope and policy      |
| `--output <path>`                    | none            | Writes the Markdown file atomically                              |
| `--keep-session`                     | off             | Prints the retained workspace path                               |
| `--json`                             | off             | Structured report on stdout. Progress on stderr                  |

Stdout is the Markdown report. With `--output`, the file has the same bytes.

## Session Management

The following commands list and inspect research sessions.

```bash
atlcli research sessions list --limit 20
atlcli research sessions show <session-id> --outline
atlcli research sessions show <session-id> --evidence
atlcli research sessions evidence <session-id> --id <evidence-id>
atlcli research sessions plan <session-id>
```

- Plan approval and steering take revision flags (`--revision`, `--graph-revision`). Use `sessions approve`, `reject-plan`, and `revise-plan` only with explicit user approval.
- `sessions delete` is destructive. Get user approval first.
- Source text prints only with `sessions evidence --include-text`. Use that flag only when the user needs raw source.

## Limits and Cost

- Deadline: `--max-run-minutes` accepts 1–10 (default 10).
- Cost: `--max-cost-usd` accepts $0–$25 (default $2). It is a conservative ceiling for the durable session.
- Tokens: `--max-total-model-input-tokens` accepts 1,000–1,000,000 (default 350,000).
- A report that says the search is incomplete means a budget ended coverage early. Treat negative conclusions as limited to retrieved evidence.

Pass an explicit `--max-cost-usd` on each run. For narrow questions, set a low `--max-run-minutes`.

## Chat (CLI)

Flags checked with `atlcli chat --help`. Scope rules and examples come from the research docs page.

```bash
ANTHROPIC_API_KEY=... atlcli chat "Summarize the most important changes in DOCS." \
  --profile work --space DOCS --thinking auto --language en --json
atlcli chat --profile work --session <conversation-id> "Which change has the largest operational impact?"
```

- The first turn uses only explicit `--project`/`--space` values or an exact, unambiguous scope from the question. Profile defaults never apply to the first turn.
- `--thinking auto|quick|deep` (default `auto`). `deep` is still ordinary chat, not a research report.
- `--max-run-minutes` accepts 1–10. `--max-cost-usd` accepts $0–$25. The `--output <path>` flag is also available. `--json` returns the session ID and result.
- If the scope is ambiguous, select a candidate from the retained review with `--scope-revision <n>`, `--scope-mention <id>`, or `--scope-candidate <id>`.
- Ctrl+C stops the active turn. During a turn, these slash commands work: `/steer`, `/queue`, `/edit`, `/delete`, `/stop`, `/help`.
- The chat session commands are `atlcli chat sessions list|show|sources|artifact [conversation-id]`.
- Research-only flags (planning, time windows, scope expansion, reconciliation) are rejected by `chat`.

## Troubleshooting

This section lists common research errors and their fixes.

- If the error `ANTHROPIC_API_KEY is missing` appears, set the key in the environment of the process running `atlcli`.
- If the error `Select at least one Jira project` or a Confluence space error appears, pass `--project` or `--space`. Alternatively, set a profile default with `atlcli config set profiles.<name>.project` / `.space`.
- If the search is incomplete, refine the question or scope.
- A workspace left after `--keep-session` is expected. Delete the printed path when done.

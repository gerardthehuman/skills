---
source: https://atlcli.sh/confluence/export/
---

# DOCX and PDF Export

Use `atlcli wiki export` to export Confluence pages to Word (DOCX) or tagged PDF.

## Prerequisites

- You need View permission on the pages to export.

## Quick Start

The page reference can be a page ID, `SPACE:Title`, or a URL.

```bash
atlcli wiki export 12345678 --output ./report.docx
atlcli wiki export 12345678 --template corporate --output ./report.docx
atlcli wiki export "DOCS:Architecture Overview" -t report -o ./arch.docx
```

## PDF

```bash
atlcli wiki export 12345678 --format pdf --output ./report.pdf --json
atlcli wiki export 12345678 --format pdf --template ./brand.wiki-pdf-template -o ./brand.pdf
atlcli wiki export 12345678 --format pdf --pdf-standard ua-1 -o ./accessible.pdf
```

- For PDF, `--template` takes a direct `.wiki-pdf-template` path. `--engine` cannot be used with PDF.
- `--pdf-standard` accepts these values: `a-1b`, `a-1a`, `a-2b`, `a-2u`, `a-2a`, `a-3b`, `a-3u`, `a-3a`, `a-4`, `a-4f`, `a-4e`, `ua-1`. The command does not fall back to another standard.
- `--code-theme <id>` applies to DOCX and PDF. The default is `github-light`.

## Output

- `--output, -o <path>` is required unless you use `--out-dir` (PDF).
- `--out-dir <dir>` applies to PDF only. It writes `<pageId>-<slug>.pdf` files. It cannot be combined with `--output`.
- `--force` overwrites an existing file. Get user approval first.

## Scope: Tree and Space

Use `--scope tree` or `--scope space` to export a page tree or a whole space as **one** file. Chapters follow the page hierarchy.

```bash
atlcli wiki export 12345678 --scope tree --template corporate --output ./handbook.docx
atlcli wiki export --scope space --space DOCSY --template corporate -o ./docsy.docx --json
```

- The `--scope page|tree|space` option sets the scope. The default is `page`.
- The `--max-depth <n>`, `--max-pages <n>` (default 500), and `--max-folders <n>` (default 200) options set limits.
- The `--label-include a,b` and `--label-exclude c,d` options set label filters. The `--label-exclude-mode prune-subtree|page-only` option sets the exclude mode.
- The `--completeness strict|partial` option sets the completeness mode. `strict` (default) aborts on unreadable pages. `partial` adds placeholder chapters and sets `complete: false`.

## Options

- The `--format docx|pdf` option sets the output format. The default is `docx`.
- `--no-images` skips attachment images.
- `--no-field-update-prompt` (alias `--no-toc-prompt`) skips the field-refresh prompt. The TOC stays stale until you press F9.
- `--no-live-macros` skips live Jira, `export_view`, and attachment macros.
- `--json` or `--report json` writes one `atlcli.export-report/1` document to stdout.
- `--strict` exits with `2` on warning or error issues.
- `--no-cache` (PDF) does not persist downloaded assets.

The command exits with these codes. `0` means success. `1` means a usage, config, or I/O error. `2` means warnings, and only with `--strict`. `3` means an auth error. `4` means a remote or API error. `5` means a compile or validation issue. `130` means cancelled.

## Profile-Free Auth (CI)

Set all of these values or none of them. A partial set is a usage error.

```bash
export ATLCLI_API_TOKEN="$CONFLUENCE_TOKEN"
atlcli wiki export 12345678 --format pdf -o out.pdf \
  --base-url mysite.atlassian.net --email ci@example.com
```

- `--base-url` (`ATLCLI_BASE_URL`) must use HTTPS unless you pass `--allow-http`.
- `--email` (`ATLCLI_EMAIL`) is required for `api-token` and cannot be used with `bearer`.
- `--auth-type api-token|bearer` (`ATLCLI_AUTH_TYPE`) sets the auth type. The token comes only from `ATLCLI_API_TOKEN`.

## DOCX Templates

```bash
atlcli wiki export template list
atlcli wiki export template save corporate --file ./template.docx --level global   # global|profile|project
atlcli wiki export template delete old-template --confirm   # Get user approval first.
```

- `--template <name>` resolves in this order: a direct path, then project, then profile, then global.
- Placeholders use the form `$scroll.*`, for example `$scroll.title` or `$scroll.content`. Jinja `{{ }}` markers stay literal.

## Export Jobs

Use these commands to list, inspect, cancel, retry, rerun, and clear export jobs.

```bash
atlcli wiki export jobs list [--status <state>] [--format docx|pdf] [--since 7d] [--json]
atlcli wiki export jobs show <job-id> [--json]
atlcli wiki export jobs cancel <job-id>
atlcli wiki export jobs retry <failed-id> --output ./retry.docx
atlcli wiki export jobs rerun <succeeded-id> --output ./copy.pdf   # --force replaces a file. Get user approval first.
atlcli wiki export jobs clear --before 30d --confirm               # Get user approval first: deletes history.
```

## Troubleshooting

- If Jinja placeholders appear in the output, the template uses `{{ }}`. Convert them to `$scroll.*`.
- If the error `exceeds the maximum of N pages` appears, raise `--max-pages`. Alternatively, narrow the export with labels or `--max-depth`.

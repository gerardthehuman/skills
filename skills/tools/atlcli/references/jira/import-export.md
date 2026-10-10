---
source: https://atlcli.sh/jira/import-export/
---

# Import/Export

Import and export issues in CSV and JSON formats.

## Prerequisites

- Jira permission: Browse Projects (export), Create Issues (import)

## Export

Export writes issues to a local file. It does not modify Jira. The export includes comments and attachments by default.

```bash
atlcli jira export --jql "project = PROJ" -o issues.json
atlcli jira export --jql "project = PROJ" -o issues.csv --format csv
atlcli jira export --jql "sprint in openSprints()" -o sprint.json --no-attachments
```

| Flag                  | Description                          |
| --------------------- | ------------------------------------ |
| `--jql <query>`       | JQL selecting issues (required)      |
| `-o, --output <file>` | Output file path (required)          |
| `--format <format>`   | `json` (default) or `csv`            |
| `--no-comments`       | Exclude comments                     |
| `--no-attachments`    | Exclude attachments                  |
| `--json`              | JSON output for status (global flag) |

## Import

Import creates new issues only. It does not update existing issues. The import skips issues with existing keys.
The required fields are `summary` and `issuetype`. The import also adds comments and attachments when the file contains them.

### Dry Run First (Required)

You must run a dry run before a real import. The dry run previews the issues to create. It creates nothing.

```bash
atlcli jira import --file issues.csv --project PROJ --dry-run
atlcli jira import --file issues.json --project PROJ --dry-run
```

Review the preview for field mapping, skipped keys, and required-field errors before you continue.

### Real Import

A real import creates issues in Jira. Get user approval first. Run it only after explicit approval of the file, project, and dry-run output.

```bash
atlcli jira import --file issues.csv --project PROJ    # Get user approval first.
atlcli jira import --file issues.json --project PROJ --skip-attachments    # Get user approval first.
```

| Flag                 | Description                                 |
| -------------------- | ------------------------------------------- |
| `--file <path>`      | Import file, CSV or JSON (required)         |
| `--project <key>`    | Target project key (required)               |
| `--dry-run`          | Preview without creating issues. Run first. |
| `--skip-attachments` | Skip attachment uploads                     |
| `--json`             | JSON output (global flag)                   |

## CSV Format

The CSV file supports these columns:

- `summary`: the issue title. This column is required.
- `issuetype` (help) or `type` (docs): the issue type. The help text lists `issuetype` as required. The docs list `type` as optional. Check the header name with `--dry-run` before a real import.
- `description`: the issue description.
- `priority`: the priority name.
- `labels`: semicolon-separated values.
- `components`: semicolon-separated values.

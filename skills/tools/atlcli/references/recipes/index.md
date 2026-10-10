---
source: https://atlcli.sh/recipes/
---

# Recipes

This page lists real-world atlcli workflows. Each linked file contains the steps and exact commands for one workflow.

## Prerequisites

- You need Jira or Confluence permissions, or both, for the operations you use.
- Export jobs skip profiles. They set `ATLCLI_BASE_URL`, `ATLCLI_EMAIL`, and `ATLCLI_API_TOKEN`. Docs push and pull jobs need a profile: run `atlcli auth login` in the job first. For a Data Center PAT, add `ATLCLI_AUTH_TYPE=bearer` to export jobs. That auth type takes no email.

## Workflows

- [Team Docs Sync](team-docs.md): syncs a Git-tracked Markdown tree with Confluence.
- [Sprint Reporting](sprint-reporting.md): produces a sprint summary, velocity, and carry-over.
- [CI/CD Docs](ci-cd-docs.md): publishes docs to Confluence from GitHub Actions, GitLab CI, or Jenkins.
- [Export Automation](export-automation.md): exports a page tree to PDF in CI and gates on the JSON report.
- [Issue Triage](issue-triage.md): triages unassigned issues and bulk-updates labels, priority, and assignee.
- Confluence as a filesystem for coding agents is not a recipe here. See `../confluence/virtual-filesystem.md`.

## Common Patterns

### Daily Standup Prep

```bash
#!/bin/bash
# standup.sh - Yesterday's done work, in-progress work, time logged

echo "=== Yesterday ==="
atlcli jira export --jql "assignee = currentUser() AND updated > -1d AND status = Done" \
  --format csv -o /tmp/yesterday.csv --no-attachments --no-comments
cat /tmp/yesterday.csv

echo "=== In Progress ==="
atlcli jira export --jql "assignee = currentUser() AND status = 'In Progress'" \
  --format csv -o /tmp/in-progress.csv --no-attachments --no-comments
cat /tmp/in-progress.csv

echo "=== Time Logged ==="
atlcli jira worklog report --since 1d
```

### Release Notes

```bash
#!/bin/bash
# release-notes.sh - List Done issues for a fix version

VERSION=$1
atlcli jira export --jql "fixVersion = '$VERSION' AND status = Done" \
  --format json -o "/tmp/release-$VERSION.json" --no-attachments --no-comments

jq -r '.issues[] | "- \(.fields.summary) (\(.key))"' "/tmp/release-$VERSION.json"
```

### Sprint Health Check

```bash
#!/bin/bash
# sprint-health.sh - Velocity and active sprints for a board

BOARD_ID=$1
atlcli jira analyze velocity --board "$BOARD_ID" --sprints 5
atlcli jira sprint list --board "$BOARD_ID" --state active
```

## Related Topics

- [Jira CLI reference](../jira/index.md)
- [Confluence CLI reference](../confluence/index.md)
- Online: https://atlcli.sh/jira/ and https://atlcli.sh/confluence/

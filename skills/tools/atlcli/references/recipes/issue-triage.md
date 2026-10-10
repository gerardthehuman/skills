---
source: https://atlcli.sh/recipes/issue-triage/
---

# Issue Triage

This recipe triages incoming issues. You review unassigned work, set priority, assign, label, and move issues to the next status.

## Prerequisites

- You need the Jira permissions Edit Issues and Assign Issues.

## Triage Script

This script is interactive. Every write action in the loop changes Jira. Get user approval first.

```bash
#!/bin/bash
# triage.sh - Usage: ./triage.sh <project>
PROJECT=$1

atlcli jira export --jql "project = $PROJECT AND assignee is EMPTY AND status = Open" \
  --format csv -o /tmp/triage.csv --no-attachments --no-comments
cat /tmp/triage.csv

read -r -p "Issue key (q to quit): " KEY
while [ "$KEY" != "q" ]; do
  atlcli jira issue get --key "$KEY"
  read -r -p "[a]ssign [p]riority [l]abel [t]ransition [s]kip: " ACTION
  case $ACTION in
    a)  # Get user approval first. Writes to Jira.
        read -r -p "Assignee account ID (or none): " V
        atlcli jira issue assign --key "$KEY" --assignee "$V" ;;
    p)  # Get user approval first. Writes to Jira.
        read -r -p "Priority (Highest, High, Medium, Low, Lowest): " V
        atlcli jira issue update --key "$KEY" --priority "$V" ;;
    l)  # Get user approval first. Writes to Jira.
        read -r -p "Labels to add (comma-separated): " V
        atlcli jira issue update --key "$KEY" --add-labels "$V" ;;
    t)  atlcli jira issue transitions --key "$KEY"
        # Get user approval first. Writes to Jira.
        read -r -p "Target status: " V
        atlcli jira issue transition --key "$KEY" --to "$V" ;;
  esac
  read -r -p "Next issue (q to quit): " KEY
done
```

## Bulk Triage

Bulk commands act on every issue that matches the JQL, up to `--limit` (default 1000). Always preview with `--dry-run`. Each real run writes to Jira. Get user approval first.

```bash
# Label by type
atlcli jira bulk label add bug --jql "project = PROJ AND type = Bug AND labels is EMPTY" --dry-run
# Get user approval first. Bulk write to Jira.
atlcli jira bulk label add bug --jql "project = PROJ AND type = Bug AND labels is EMPTY"

# Default priority
atlcli jira bulk edit --jql "project = PROJ AND priority is EMPTY" --set priority=Medium --dry-run
# Get user approval first. Bulk write to Jira.
atlcli jira bulk edit --jql "project = PROJ AND priority is EMPTY" --set priority=Medium

# Auto-assign by component
# Get user approval first. Bulk write to Jira.
atlcli jira bulk edit --jql "project = PROJ AND component = Backend AND assignee is EMPTY" \
  --set assignee=557058:alice-account-id
atlcli jira bulk edit --jql "project = PROJ AND component = Frontend AND assignee is EMPTY" \
  --set assignee=557058:bob-account-id
```

## Scheduled Triage

Get user approval first. Then enable this cron job. It writes to Jira through a bulk transition.

```bash
#!/bin/bash
# daily-triage.sh - Run by cron daily
JQL="project = PROJ AND status = Open AND updated < -30d"

atlcli jira bulk transition --jql "$JQL" --to "Needs Review" --dry-run

# Get user approval first. Bulk transition in Jira.
atlcli jira bulk transition --jql "$JQL" --to "Needs Review"

# Count high-priority unassigned issues (CSV rows minus header)
atlcli jira export \
  --jql "project = PROJ AND priority in (Highest, High) AND assignee is EMPTY" \
  --format csv -o /tmp/high.csv --no-attachments --no-comments
COUNT=$(( $(wc -l < /tmp/high.csv) - 1 ))

if [ "$COUNT" -gt 0 ]; then
  echo "$COUNT high-priority issues need assignment" | \
    mail -s "Jira Triage Alert" team@company.com
fi
```

## Tips

- Keep JQL narrow so bulk runs stay within `--limit`.
- Review triage metrics periodically: `atlcli jira analyze predictability --board <id>`.

## Related Topics

- [Jira reference](../jira/index.md): covers issue, bulk, and filter operations.

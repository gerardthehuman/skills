---
source: https://atlcli.sh/recipes/sprint-reporting/
---

# Sprint Reporting

This recipe generates sprint reports for completed work, velocity, carry-over, and time logged. All commands below are read-only.

## Prerequisites

- You need the Jira permission Browse Projects.
- You need a board with sprint history.

## Sprint Summary Script

```bash
#!/bin/bash
# sprint-report.sh - Usage: ./sprint-report.sh <board-id> <sprint-id>
BOARD_ID=$1
SPRINT_ID=$2

echo "# Sprint Report"
echo "## Sprint Info"
atlcli jira sprint get --id "$SPRINT_ID"

echo "## Completed"
# jq paths assume --json output of jira sprint issues; confirm on a real run
atlcli jira sprint issues --id "$SPRINT_ID" --jql "status = Done" --json | \
  jq -r '.issues[] | "- [\(.key)] \(.fields.summary)"'

echo "## Carry-over"
atlcli jira sprint issues --id "$SPRINT_ID" --jql "status != Done" --json | \
  jq -r '.issues[] | "- [\(.key)] \(.fields.summary) (\(.fields.status.name))"'

echo "## Metrics"
atlcli jira sprint report "$SPRINT_ID"

echo "## Velocity"
atlcli jira analyze velocity --board "$BOARD_ID" --sprints 1
```

## Detailed Report

````bash
#!/bin/bash
# detailed-report.sh - Usage: ./detailed-report.sh <board-id> <sprint-id>
BOARD_ID=$1
SPRINT_ID=$2
OUTPUT="sprint-report-$(date +%Y%m%d).md"

{
  echo "# Sprint Report - $(date +%Y-%m-%d)"
  echo '## Velocity (last 5 sprints)'
  echo '```'; atlcli jira analyze velocity --board "$BOARD_ID" --sprints 5; echo '```'
  echo '## Burndown'
  echo '```'; atlcli jira analyze burndown --sprint "$SPRINT_ID"; echo '```'
  echo '## Scope Stability'
  echo '```'; atlcli jira analyze scope-change --sprint "$SPRINT_ID"; echo '```'
  echo '## Predictability'
  echo '```'; atlcli jira analyze predictability --board "$BOARD_ID" --sprints 5; echo '```'
  echo '## Time Logged'
  echo '```'; atlcli jira worklog report --since 14d --group-by issue; echo '```'
} > "$OUTPUT"

echo "Report written to $OUTPUT"
````

## Scheduled Reports

### Cron

```bash
# Every Friday at 17:00. Escape % in crontab.
0 17 * * 5 /path/to/sprint-report.sh 123 456 > /var/reports/sprint-$(date +\%Y\%m\%d).md
```

### GitHub Actions

```yaml
name: Sprint Report
on:
  schedule:
    - cron: "0 17 * * 5"

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install atlcli
        run: curl -fsSL https://atlcli.sh/install.sh | bash
      - name: Generate report
        env:
          ATLCLI_BASE_URL: ${{ secrets.ATLASSIAN_URL }}
          ATLCLI_EMAIL: ${{ secrets.ATLASSIAN_EMAIL }}
          ATLCLI_API_TOKEN: ${{ secrets.ATLASSIAN_TOKEN }}
        run: ./scripts/sprint-report.sh "$BOARD_ID" "$SPRINT_ID" > report.md
      - uses: actions/upload-artifact@v4
        with:
          name: sprint-report
          path: report.md
```

`BOARD_ID` and `SPRINT_ID` are repository variables or workflow inputs. If the installer did not add `~/.atlcli/bin` to `PATH`, add it.

## Related Topics

- [Jira reference](../jira/index.md), [CI/CD Docs](ci-cd-docs.md).

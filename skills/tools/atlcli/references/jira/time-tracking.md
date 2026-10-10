---
source: https://atlcli.sh/jira/time-tracking/
---

# Time Tracking

Log work on issues by direct entry or timer.

## Prerequisites

- Jira permission: Work on Issues

## Timer Mode

```bash
atlcli jira worklog timer start PROJ-123
atlcli jira worklog timer start PROJ-123 --comment "Starting code review"
atlcli jira worklog timer status
atlcli jira worklog timer stop
atlcli jira worklog timer stop --round 15m
atlcli jira worklog timer cancel
```

- `timer start <issue> [--comment <text>]`
- `timer stop [--round <interval>]`: logs the worklog and clears the timer.
- `timer status`: show the running timer.
- `timer cancel`: discard without logging.

The `timer start` command records the active profile. The `timer stop` command logs under that profile. To override the profile, pass the global option:

```bash
atlcli jira worklog timer stop --profile work
```

The timer state is stored at `~/.atlcli/timer.json`.

## Direct Entry

```bash
atlcli jira worklog add PROJ-123 2h
atlcli jira worklog add PROJ-123 30m --comment "Bug investigation"
atlcli jira worklog add PROJ-123 1h --started "2026-01-14T09:00:00"
atlcli jira worklog add PROJ-123 2h --round 15m
```

- `add <issue> <time>`: time is positional.
- `--comment <text>`
- `--started <date>`: defaults to now.
- `--round <interval>`

## Time Formats

- Durations: `2h`, `1.5h`, `30m`, `1h30m`, `1h 30m`, `1:30`, `1d` (8h), `1w` (5d), `"1 hour 30 minutes"`.
- `--started` values: `today`, `yesterday`, `09:00`, `2026-01-14`, `2026-01-14T09:00:00`.

## Rounding

```bash
atlcli jira worklog add PROJ-123 37m --round 15m   # logs 45m
atlcli jira worklog timer stop --round 15m
```

Intervals: `5m`, `15m`, `30m`, `1h`. Midpoints round up.

## List Worklogs

```bash
atlcli jira worklog list --issue PROJ-123
atlcli jira worklog list --issue PROJ-123 --limit 20
```

## Update Worklog

```bash
atlcli jira worklog update --issue PROJ-123 --id 10001 --time 3h
atlcli jira worklog update --issue PROJ-123 --id 10001 --comment "Updated description"
```

- `--issue <key>` and `--id <worklogId>` are required.
- Optional: `--time`, `--comment`, `--started`.

## Delete Worklog

Get user approval first.

```bash
atlcli jira worklog delete --issue PROJ-123 --id 10001 --confirm
```

The `delete` command requires `--confirm`.

## Time Report

```bash
atlcli jira worklog report
atlcli jira worklog report --since 7d --json
atlcli jira worklog report --since 2026-01-01 --until 2026-01-14
atlcli jira worklog report --user john@example.com
atlcli jira worklog report --group-by issue
```

- `--user <user>`: email or `me` (default `me`).
- `--since <date>`: default 30 days ago.
- `--until <date>`: default today.
- `--group-by <issue|date>`
- Date values: relative (`7d`, `1w`, `1m`), absolute (`2026-01-01`), `today`, `yesterday`.

## Best Practices

- Use timer mode for accuracy.
- Add a comment to every worklog.
- Round with the same interval across the team.
- Log daily.

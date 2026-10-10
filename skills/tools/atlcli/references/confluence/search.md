---
source: https://atlcli.sh/confluence/search/
---

# Search

Search Confluence content with text queries, filters, or raw CQL.

## Prerequisites

- You need View permission on the target spaces.

## Quick Start

These commands run a basic search.

```bash
atlcli wiki search "API documentation"
atlcli wiki search "API" --space TEAM
atlcli wiki search --label api
```

## Search Filters

The filters below narrow the search. A text query is optional when a filter is given.

```bash
atlcli wiki search "query" --space TEAM,DOCS,API      # comma-separated keys
atlcli wiki search "query" --type page                # page | blogpost | comment | all
atlcli wiki search --label "api,v2"                   # comma-separated labels (AND)
atlcli wiki search --title "installation guide"       # title contains text
atlcli wiki search --creator me                       # email or "me"
atlcli wiki search "query" --ancestor 12345           # pages under a parent
atlcli wiki search --modified-since 7d
atlcli wiki search --created-since 2024-01-15
```

Accepted date values are `7d`, `30d`, `1w`, `2w`, `1m`, `today`, `yesterday`, `thisWeek`, `thisMonth`, and `YYYY-MM-DD`.

## Raw CQL

Raw CQL ignores all other filters.

```bash
atlcli wiki search --cql "space = TEAM AND label = api AND lastModified > now('-7d')"
atlcli wiki search --cql "space IN (TEAM, DOCS) AND title ~ \"API*\""
```

- Supported fields are `text`, `title`, `space`, `type`, `label`, `creator`, `created`, `lastModified`, and `ancestor`.
- Supported operators are `=`, `!=`, `~`, `!~`, `>`, `<`, `>=`, `<=`, `IN`, `NOT IN`, `AND`, and `OR`.
- Supported functions are `currentUser()`, `now()`, `startOfDay()`, `startOfWeek()`, and `startOfMonth()`.

## Output and Pagination

These flags control the output and pagination. `--limit <n>` sets the maximum number of results (default: 25). `--start <n>` sets the offset. `--format table|compact` selects the output format. `--verbose` prints the CQL used.

```bash
atlcli wiki search "API" --space TEAM --format compact
atlcli wiki search "API" --space TEAM --verbose
atlcli wiki search "API" --limit 25 --start 25
atlcli wiki search --label api --json | jq -r '.results[].id'
```

This loop reads all results in pages of 100:

```bash
START=0
while true; do
  COUNT=$(atlcli wiki search "query" --limit 100 --start $START --json | jq '.results | length')
  [ "$COUNT" -eq 0 ] && break
  START=$((START + 100))
done
```

## Recent and My Pages

`atlcli wiki recent` lists recently modified pages. `atlcli wiki my` lists pages you created or contributed to. The flags for these commands are not checked here. Check the live docs before use.

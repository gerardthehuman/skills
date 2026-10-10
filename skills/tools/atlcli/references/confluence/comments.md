---
source: https://atlcli.sh/confluence/comments/
---

# Comments

Use these commands to list, add, reply to, resolve, and delete footer and inline comments on Confluence pages.

## Prerequisites

- You need View space permission to list comments. You need Edit space permission to add, reply, resolve, or delete comments.

## Footer Comments

### List Comments

```bash
atlcli wiki page comments list --id 12345
atlcli wiki page comments list --id 12345 --json
```

The `--id <id>` flag is required.

### Add Comment

```bash
atlcli wiki page comments add --id 12345 "Great documentation!"
atlcli wiki page comments add --id 12345 --file ./comment.txt
```

Use `--id <id>` with the comment text as a positional argument or with `--file <path>`.

### Reply to Comment

```bash
atlcli wiki page comments reply --id 12345 --parent 67890 "Thanks for the feedback!"
atlcli wiki page comments reply --id 12345 --parent 67890 --file ./reply.txt
```

Use `--id <id>` and `--parent <commentId>` (required) with the reply text as a positional argument or with `--file <path>`.

## Inline Comments

### Add Inline Comment

The `--selection` value must match text in the page content.

```bash
atlcli wiki page comments add-inline --id 12345 --selection "text to match" "Consider rewording this"
atlcli wiki page comments add-inline --id 12345 --selection "text to match" --file ./comment.txt
```

Use `--id <id>` and `--selection <text>` (required) with the comment text as a positional argument or with `--file <path>`.

## Resolve and Reopen

```bash
atlcli wiki page comments resolve --comment 67890
atlcli wiki page comments reopen --comment 67890
```

The `--comment <id>` flag is required.

## Delete Comment

The `delete` command is destructive. Get user approval first.

```bash
atlcli wiki page comments delete --comment 67890
```

The `--comment <id>` flag is required.

## Sync Behavior

By default, atlcli does not sync comments. To export comments with the pages, run:

```bash
atlcli wiki docs pull ./docs --comments
```

## JSON Output

```bash
atlcli wiki page comments list --id 12345 --json
atlcli wiki page comments list --id 12345 --json | jq '.comments[] | select(.resolved == false)'
```

The output includes `schemaVersion`, `comments[]` (`id`, `type`, `body`, `author`, `created`, `resolved`, `replies`), and `total`.

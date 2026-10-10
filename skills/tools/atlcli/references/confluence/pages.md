---
source: https://atlcli.sh/confluence/pages/
---

# Pages

Create, read, update, delete, move, copy, and organize Confluence pages.

## Prerequisites

- You need View permission on the space to read pages. You need Edit permission to write pages.

## List and Get

The `page list` command finds pages. The `page get` command reads one page by its ID.

```bash
atlcli wiki page list --space TEAM --label api --limit 50
atlcli wiki page list --cql "space = TEAM AND type = page" --limit 25
atlcli wiki page get --id 12345
```

The list and get commands accept these flags: `--space <key>`, `--cql <query>`, `--label <label>`, `--limit <n>`, and `--id <id>`.

## Create

The `page create` command creates a page from a markdown file.

```bash
atlcli wiki page create --space TEAM --title "API Guide" --body ./api-guide.md
```

All three flags are required: `--space <key>`, `--title <title>`, and `--body <file>` (markdown).

## Update

The `page update` command overwrites the page content. Get user approval first.

```bash
atlcli wiki page update --id 12345 --body ./guide.md --title "New Title"
```

The update command takes these flags: `--id <id>`, `--body <file>` (required), and `--title <title>`.

## Delete

The `page delete` command deletes one page. This command is destructive. Get user approval first.

```bash
atlcli wiki page delete --id 12345 --confirm
```

### Bulk Delete

This bulk command is destructive. Get user approval first. Preview with `--dry-run` before you use `--confirm`.

```bash
atlcli wiki page delete --cql "label=to-delete" --dry-run
atlcli wiki page delete --cql "label=to-delete" --confirm
```

## Archive

The `page archive` command archives one page by `--id` or a set of pages by `--cql`. Get user approval first. A bulk archive with `--cql` also needs approval of the matched set.

```bash
atlcli wiki page archive --id 12345 --confirm
atlcli wiki page archive --cql "lastModified < now('-1y')" --dry-run
atlcli wiki page archive --cql "lastModified < now('-1y')" --confirm
```

## Copy and Children

The `page copy` command copies a page. The `page children` command lists child pages.

```bash
atlcli wiki page copy --id 12345 --title "API Docs" --space DOCS --parent 67890
atlcli wiki page children --id 12345 --limit 10 --json
```

The copy command takes these flags: `--id <id>`, `--title <t>`, `--space <key>` (default: same space), and `--parent <p>`.

## Move

The `page move` command moves a page under a parent or sets its position among siblings.

```bash
atlcli wiki page move --id 12345 --parent 67890
atlcli wiki page move ./docs/page.md --before ./docs/intro.md
atlcli wiki page move ./docs/page.md --after ./docs/setup.md
atlcli wiki page move ./docs/appendix.md --first
atlcli wiki page move ./docs/appendix.md --last
atlcli wiki page move ./docs/appendix.md --position 3
```

The `--id` form takes only `--parent`. The position flags take a file path. `--position` is 1-based.

## Sort Children

The `page sort` command orders child pages. It takes a file path, not `--id`.

```bash
atlcli wiki page sort ./docs/api.md --alphabetical
atlcli wiki page sort ./docs/chapters.md --natural
atlcli wiki page sort ./docs/changelog.md --by modified --reverse
```

The sort command accepts these flags: `--alphabetical`, `--natural`, `--by <created|modified>`, `--reverse`, and `--dry-run`.

## Jira Links

The `page link-issue`, `page issues`, and `page unlink-issue` commands manage links to Jira issues.

```bash
atlcli wiki page link-issue --id 12345 --issue PROJ-123 --comment
atlcli wiki page issues --id 12345 --project PROJ
atlcli wiki page unlink-issue --id 12345 --issue PROJ-123
```

`--comment` also comments on the Jira issue. `unlink-issue` removes the link. Get user approval first.

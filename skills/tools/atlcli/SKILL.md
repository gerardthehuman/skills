---
name: atlcli
description: "atlcli, the Jira/Confluence CLI. Use for atlcli install, login, auth profiles, Jira issues and worklogs, Confluence pages and markdown sync, or agent file access to Confluence."
---

# atlcli

Community Jira and Confluence CLI by Björn Schotte (BjoernSchotte/atlcli).

> This is not Atlassian's first-party CLI, which is `acli`.

References mirror the [official docs](https://atlcli.sh). If a reference does not cover a topic, fetch the page in its `source` frontmatter field.

## Start Here

1. `atlcli --version`. Not found → [getting-started](references/getting-started.md).
2. `atlcli auth status`. No profile or not authenticated → [authentication](references/authentication.md).
3. Find the topic below and read only that reference.

## Contents

- **Setup**
  - [Getting started](references/getting-started.md)
  - [Authentication](references/authentication.md)
  - [Environment variables](references/environment.md)
  - [Configuration](references/configuration.md)
  - [Troubleshooting](references/troubleshooting.md)
- **Jira**
  - [Overview](references/jira/index.md)
  - [Issues](references/jira/issues.md)
  - [Search and JQL](references/jira/search.md)
  - [Projects](references/jira/projects.md)
  - [Boards and sprints](references/jira/boards-sprints.md)
  - [Epics](references/jira/epics.md)
  - [Subtasks](references/jira/subtasks.md)
  - [Time tracking](references/jira/time-tracking.md)
  - [Attachments](references/jira/attachments.md)
  - [Filters](references/jira/filters.md)
  - [Fields](references/jira/fields.md)
  - [Templates](references/jira/templates.md)
  - [Bulk operations](references/jira/bulk-operations.md) (approval required)
  - [Import and export](references/jira/import-export.md) (approval required)
- **Confluence**
  - [Overview](references/confluence/index.md)
  - [Pages](references/confluence/pages.md)
  - [Spaces](references/confluence/spaces.md)
  - [Search (CQL)](references/confluence/search.md)
  - [Labels](references/confluence/labels.md)
  - [Comments](references/confluence/comments.md)
  - [Page history](references/confluence/history.md)
  - [Markdown sync](references/confluence/sync.md)
  - [Sync attachments](references/confluence/attachments.md)
  - [Sync file format](references/confluence/file-format.md)
  - [Sync validation](references/confluence/validation.md)
  - [Folders](references/confluence/folders.md)
  - [Virtual filesystem](references/confluence/virtual-filesystem.md) (`wiki sh`, `wiki mount`, `wiki vfs`)
  - [Templates](references/confluence/templates.md)
  - [Export to DOCX or PDF](references/confluence/export.md)
  - [Import DOCX or PDF](references/confluence/import.md) (approval required)
- **Cross-product**
  - [Workflow recipes](references/recipes/index.md): team docs, CI, triage, sprints, export
  - [Research](references/research.md): chat and multi-step questions across Jira and Confluence

## Rules for Every Command

- Every command needs an authenticated profile (`atlcli auth login`) or CI env vars. Each reference lists only the extra permissions that command needs.
- Add `--json` when you parse output. It is a global option.
- Find flags with `atlcli <group> <subcommand> --help`. Do not run `--help` on `auth login`, `auth init`, `auth logout`, `jira search`, `jira my`, or `jira issue create`. These commands act instead of printing help. Use the references instead.
- Do not trust `--help` alone for behaviour. Confirm with the reference and the docs.
- Destructive commands must include `--confirm`. Before you run one, confirm the exact target with the user.
- Get user approval first. This applies to bulk or overwrite operations: `--cql` bulk actions, `jira bulk`, `wiki docs pull --force`, `wiki docs resolve --accept local|remote`, `wiki docs sync --on-conflict local|remote`, `wiki import --confirm`.
- Add `--mode rw` to VFS writes only when the user asked for writes.
- Keep tokens out of chat, logs, and shell history. Use environment variables.

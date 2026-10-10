---
source: https://atlcli.sh/recipes/team-docs/
---

# Team Docs Sync

This recipe keeps team documentation in sync between local Markdown files and Confluence. You write docs locally, version them in Git, and publish them to Confluence for stakeholders.

## Prerequisites

- You need the Confluence permissions View Space to pull and Edit Pages to push.
- Git must be installed.

## Setup

```bash
# Scope is required: one of --space, --ancestor, --page-id
atlcli wiki docs init ./team-docs --space TEAM
atlcli wiki docs pull ./team-docs

cd team-docs
git init
git add .
git commit -m "Initial docs sync"
```

## Daily Workflow

```bash
atlcli wiki docs pull ./team-docs
git status

# Edit locally, then validate links and markup (read-only)
atlcli wiki docs check ./team-docs --strict

# Get user approval first. Writes to Confluence.
atlcli wiki docs push ./team-docs --validate

git add .
git commit -m "Update API documentation"
```

Inspect the changes before you push. These commands are read-only:

```bash
atlcli wiki docs diff ./team-docs/page.md
atlcli wiki docs status ./team-docs
```

## Conflict Resolution

When local and Confluence both changed, `pull` warns about conflicts.

```bash
atlcli wiki docs pull ./team-docs
git diff
atlcli wiki docs status ./team-docs

# Get user approval first. Writes the resolution for one file.
atlcli wiki docs resolve ./team-docs/page.md --accept local    # or: remote | merged
```

The following command overwrites the whole tree. It is destructive. Get user approval first.

```bash
# Get user approval first. Overwrites local modifications, including attachments.
atlcli wiki docs pull ./team-docs --force
```

## Automation

### Pre-Commit Hook (Read-Only)

```bash
#!/bin/bash
# .git/hooks/pre-commit
atlcli wiki docs check ./team-docs --strict || {
  echo "Docs check failed. Fix broken links or warnings." >&2
  exit 1
}
```

### Continuous Sync

Preview first with a dry run. The `--dry-run` flag writes nothing, deletes nothing, and does not create `.atlcli/`.

```bash
atlcli wiki docs sync ./team-docs --space TEAM --dry-run
```

Start the daemon. Get user approval first. The daemon writes to Confluence and local files.

```bash
# Get user approval first. Bidirectional sync; writes to Confluence.
atlcli wiki docs sync ./team-docs --space TEAM --poll-interval 30000
```

## Tips

- Add `.atlcliignore` (gitignore syntax) to exclude files from push and status.
- Keep images in `./team-docs/images/`.

## Related Topics

- [Confluence reference](../confluence/index.md): covers sync and file format.
- [CI/CD Docs](ci-cd-docs.md): covers automated publishing.

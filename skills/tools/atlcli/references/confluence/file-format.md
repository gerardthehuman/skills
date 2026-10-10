---
source: https://atlcli.sh/confluence/file-format/
---

# File Format

This page describes the structure of local Confluence files. Each page file has YAML frontmatter under the `atlcli` namespace.

## Page Frontmatter

```markdown
---
atlcli:
  id: "12345"
  title: "Page Title"
---

# Page Title

Content here...
```

| Field          | Required | Notes                                                    |
| -------------- | -------- | -------------------------------------------------------- |
| `id`           | Yes      | Page ID. atlcli sets it automatically on pull or create. |
| `title`        | Yes      | Page title. It defaults to the first H1 when omitted.    |
| `type`         | No       | `page` (default) or `folder`                             |
| `version`      | No       | Version number of the page                               |
| `lastModified` | No       | Timestamp of the last modification                       |
| `labels`       | No       | YAML list of labels                                      |

## Folder Frontmatter

An `index.md` file with `type: folder` contains frontmatter only. It has no body.

```markdown
---
atlcli:
  id: "123456789"
  title: "My Folder"
  type: "folder"
---
```

The folder's children are sibling files and subdirectories. See [folders](folders.md).

## Directory Structure

```
docs/
├── .atlcli/             # sync state; do not edit
├── index.md             # space home page
├── getting-started.md   # top-level page
├── guides/              # Confluence folder
│   ├── index.md         # folder metadata (type: folder)
│   ├── installation.md
│   └── configuration.md
└── api/                 # nested folder
    ├── index.md
    └── endpoints.md
```

| Confluence         | Local                                   |
| ------------------ | --------------------------------------- |
| Page               | `page-name.md`                          |
| Page with children | `page-name.md` + `page-name/` directory |
| Folder             | `folder-name/index.md` (`type: folder`) |
| Page in folder     | `folder-name/page-name.md`              |

## Naming

- Use lowercase with hyphens, for example `api-reference.md`.
- Folder metadata must be named `index.md`, not the page name.
- File names derive from sanitized page titles.
- The frontmatter `title` sets the page title. The file name does not.

## Examples

This example shows a minimal new page. Create the file, then push it:

```markdown
---
atlcli:
  title: "Getting Started"
---

# Getting Started

Welcome to our documentation.
```

```bash
atlcli wiki docs push ./docs/getting-started.md
```

After the push, atlcli adds `id` to the frontmatter automatically.

This example shows a synced page with full metadata:

```markdown
---
atlcli:
  id: "123456789"
  title: "API Authentication"
  version: 12
  lastModified: "2025-01-14T10:30:00Z"
  labels:
    - api
    - security
---

# API Authentication

This guide covers authentication methods...
```

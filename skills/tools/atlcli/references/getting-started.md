---
source: https://atlcli.sh/getting-started/
---

# Getting Started

## Installation

```bash
# Quick install (macOS/Linux). Installs to ~/.atlcli/bin and updates PATH.
curl -fsSL https://atlcli.sh/install.sh | bash

# Specific version
curl -fsSL https://atlcli.sh/install.sh | bash -s v0.16.0

# Homebrew
brew install bjoernschotte/tap/atlcli
brew update && brew upgrade atlcli   # upgrade
```

For a manual download, open https://github.com/BjoernSchotte/atlcli/releases and download the `atlcli-<os>-<arch>.tar.gz` file. On Windows, download `atlcli-windows-x64.zip`. Put `atlcli` on `PATH`.

To build from source, use Bun v1.0 or later. Run `git clone https://github.com/BjoernSchotte/atlcli.git && cd atlcli && bun install && bun run build`. The binary is `./apps/cli/dist/atlcli`.

Check the installation with these commands:

```bash
atlcli version
atlcli doctor            # config, profile credentials, Jira/Confluence reachability, log dir
atlcli doctor --fix      # auto-fix safe issues (e.g. create directories)
atlcli doctor --json
```

## Shell Completion

Add the completion command to your shell startup file:

```bash
# ~/.zshrc
eval "$(atlcli completion zsh)"

# ~/.bashrc
eval "$(atlcli completion bash)"
```

Run `source ~/.zshrc` (or `~/.bashrc`), or open a new shell.

## Authentication

The auth method depends on the deployment type.

- Cloud (`*.atlassian.net`): use an email address and an API token. Create the token at https://id.atlassian.com/manage-profile/security/api-tokens.
- Server/Data Center: use a Personal Access Token with `--bearer`. `--site` is the exact Confluence base URL, including any context path.

Pass tokens from environment variables. Never type literal token values.

```bash
# Cloud
atlcli auth login --site https://company.atlassian.net --email you@company.com --token "$ATLASSIAN_TOKEN"

# Server / Data Center
atlcli auth login --bearer --site https://jira.company.com --token "$ATLASSIAN_PAT"

atlcli auth status
```

Profiles are stored in `~/.atlcli/config.json`. For full flags, profiles, TLS, and Keychain details, see `authentication.md`.

## Confluence Quick Start

```bash
atlcli wiki docs init ./team-docs --space TEAM   # link local dir to space
atlcli wiki docs pull ./team-docs                # download pages as markdown
atlcli wiki docs push ./team-docs                # push only modified pages
```

Pages are markdown files with YAML frontmatter (`id`, `title`, `space`). The directory layout matches the Confluence hierarchy.

```bash
# Overwrites local modifications, including attachments. Get user approval first.
atlcli wiki docs pull ./team-docs --force
```

## Jira Quick Start

```bash
atlcli jira my                                # your open issues
atlcli jira issue get --key PROJ-123

# Writes to Jira. Get user approval first.
atlcli jira issue create --project PROJ --type Task --summary "Fix login bug"

# Time tracking
atlcli jira worklog timer start PROJ-123
atlcli jira worklog timer status
atlcli jira worklog timer stop --round 15m
atlcli jira worklog add PROJ-123 2h --comment "Code review"
```

## JSON Output

Use the global `--json` option for scripting:

```bash
atlcli jira my --json
```

`wiki docs watch` and `wiki docs sync` emit JSON lines with `--json`.

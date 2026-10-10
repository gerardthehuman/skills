---
source: https://atlcli.sh/configuration/
---

# Configuration

## Precedence

Later entries override earlier ones:

1. Built-in defaults
2. Global config `~/.atlcli/config.json`
3. Project config `.atlcli.json` (Confluence sync directory)
4. Environment variables
5. Command-line flags

`atlcli config` keys resolve as: CLI flag > profile config > global config.

## Global Config File

The global config file is `~/.atlcli/config.json`:

```json
{
  "defaultProfile": "work",
  "logging": { "level": "info", "file": "~/.atlcli/atlcli.log" },
  "plugins": { "enabled": ["git"], "path": "~/.atlcli/plugins" }
}
```

Use `atlcli config` for the keys below. Edit the JSON only for keys that `config set` does not cover, for example `logging.file`.

## Config Commands

The following commands list, read, set, and unset keys.

```bash
atlcli config list
atlcli config get logging.level
atlcli config set global.project PROJ
atlcli config set global.space DOCS
atlcli config set global.board 123
atlcli config set profiles.work.project WORKPROJ
atlcli config set profiles.work.space TEAM
atlcli config unset global.space
```

| Key                                             | Meaning                                           |
| ----------------------------------------------- | ------------------------------------------------- |
| `global.project`                                | Default Jira project key                          |
| `global.space`                                  | Default Confluence space key                      |
| `global.board`                                  | Default Jira board ID                             |
| `profiles.<name>.project` / `.space` / `.board` | Per-profile defaults                              |
| `logging.level`                                 | `off`, `error`, `warn`, `info`, `debug`           |
| `logging.global` / `logging.project`            | `true` or `false`. Enables global or project logs |

Logging levels, `--no-log`, and log commands are in [troubleshooting.md](troubleshooting.md#debug-mode).

## Profiles

Use these commands to list, check, and switch profiles.

```bash
atlcli auth list
atlcli auth status
atlcli auth switch work
atlcli --profile work jira issue get --key PROJ-123   # one command
```

`--profile` selects the profile for one command. Flags take precedence over every environment variable.

## Environment Variables

Only these variables are read by the checked source. Flags override them.

| Variable                       | Read by                     | Purpose                                          |
| ------------------------------ | --------------------------- | ------------------------------------------------ |
| `ATLCLI_API_TOKEN`             | Login, `wiki export`        | API token or PAT. Highest token priority.        |
| `ATLCLI_SITE`                  | `auth login`, `auth init`   | Instance URL when `--site` is absent             |
| `ATLCLI_EMAIL`                 | `auth login`, `wiki export` | Account email for Cloud basic auth               |
| `ATLCLI_BASE_URL`              | `wiki export` (ephemeral)   | Confluence base URL for export without a profile |
| `ATLCLI_AUTH_TYPE`             | `wiki export` (ephemeral)   | `api-token` (default) or `bearer`                |
| `ATLCLI_RESEARCH_SESSIONS_DIR` | `research`                  | Overrides the research session directory         |

`ATLCLI_PROFILE`, `ATLCLI_LOG_LEVEL`, and `ATLCLI_CONFIG` are documented on the docs site. The checked source and binary do not read them.

Token resolution order, verified in source: `ATLCLI_API_TOKEN`, then macOS Keychain (if the profile has a `username`), then the profile's config file.

Never pass tokens on the command line. Export them from the shell or a CI secret store.

## Profile-Free Auth (CI)

Use a named `--profile` or a full ephemeral set. Never mix them.

```bash
export ATLCLI_API_TOKEN=...   # from CI secret store
atlcli wiki export 12345678 --output page.docx \
  --base-url https://acme.atlassian.net --email ci@acme.example --auth-type api-token
```

## Confluence Sync Config (`.atlcli.json`)

The `.atlcli.json` file is stored in the synced directory:

```json
{
  "space": "TEAM",
  "rootPageId": "12345",
  "ignorePaths": ["drafts/**", "*.tmp"],
  "syncOptions": { "deleteOrphans": false, "preserveLocalChanges": true }
}
```

- Push and status exclusions go in `.atlcliignore`, which uses gitignore syntax. atlcli also respects `.gitignore` patterns.

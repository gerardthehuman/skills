---
source: https://atlcli.sh/reference/environment/ (checked against the source repo and CLI v0.17.2-dev)
---

# Environment Variables

## Authentication

These variables supply credentials. Only some commands read them.

| Variable           | Read by                                         | Description                                      |
| ------------------ | ----------------------------------------------- | ------------------------------------------------ |
| `ATLCLI_API_TOKEN` | Login, `wiki export` (ephemeral), profile token | API token (Cloud) or PAT (Server/Data Center)    |
| `ATLCLI_SITE`      | `auth login` and `auth init` only               | Instance URL used when `--site` is absent        |
| `ATLCLI_EMAIL`     | `auth login` and `wiki export` (ephemeral)      | Account email for Cloud basic auth               |
| `ATLCLI_BASE_URL`  | `wiki export` (ephemeral) only                  | Confluence base URL for export without a profile |
| `ATLCLI_AUTH_TYPE` | `wiki export` (ephemeral) only                  | `api-token` (default) or `bearer`                |

Export the variables from the shell or a secret store. Reference token variables. Never write literal token values into committed files.

```bash
export ATLCLI_API_TOKEN="$ATLASSIAN_TOKEN"
```

## Other Variables

No other variables are read by the CLI in the checked source. The docs page lists `ATLCLI_PROFILE`, `ATLCLI_CONFIG`, and `ATLCLI_LOG_LEVEL`. The binary ignores all three, so do not rely on them.

## Using a Profile Without Variables

Pass the profile with a flag. `--profile` is the supported way to select a profile for one command:

```bash
atlcli --profile work jira my
```

## .env File

Keep `.env` out of Git. Load values from a secret store. Never write literal tokens in a committed file:

```bash
# .env
ATLCLI_SITE=https://company.atlassian.net
ATLCLI_EMAIL=you@company.com
ATLCLI_API_TOKEN=<token from secret store>
```

Load the `.env` file into the shell, then run:

```bash
set -a; source .env; set +a
atlcli jira my
```

## Precedence

Verified in source, for tokens only:

1. `ATLCLI_API_TOKEN` (highest)
2. macOS Keychain entry (if the profile has a `username`)
3. Profile config file token (lowest)

Flags override all environment values. `--profile` selects the profile. Other precedence orders on the docs site were not confirmed against the binary. Do not state them as fact.

## CI/CD

Map platform secrets to the `ATLCLI_*` variables. Env-only auth works for `wiki export` (ephemeral mode). Jira commands need a profile, so run `atlcli auth login` in the job or mount a config file.

GitHub Actions:

```yaml
env:
  ATLCLI_BASE_URL: ${{ secrets.ATLASSIAN_URL }}
  ATLCLI_EMAIL: ${{ secrets.ATLASSIAN_EMAIL }}
  ATLCLI_API_TOKEN: ${{ secrets.ATLASSIAN_TOKEN }}
```

GitLab CI:

```yaml
variables:
  ATLCLI_BASE_URL: $ATLASSIAN_URL
  ATLCLI_EMAIL: $ATLASSIAN_EMAIL
  ATLCLI_API_TOKEN: $ATLASSIAN_TOKEN
```

Docker forwards host values by name. It does not embed them:

```bash
docker run -e ATLCLI_BASE_URL -e ATLCLI_EMAIL -e ATLCLI_API_TOKEN atlcli wiki export ...
```

For Jenkins, bind each variable with `credentials('<id>')` in the `environment` block.

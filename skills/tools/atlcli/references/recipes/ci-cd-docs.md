---
source: https://atlcli.sh/recipes/ci-cd-docs/
---

# CI/CD Documentation

This recipe publishes documentation to Confluence from CI/CD. On release, it exports the published tree as a versioned PDF or Word artifact.

## Prerequisites

- You need an Atlassian API token stored as a CI/CD secret.
- atlcli must be installed on the runner.
- You need the Confluence permission Edit Pages to publish, and View to export.
- Each job needs these env vars: `ATLCLI_API_TOKEN` (secret), `ATLCLI_EMAIL` (Cloud), and the site URL for `auth login`. `wiki docs push` and `wiki docs pull` need a profile. Env-only auth works only for `wiki export`. Run `atlcli auth login` in the job before `push`. For Data Center PAT, add `--bearer` and omit `--email`.

## GitHub Actions

### Publish on Push to Main

```yaml
name: Publish Docs
on:
  push:
    branches: [main]
    paths: ["docs/**"]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install atlcli
        run: curl -fsSL https://atlcli.sh/install.sh | bash
      - name: Push to Confluence
        # Get user approval first. Writes to Confluence.
        env:
          ATLCLI_SITE: ${{ secrets.ATLASSIAN_URL }}
          ATLCLI_EMAIL: ${{ secrets.ATLASSIAN_EMAIL }}
          ATLCLI_API_TOKEN: ${{ secrets.ATLASSIAN_TOKEN }}
        run: |
          ~/.atlcli/bin/atlcli auth login --profile ci --site "$ATLCLI_SITE" --email "$ATLCLI_EMAIL" --token "$ATLCLI_API_TOKEN"
          ~/.atlcli/bin/atlcli --profile ci wiki docs push ./docs
```

### Publish on Release

Use the same job with `on: release: types: [published]`. Add a version step before the push:

```yaml
- name: Update version in docs
  run: sed -i "s/VERSION_PLACEHOLDER/${{ github.ref_name }}/g" docs/index.md
```

## GitLab CI

```yaml
publish-docs:
  stage: publish
  only: { refs: [main], changes: [docs/**] }
  variables:
    ATLCLI_SITE: $ATLASSIAN_URL
    ATLCLI_EMAIL: $ATLASSIAN_EMAIL
    # ATLCLI_API_TOKEN: protected, masked CI variable
  script:
    - curl -fsSL https://atlcli.sh/install.sh | bash
    # Get user approval first. Writes to Confluence.
    - ~/.atlcli/bin/atlcli auth login --profile ci --site "$ATLCLI_SITE" --email "$ATLCLI_EMAIL" --token "$ATLCLI_API_TOKEN"
    - ~/.atlcli/bin/atlcli --profile ci wiki docs push ./docs
```

## Jenkins

// ATLCLI_SITE, ATLCLI_EMAIL, ATLCLI_API_TOKEN from credentials()
stage('Publish Docs') {
when { changeset 'docs/**' }
steps {
// Get user approval first. Writes to Confluence.
sh '~/.atlcli/bin/atlcli auth login --profile ci --site "$ATLCLI_SITE" --email "$ATLCLI_EMAIL" --token "$ATLCLI_API_TOKEN" && ~/.atlcli/bin/atlcli --profile ci wiki docs push ./docs'
}
}

## Export the Published Docs as a Release Artifact

This step is read-only against Confluence. It writes a local file.

```yaml
- name: Export the handbook
  env:
    ATLCLI_BASE_URL: ${{ secrets.ATLASSIAN_URL }}
    ATLCLI_EMAIL: ${{ secrets.ATLASSIAN_EMAIL }}
    ATLCLI_API_TOKEN: ${{ secrets.ATLASSIAN_TOKEN }}
  run: |
    ~/.atlcli/bin/atlcli wiki export "$ROOT_PAGE_ID" \
      --format pdf --scope tree \
      --label-exclude internal,draft \
      --completeness strict \
      --out-dir dist --report json --strict | tee report.json
```

- `--scope tree` (or `--scope space --space KEY`): produces one document that follows the page hierarchy.
- `--label-exclude internal,draft`: drops labeled pages. To keep their children, add `--label-exclude-mode page-only`.
- `--label-include <a,b>`: publishes only labeled pages. The command fails when nothing matches.
- `--completeness strict`: an unreadable page aborts the export.
- `--report json`: prints one `atlcli.export-report/1` document on stdout.
- `--strict`: exits with `2` on warnings.
- For Word output, replace `--format pdf --out-dir dist` with `--output handbook.docx --template corporate`.

For report parsing and note-code gates, see [Export Automation](export-automation.md).

## Best Practices

- Filter paths so jobs run only when docs change.
- In pull-request jobs, run `atlcli wiki docs check ./docs --strict` (read-only).
- Pair `--completeness strict` with `--strict` so an incomplete handbook fails the build.

## Related Topics

- [Authentication](../authentication.md), [Team Docs](team-docs.md), [Confluence reference](../confluence/index.md).

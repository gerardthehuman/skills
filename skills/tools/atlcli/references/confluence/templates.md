---
source: https://atlcli.sh/confluence/templates/
---

# Templates

Reusable Markdown templates with `{{variable}}` substitution and Handlebars logic.

## Levels

- Three levels exist: global, profile, and space. Reads resolve in this order: space, profile, then global.
- `--level global|profile|space` targets one level exactly. `--profile <name>` and `--space <key>` select that level's coordinate.
- Naming two levels is a usage error (exit `1`). A named level never falls back to another level.

## List, Show, Validate

The `list` command finds templates. The `show` command prints one template. The `validate` command checks templates.

```bash
atlcli wiki template list --level global --tag meeting --search retro
atlcli wiki template list --all                 # include overridden templates
atlcli wiki template show meeting-notes
atlcli wiki template validate --all || exit 1   # CI gate
```

## Render

The `render` command fills a template with variable values.

```bash
atlcli wiki template render meeting-notes --var title="Sprint Planning" --var date=today
atlcli wiki template render meeting-notes --interactive   # prompt for missing variables
```

## Create and Edit

The `create` command saves a template from a file. The `edit` command opens a template in `$EDITOR`.

```bash
atlcli wiki template create meeting-notes --file ./template.md
atlcli wiki template create standup --profile work --file ./standup.md
atlcli wiki template edit meeting-notes --level global    # opens $EDITOR
```

Overwrite an existing template with `--force`. Get user approval first. Run `atlcli wiki template create meeting-notes --file ./updated.md --force`.

## Init, Copy, Rename, Delete

These commands create, copy, rename, and delete templates.

```bash
atlcli wiki template init meeting-template --from 12345
atlcli wiki template copy meeting-notes --from-level global --to-profile work
atlcli wiki template rename standup daily-standup --profile work
```

The `delete` command is destructive. Get user approval first. Run `atlcli wiki template delete standup --profile work --force`.

## Import, Export, Update

The `export` command saves a template to a file. The `import` command adds a pack of templates.

```bash
atlcli wiki template export meeting-notes -o out.md
atlcli wiki template import ./my-pack --to-profile work
```

- `import` skips existing templates by default. `--to-profile <name>` (or `--to-level global`) places all imported templates at one level.
- Overwrite existing templates with `--replace`. Get user approval first. Run `atlcli wiki template import ./my-pack --replace`.
- Re-import tracked sources with `atlcli wiki template update --source <url>`. Get user approval first.

## Template File Format

A template file starts with YAML frontmatter, followed by a Markdown body.

```markdown
---
name: meeting-notes
description: Template for team meetings
variables:
  - name: title
    type: string
    required: true
  - name: type
    type: select
    options: [standup, planning, retro]
    required: true
  - name: attendees
    type: string
    default: "TBD"
---

# {{title}}

**Type:** {{type}}
**Attendees:** {{attendees}}
```

The supported variable types are `string`, `number`, `date`, `boolean`, and `select`. A `select` variable must match one of its `options`.

## Built-Ins and Handlebars

- Built-in variables start with `@`: `@date`, `@datetime`, `@time`, `@year`, `@user`, `@space`, `@profile`, `@title`, `@parent.id`, and `@uuid`.
- Handlebars logic uses `{{#if x}}...{{else}}...{{/if}}`, `{{#unless x}}...{{/unless}}`, and `{{#each items}}{{this}}{{/each}}`.

## Troubleshooting

- If `{{variable}}` stays literal, check for a typo in the name, a `--var` that was not passed, or a built-in without `@`.
- If you see `Template 'x' not found at profile:work.`, the template exists at another level. Run `atlcli wiki template list --all`.

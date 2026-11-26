# Branches

Branch names must follow this format:

```text
<type>/<ticket>_<name>
```

- Use the [commit types](commits.md#commit-types) for `<type>`. Choose the type
  that describes the branch as a whole.
- `<ticket>` is the ticket identifier, following the applicable ticket conventions
  for its format and casing.
- Omit the optional `<ticket>_` prefix when no ticket exists.
- Use lowercase kebab-case for `<name>`, with at most three words.

Example: `feat/<ticket>_add-minor-feature`

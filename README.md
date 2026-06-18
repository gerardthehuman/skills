# Humanforce Skills

A collection of agent skills for development workflows of Humanforce projects.

## Installing a Skill

Install any skill from this repository using the [skills.sh](https://skills.sh/):

<!-- INSTALL:START -->
```bash
npx skills add gerardthehuman/skills 
pnpm dlx skills add gerardthehuman/skills 
bun x skills add gerardthehuman/skills 
```
<!-- INSTALL:END -->

Or, clone the repository and link a skill from your local copy:

```bash
npx skills add .
pnpm dlx skills add .
bun x skills add .
```

## Available Skills

<!-- SKILLS:START -->
### [pr-review](skills/pr-review/SKILL.md)

Review pull requests, branches, commits, or working-tree diffs through parallel lenses: correctness-and-security, code-quality, tests, comments, errors, and types. Use whenever the user asks for a PR review, code review, merge-readiness check, aggressive/deep/thermos review, test-gap analysis, silent-failure review, comment or doc review, type-design feedback, or code-quality feedback on changed code.
<!-- SKILLS:END -->

## Contributing

1. Create a new directory under `skills/` with your skill name
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`)
3. Run `bun run readme` to update the skills list above

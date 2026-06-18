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
### [pr-apply-changes](skills/pr-apply-changes/SKILL.md)

Apply changes from the current conversation, an implementation plan, review feedback, issue reports, or PR follow-up work, then integrate them into the right commits. Use when the user asks to apply requested changes, implement an agreed plan, fix issues found in review, address issue feedback, or fold follow-up fixes into a branch or PR.

### [pr-feedback-loop](skills/pr-feedback-loop/SKILL.md)

Drive a GitHub pull request through an AI review feedback loop: resolve the PR, fix branch-owned check failures and unresolved review threads, request or re-request Copilot or Codex review, wait with the bundled polling script, and repeat until no actionable feedback remains. Use when the user asks to run an AI PR feedback loop, get Copilot/Codex to review a PR, clear unresolved PR comments, fix failing PR checks, or repeatedly apply reviewer feedback before merge.

### [pr-review](skills/pr-review/SKILL.md)

Review pull requests, branches, commits, or working-tree diffs through parallel lenses: correctness-and-security, code-quality, tests, comments, errors, and types. Use whenever the user asks for a PR review, code review, merge-readiness check, aggressive/deep/thermos review, test-gap analysis, silent-failure review, comment or doc review, type-design feedback, or code-quality feedback on changed code.

### [pr-suggest-changes](skills/pr-suggest-changes/SKILL.md)

Publish finalized code review findings to an existing GitHub pull request as a clean pull request review with inline comments and suggested changes. Use when the user asks to submit, publish, post, or suggest review changes on an existing PR after findings are already known or while converting review feedback into GitHub review comments.
<!-- SKILLS:END -->

## Contributing

1. Create a new directory under `skills/` with your skill name
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`)
3. Run `bun run readme` to update the skills list above

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
### [Automation Team](skills/automation-team/README.md)

Skills for the Humanforce Automation Team

#### [Automation Board](skills/automation-team/automation-board/SKILL.md)

Rules for the Automation Jira board (AUT). Use when filing, triaging, moving, labelling, or closing an AUT ticket, assigning its Impact, or aligning ticket status with deploys.

#### [Git Conventions](skills/automation-team/git-conventions/SKILL.md)

Rules for Git operations: writing commits, naming branches, and writing pull requests.

#### [Worklogs](skills/automation-team/worklogs/SKILL.md)

Worklog conventions for the Automation Team. Use when starting significant work, recording decisions or findings, resuming work from a worklog, consolidating finished work, or preparing a pull request.

### [Engineering](skills/engineering/README.md)

Skills for common developer workflows.

#### [PR Apply Changes](skills/engineering/pr-apply-changes/SKILL.md)

Apply changes from the current conversation, an implementation plan, review feedback, issue reports, or PR follow-up work, then integrate them into the right commits. Use when the user asks to apply requested changes, implement an agreed plan, fix issues found in review, address issue feedback, or fold follow-up fixes into a branch or PR.

#### [PR Feedback Loop](skills/engineering/pr-copilot-review/SKILL.md)

Drive one PR through CI and Copilot review until feedback is resolved.

#### [PR Review](skills/engineering/pr-review/SKILL.md)

Review pull requests, branches, commits, or working-tree diffs through parallel lenses: correctness-and-security, code-quality, tests, comments, errors, and types. Use whenever the user asks for a PR review, code review, merge-readiness check, aggressive/deep/thermos review, test-gap analysis, silent-failure review, comment or doc review, type-design feedback, or code-quality feedback on changed code.

#### [PR Suggest Changes](skills/engineering/pr-suggest-changes/SKILL.md)

Publish finalized code review findings to an existing GitHub pull request as a clean pull request review with inline comments and suggested changes. Use when the user asks to submit, publish, post, or suggest review changes on an existing PR after findings are already known or while converting review feedback into GitHub review comments.
<!-- SKILLS:END -->

## Contributing

1. Create a new directory under `skills/` with your skill name
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`)
3. Run `bun run readme` to update the skills list above

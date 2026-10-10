# Review Scopes and Capture

Read this file before you capture a diff. Use the scope that the request names.

## Scope

| Request means                     | Scope                                   |
| --------------------------------- | --------------------------------------- |
| no scope named                    | Changes since the base branch           |
| only uncommitted work             | Uncommitted changes in the working tree |
| a named branch to compare against | Changes since that branch               |

## Base

- A named branch: the base is that branch.
- No base named: run `git symbolic-ref --short refs/remotes/origin/HEAD`. Remove the `origin/` prefix. If the command fails, use `main`.
- Tell the user the base. Use the same base for every publish in this session.

## Capture

Uncommitted scope:

1. Run `git status --short`. If the output is empty, stop. Tell the user that no uncommitted changes exist.
2. Otherwise run `r3 create --kind diff --working --title "Uncommitted changes"`.

Other scopes:

1. Run `base=$(git merge-base "<base>" HEAD) && git diff --stat "$base"`. If the output is empty, stop. Tell the user that no changes exist.
2. Otherwise run `base=$(git merge-base "<base>" HEAD) && git diff "$base" | r3 create --kind diff --stdin-diff --title "Changes since <base>"`.

## Untracked Files

The uncommitted scope includes untracked files. Other scopes omit them.

For other scopes, run `git ls-files --others --exclude-standard`. If it lists files, tell the user that the base diff omits them.

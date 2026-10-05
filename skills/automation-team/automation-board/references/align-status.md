# Align Status

Advance tickets to match where their code landed. A ticket is **shipped** to an environment when its key appears in the commits or merged PRs included in a successful deploy to that environment. Aligning only moves status forward: ticket fields, assignees, other Jira projects, and open PRs stay out of it.

## Map

Highest successfully deployed environment per key:

- Any non-production environment (dev, test, staging, …) → `Testing`
- Production (any region) → `Done`

Tickets already at or past their target, `On Hold`, or `Done` stay where they are.

## Flow

1. **Learn the pipeline.** In the current repo, find the deploy workflow(s) (e.g. under `.github/workflows/`) and the default branch. For each environment, record the job(s) whose success means it deployed, and rank the environments lowest to highest, with production on top. Done when every environment has its success jobs and rank; ask the user when the mapping is ambiguous.
2. **Collect runs.** List recent runs of those workflows, of any conclusion: the last 10 by default, or the range the user names. Judge each environment by its success jobs, never by the run's overall colour; later environments may be skipped or waiting on approval. Done when every run has a head SHA and its list of environments that actually deployed.
3. **Collect keys.** For each successful environment on a run, take commits `previous-successful-deploy-SHA-for-that-env..this-SHA` on the default branch. Extract `AUT-<number>` from commit subjects and bodies and merged PR titles and descriptions only; diffs and files are out of scope. Done when every successful environment has a key set.
4. **Resolve targets.** Per key, keep the highest-ranked environment and map it. Fetch the current status and drop keys the Map leaves in place. Done when the remaining list is `(key, current → target)`.
5. **Preview.** Show the pipeline mapping from step 1 and the list. Wait for go-ahead.
6. **Transition.** Group approved keys by target and transition each group. Report moved / failed / skipped; a failed transition is reported once, as a miss.

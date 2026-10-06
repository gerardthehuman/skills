# Pull Request Template & Guidelines

## Body Guidelines

- **Always Include**: `Summary` and `Testing`.
- **Contextual Modules**: Add only sections that provide material context, decisions, risks, or review focus.
- **No Boilerplate**: Omit non-applicable sections entirely. Never include a section heading just to write `None` or `Not Applicable`.
- Use Title Case headings.

## Template Modules

Use each module name below as a level-two heading in the pull request body.

### Summary (Required)

State what changed, why it matters, and practical user or system impact.

> Adds bounded retry handling to the batch sync worker to prevent transient HTTP 429 errors from dropping jobs during peak sync windows.

### Context & Problem (Optional)

Explain the user problem, bug, or business motivation when not obvious from the diff. Link relevant tickets or worklogs.

### Key Decisions & Approach (Optional)

Highlight non-trivial architectural choices, trade-offs, or rejected alternatives. Omit routine implementation details.

### Testing (Required)

List automated tests, manual checks, and what each validated. Note known test gaps only when risk-relevant.

> - Automated: `pnpm --filter api test batch-sync.test.ts` (14/14 pass, covering retry backoff and max attempts).
> - Manual: Ran dry-run sync against staging; verified retry logs and backoff delay.

### Review Focus (Optional)

Highlight highest-risk areas, complex logic, or non-obvious code paths in risk order. Cite specific files or lines.

### Security & Operational Impact (Optional)

Use for auth, data boundaries, permissions, runtime capacity, metrics, alerts, or rollback procedures.

### AI Assistance (Optional)

Include when AI tools contributed substantive code or tests. State the tool used, what it generated, and how it was human-verified.

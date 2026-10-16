# Triage

Make an AUT ticket **ready**: another session can open it and start without asking "what is this?". Triage stops at ready; implementation, deep planning, and full grilling wait for the user to escalate.

## Modes

- **New**: no ticket yet, or the user asks to file one.
- **Existing**: the user gives an AUT key or URL. Fetch the ticket and fold the gaps into an updated draft of that same ticket.

## Fields

New tickets, unless the user overrides:

- **Type**: `Bug` when something is broken, `Task` otherwise.
- **Assignee**: current user.
- **Location**: on the board, not the backlog.
- **Description**: thin version of the Specification.

Existing tickets: keep the assignee unless the user explicitly asks to change it. Change the issue type only when it is wrong. Leave `Description` unchanged; it records the original ask.

All tickets: recommend a parent epic when one fits.

## Flow

1. **Load context.** New: the prompt. Existing: the ticket plus the user's directives; what the user adds in chat supersedes a hollow body.
2. **Scope until ready.** Restate the goal in 1–3 sentences. Ask only high-leverage gaps (light when clear, medium when fuzzy). Look up code-bound facts rather than asking.
3. **Draft.**
   - **Summary**: imperative, starting with an action ("Add CSV export", "Fix invite token expiration").
   - **Description**: thin version of the specification, for new tickets. Existing tickets: leave unchanged.
   - **Specification**: scoped content agreed with the user: goal, context, in/out of scope as needed. Features and feature bugs read product-facing: user experience, business context, expected outcome. Write technically only for technical work (refactoring, tooling, infrastructure).
   - **Language**: Australian English (en-AU) and ASD-STE100 (short sentences, active voice, one instruction per sentence, simple words, and one term for each thing).
   - **Integrity**: acceptance criteria only as the user affirmed them. Existing tickets show **before → after** for changed fields.
4. **Confirm.** Show Jira project, Project field, type, summary, status and applicable readiness or close label (each with a one-line why), assignee, epic, Impact, and specification. Wait for go-ahead or edits.
5. **Write.** Create or update with tools that support ADF, so rich-text fields (Specification, and Description on new tickets) render as rich text rather than raw markdown or JSON. Re-fetch and verify the ticket after writing.
6. **Report.** Give the ticket summary, key, and link.

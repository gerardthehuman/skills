# Comment Quality

Check documentation against the behavior it describes.
Include unchanged text that the reviewed change can invalidate.

Inspect comments, docstrings, examples, and user documentation for:

- Incorrect parameter, return, error, or side-effect descriptions.
- Assumptions and invariants that the code no longer preserves.
- Examples and setup instructions that no longer work.
- TODO notes whose stated condition changed.
- Explanations that contradict ownership or control flow.

Prefer comments that explain constraints, intent, or non-obvious consequences.
Simple restatement is not automatically harmful.
If the text creates concrete confusion or maintenance cost, recommend removal.

Completion: each candidate identifies the inaccurate claim, conflicting behavior, and consequence for users or maintainers.

# Issue Acceptance Verification

Verify that the implementation on this branch satisfies the business requirements
of the linked GitHub issue. Run BEFORE running `/project:review` and BEFORE committing.

## Steps

### 1. Identify the issue number

- Check the branch name for a numeric suffix (e.g. `feat/auth-login-form-5`)
- Check recent commit messages for `closes #N` or `refs #N` patterns: `git log --oneline -10`
- If not found, ask the user: "Which GitHub issue does this branch implement?"

### 2. Fetch the issue

```
gh issue view <N>
```

Read the full issue body carefully. Extract:

- The stated **goal** or problem being solved
- Explicit **acceptance criteria** (checklist items in the issue body)
- Implicit requirements described in prose
- Any explicitly **out-of-scope** items

### 3. Inspect the implementation

```
git diff main...HEAD -- '*.ts' '*.tsx' '*.css'
```

Read every changed file in full. Understand what was added, changed, or removed.
Also check for new files not yet tracked: `git status`.

### 4. Cross-reference each requirement

For every requirement or acceptance criterion extracted in Step 2:

- **COVERED** — The diff contains clear evidence: component/hook code + a test exercising it
- **PARTIAL** — Code exists but test is missing, or only the happy path is tested
- **MISSING** — No evidence of this requirement in the diff at all

### 5. Check for scope creep

List any implementation changes NOT traceable to a requirement in the issue.
These may be legitimate (necessary helpers, forced by a hook) or may indicate work
that belongs in a separate issue. Flag them explicitly.

### 6. Report

Use this exact format:

```
Issue #N: <title>

Requirements:
[REQ-1] <description of requirement> → COVERED / PARTIAL / MISSING
[REQ-2] <description of requirement> → COVERED / PARTIAL / MISSING
...

Scope (changes not traceable to a requirement):
- <file:line> — <description> [JUSTIFIED / NEEDS DISCUSSION]

Verdict: PASS / FAIL
```

**PASS** = all requirements COVERED.
**FAIL** = any requirement is MISSING or PARTIAL.

Do NOT suggest committing if verdict is FAIL.

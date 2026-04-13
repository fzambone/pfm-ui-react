# Triage a Bug or Error

Investigate a bug report, error message, or unexpected behavior using a structured process.
Systematically search the codebase, identify root causes, and optionally create a GitHub issue.

Run this skill when a bug is reported or an error surfaces — before jumping to a fix.

---

## Phase 1 — Input

### 1.1 Capture the problem

Read the argument passed to this skill (e.g. `/project:triage "Login form shows blank screen after submit"`).

If no argument, ask: "Describe the bug, paste the error message, or provide a stack trace."

### 1.2 Extract signals

From the input, identify all available signals:

- **Error message** — the exact text (console error, React error boundary, network error)
- **Component** — which page or component is affected
- **User action** — what the user did to trigger it
- **Browser console output** — JS errors, failed network requests
- **Reproduction steps** — how to trigger it
- **Environment** — local dev, preview, production

Record what you have and what's missing. If critical context is missing, ask before proceeding.

---

## Phase 2 — Investigate

Search the codebase systematically, layer by layer. Do NOT guess — read the code.

### 2.1 Find the component

Locate the component where the error surfaces:

```
# Find the page/route component
grep -rn "path.*<route>" src/pages/ src/App.tsx

# Find the specific component
grep -rn "<ComponentName>" src/
```

### 2.2 Trace the component tree

From the error location, trace upward and downward:

1. **Route** (`src/pages/`, `src/App.tsx`) — is the route configured correctly?
2. **Page component** — what does it render and what props/context does it consume?
3. **Feature components** (`src/features/`) — which feature module owns this UI?
4. **Shared components** (`src/shared/`) — is a shared component misused?

### 2.3 Trace hook dependencies

If the bug involves state or side effects:

```
# Find custom hooks used by the component
grep -rn "use[A-Z]" src/features/<feature>/

# Find the hook definition
grep -rn "export function use<HookName>" src/
```

Check:
- Is the hook called conditionally? (violates Rules of Hooks)
- Are dependencies in `useEffect`/`useMemo`/`useCallback` correct?
- Is state updated after an unmounted component? (async race condition)

### 2.4 Trace the API call chain

If the bug involves data fetching:

```
# Find API calls for this feature
grep -rn "fetch\|axios\|api\." src/features/<feature>/

# Check the API client/service
grep -rn "<endpoint>" src/shared/api/ src/features/*/api/
```

Check:
- Is the request URL correct? Does it match the OpenAPI spec?
- Is the response shape handled correctly? (missing fields, wrong types)
- Is error handling present? (network errors, 401/403/500)
- Is loading state managed? (blank screen = missing loading guard)

### 2.5 Check error boundaries

```
# Find error boundaries
grep -rn "ErrorBoundary\|error-boundary" src/

# Check if the affected component is wrapped
```

### 2.6 Check TypeScript types

If the bug might be a type mismatch at runtime:

```
# Check the type definitions for the affected data
grep -rn "type\|interface" src/features/<feature>/types/
```

---

## Phase 3 — Diagnose

### 3.1 List hypotheses

Based on the investigation, list all plausible root causes. For each:

```
Hypothesis #N: <one-line description>
  Layer:      route / component / hook / API / state / styling
  Evidence:   <what points to this cause>
  Likelihood: HIGH / MEDIUM / LOW
  File:       <file_path:line_number>
```

### 3.2 Rank and narrow

Order hypotheses by likelihood. For the top 1-2:

- Read the specific code path end-to-end
- Check if the error is reproducible from the evidence
- Identify the exact line or condition where the bug originates

### 3.3 Confirm or rule out

For each top hypothesis, state:
- **CONFIRMED** — the code clearly shows the bug
- **LIKELY** — evidence is strong but needs browser verification
- **RULED OUT** — evidence contradicts this hypothesis

---

## Phase 4 — Test Gap Analysis

### 4.1 Find existing tests

```
# Find tests for the affected component/feature
ls src/features/<feature>/*.test.tsx src/features/<feature>/*.test.ts

# Find tests for shared components
ls src/shared/**/*.test.tsx
```

### 4.2 Identify the gap

For the confirmed or likely root cause:

- Which test file should contain a test for this scenario?
- What test case is missing? (describe the scenario)
- Is it a unit test gap (component render) or integration test gap (API interaction)?

Report:
```
Test gap: <description>
  Should be in:  <file_path>
  Missing case:  <scenario description>
  Type:          unit / integration / e2e
```

---

## Phase 5 — Report

Present findings to the user:

```
## Triage Report

**Problem:** <one-line summary>
**Root cause:** <confirmed or most likely hypothesis>
**Layer:** <route / component / hook / API / state / styling>
**File:** <file_path:line_number>

### Evidence
<bullet points of what was found>

### Test gap
<what test should have caught this>

### Suggested fix
<brief description of the fix approach — do NOT implement>
```

**Stop here.** Ask the user:
1. Should I create a GitHub issue for this?
2. Should I proceed to fix it with `/project:implement`?

---

## Phase 6 — Create Issue (optional)

If the user wants a GitHub issue:

```
gh issue create --title "fix(<scope>): <description>" --body "$(cat <<'EOF'
## Bug Report

**Error:** <exact error message>
**Component:** <affected component/page>
**Environment:** <local / preview / production>

## Root Cause

<description from triage>

## Evidence

<file paths and line numbers>

## Suggested Fix

<approach from triage report>

## Test Gap

<what test to add>

## Acceptance Criteria

1. When <trigger scenario>, the error no longer occurs.
2. A test exists that covers this exact scenario.
EOF
)"
```

Report the issue number and URL back to the user.

# Implement a User Story

Implement a GitHub issue end-to-end following strict TDD: issue loading, branch creation, codebase
assessment, plan writing, decision surfacing, Red→Green cycles, and CI gate execution.

Run this skill at the **start of every new story**. Do not begin implementation without it.

---

## Phase 1 — Setup

### 1.1 Identify the issue

- Read the argument passed to this skill (e.g. `/project:implement 42`)
- If no argument, check the current branch name for a numeric suffix
- If still not found, ask: "Which GitHub issue should I implement?"

### 1.2 Load the issue

```
gh issue view <N>
```

Read the full issue body carefully. Extract:

- The stated **goal** — what problem this solves
- Explicit **acceptance criteria** (checklist items in the issue body)
- Implicit requirements in prose
- Explicitly **out-of-scope** items

### 1.3 Create the branch

```
git checkout main && git pull
git checkout -b feat/<scope>-<description>-<N>
```

Where `<scope>` is the feature domain (e.g. `auth`, `household`, `dashboard`) and `<N>` is the issue number.

---

## Phase 2 — Codebase Assessment

Explore the relevant code before writing anything:

- Read the feature folder(s) touched by this story
- Search for existing components, hooks, and utilities that can be reused
- Check `src/shared/` for existing primitives (Button, Input, etc.)
- Identify which files will need to change and which will be new
- Check if API types are already defined in the feature's `types.ts`

---

## Phase 3 — Implementation Plan

Write a plan to `.claude/plans/<branch-name>.md` with these sections:

```
## Summary
One paragraph: what this story delivers and why.

## Components
- New or modified components in src/features/<feature>/components/

## Hooks
- New or modified custom hooks in src/features/<feature>/hooks/

## Types
- New TypeScript types or changes to existing types

## API
- New API call functions in src/features/<feature>/api/

## Shared
- New additions to src/shared/ if needed

## Test strategy
- Unit tests: hooks, utilities
- Component tests: rendering, interaction, accessibility
- E2E tests: user flows (if applicable)

## Implementation order
1. Types
2. Hook (failing test first)
3. Component (failing test first)
4. Wire into parent/routing

## Open decisions
- Architectural ambiguities requiring input before coding starts
```

**Stop here and present the plan.** Surface all open decisions. Wait for confirmation before Phase 4.

---

## Phase 4 — TDD Implementation

Follow strict **RED → GREEN → REFACTOR** for every unit.

### TDD by unit type

**Custom hooks:**

- Write a failing `renderHook` test first
- Confirm it fails (RED)
- Implement the hook to make it pass (GREEN)
- Refactor

**Components:**

- Write a failing `render` + assertion test first
- Confirm it fails (RED)
- Implement the component to make it pass (GREEN)
- Add interaction tests with `userEvent`
- Add accessibility assertions

**Pure utilities:**

- Write the failing unit test first
- Confirm it fails (RED)
- Implement to pass (GREEN)

**E2E flows:**

- Write the Playwright spec describing the user journey
- Confirm it fails against the current state (RED)
- Implement features until the spec passes (GREEN)

### Rules

- **NEVER write production code before a failing test.** The test must exist and fail before any `.tsx`/`.ts` file without `.test` is created or modified.
- One unit at a time. Do not write the next test until the current one passes.
- Follow the implementation order from Phase 3.

### Testing patterns

```
// Component test pattern
describe('ComponentName', () => {
  it('renders with required props', () => { ... });
  it('calls onAction when user clicks button', async () => { ... });
  it('shows error state when prop is provided', () => { ... });
  it('is accessible with correct ARIA attributes', () => { ... });
});

// Hook test pattern
describe('useHookName', () => {
  it('returns initial state', () => { ... });
  it('updates state when action is called', async () => { ... });
  it('handles error from API', async () => { ... });
});
```

### Query priority (Testing Library)

1. `getByRole` — preferred, tests accessibility
2. `getByLabelText` — for form inputs
3. `getByPlaceholderText` — fallback for inputs
4. `getByText` — for non-interactive text
5. `getByTestId` — last resort only, add `data-testid` sparingly

### Key idioms

- `userEvent.setup()` before each test that needs interactions
- `waitFor` / `findBy*` for async state changes
- `vi.mock` only for external modules (never for internal components)
- `msw` for API mocking at the network level (when configured)

---

## Phase 5 — CI Gates

All three must PASS before the story is considered done.

### Gate 1 — Build and test

```
pnpm ci
```

`pnpm ci` runs: lint → type-check → test with coverage → build. Fix all failures before proceeding.

### Gate 2 — Acceptance verification

```
/project:verify-issue
```

Every acceptance criterion must be COVERED. PARTIAL or MISSING = FAIL. Fix and re-run.

### Gate 3 — Code quality

```
/project:review
```

All categories must PASS. Fix every violation before proceeding.

---

## Phase 6 — Wrap Up

Report to the user:

- Story summary: what was implemented
- Files changed (list with one-line description of each)
- Test coverage added
- Accessibility considerations addressed
- Any deferred items or follow-up issues to open

Ready for `/project:ship`.

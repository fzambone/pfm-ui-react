# Audit Test Coverage and TDD Compliance

Run this skill after implementing any feature. Two phases:
1. **Coverage** — measure and report per-feature coverage
2. **TDD compliance** — audit naming, structure, isolation, and patterns

---

## Phase 1 — Coverage

### 1.1 Run tests with coverage

```
pnpm test:coverage
```

### 1.2 Analyze coverage

Parse the coverage output and report per-feature coverage.

**Thresholds:**

| Package group | Minimum |
|---------------|---------|
| `src/features/*/hooks/` | ≥ 90% |
| `src/features/*/components/` | ≥ 80% |
| `src/shared/` | ≥ 85% |
| `src/features/*/api/` | ≥ 80% |

**Exclude from gate:**
- `src/main.tsx` — entry point
- `src/test/` — test setup files
- `*.d.ts` — type declarations
- `src/**/index.ts` — barrel exports with no logic

**Flag:**
- Any non-excluded file with 0% coverage
- Any hooks file below 90%
- Any component file below 80%

### 1.3 Report

```
Coverage Report
===============
src/features/auth/hooks/      95.0%  ✓
src/features/auth/components/ 83.0%  ✓
src/shared/components/        88.0%  ✓
...

Below threshold:
- src/features/household/hooks/  72.0%  ✗  (needs +18%)
```

---

## Phase 2 — TDD Compliance

Read every `*.test.{ts,tsx}` file in changed areas. Check each item.

### Naming and Structure

- [ ] Test files are co-located with the file they test: `ComponentName.test.tsx` beside `ComponentName.tsx`
- [ ] `describe` block names match the component or hook name
- [ ] `it` / `test` descriptions are written from the user's perspective: "renders the submit button" not "calls setState"
- [ ] E2E files follow `feature-name.spec.ts` pattern in `e2e/`

### Query Priority

- [ ] `getByRole` used as first choice for interactive elements
- [ ] `getByLabelText` used for form inputs
- [ ] `getByTestId` used only as last resort (document why if present)
- [ ] No `querySelector` or `container.firstChild` — these test DOM structure, not behavior

### Interaction Testing

- [ ] `userEvent.setup()` called before each test needing interactions
- [ ] `await userEvent.click()` / `await userEvent.type()` — always awaited
- [ ] `waitFor` used for async state changes
- [ ] `findBy*` used when element appears asynchronously

### Isolation

- [ ] No real API calls — network is mocked (msw) or module is mocked
- [ ] No test depends on another test's state — each test is independent
- [ ] `vi.clearAllMocks()` or `vi.resetAllMocks()` in `afterEach` if mocks are used
- [ ] Async effects cleaned up — no "act() warning" in output

### Accessibility Testing

- [ ] At least one accessibility assertion per interactive component:
  `expect(element).toBeAccessible()` or role-based query as implicit check
- [ ] Form inputs tested with label association: `getByLabelText` not `getByPlaceholderText`
- [ ] Error messages tested with `getByRole('alert')` or `aria-live` assertions

### Hook Testing

- [ ] `renderHook` used to test hooks in isolation
- [ ] Initial state tested
- [ ] State transitions tested (call action → assert new state)
- [ ] Error state tested (mock API to reject → assert error state)
- [ ] Cleanup tested if hook sets up subscriptions or timers

### Coverage of Error Paths

- [ ] Happy path tested
- [ ] Loading state tested (if applicable)
- [ ] Error state tested
- [ ] Empty state tested (empty list, no data)
- [ ] Edge cases: empty string, null, undefined, boundary values

---

## Final Report

```
TDD Compliance
==============
Naming and Structure:    PASS / FAIL
Query Priority:          PASS / FAIL
Interaction Testing:     PASS / FAIL
Isolation:               PASS / FAIL
Accessibility Testing:   PASS / FAIL
Hook Testing:            PASS / FAIL
Error Coverage:          PASS / FAIL

For each FAIL: <file>:<line> — <description>

Overall: PASS / FAIL
```

Do NOT suggest committing until both phases report PASS.

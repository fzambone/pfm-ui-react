# Code Review Checklist

Run this complete checklist against all changed files. Every item must pass.
Do NOT suggest a commit until all categories report PASS.

Review the actual code — read every changed file, check for test coverage, verify accessibility.

## TypeScript

- [ ] No `any` — use `unknown` + narrowing or proper generic types
- [ ] No `!` non-null assertions — use optional chaining or explicit null checks
- [ ] No `as` type casting unless interfacing with untyped third-party code
- [ ] Discriminated unions used for state with multiple variants (loading/error/success)
- [ ] All function parameters and return types are explicitly typed (or correctly inferred)
- [ ] `type` used for object shapes, `interface` only when extension is expected
- [ ] `unknown` used instead of `any` for truly unknown external data
- [ ] Generic type parameters are constrained when possible

## React Correctness

- [ ] No missing dependency array entries in `useEffect` / `useMemo` / `useCallback`
- [ ] No direct state mutation — always produce new state
- [ ] No stale closure traps — variables from outer scope captured correctly in hooks
- [ ] Keys in lists are stable and unique (never array index unless list is static)
- [ ] Side effects are in `useEffect`, not during render
- [ ] No `useEffect` for derived state — compute during render or use `useMemo`
- [ ] Error boundaries wrap feature-level components
- [ ] `useCallback` / `useMemo` used only where a measurable benefit exists

## Component Design

- [ ] Components accept the minimum props needed — no prop drilling beyond 2 levels
- [ ] No business logic in components — extracted to hooks
- [ ] Props are typed with explicit interfaces, not inline types in function signatures
- [ ] No cross-feature imports — features communicate through lifted state or context
- [ ] Shared components in `src/shared/` are domain-agnostic
- [ ] Feature public API exposed through `src/features/<name>/index.ts`

## Styling (Tailwind)

- [ ] No inline `style={}` for values expressible as Tailwind utilities
- [ ] No `@apply` in CSS files — use Tailwind classes in JSX
- [ ] Responsive classes used for layout (`sm:`, `md:`, `lg:`)
- [ ] Dark mode considered where applicable (`dark:`)
- [ ] Consistent spacing and sizing from Tailwind's scale (not arbitrary values)

## Accessibility

- [ ] All interactive elements (`button`, `a`, inputs) have accessible names
      (via content, `aria-label`, or `aria-labelledby`)
- [ ] Images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Forms have `<label>` elements associated with inputs
- [ ] Focus order follows visual reading order
- [ ] Error messages are associated with their input via `aria-describedby`
- [ ] Loading states communicate to screen readers (`aria-live` or `aria-busy`)
- [ ] Color is not the only means of conveying information
- [ ] ESLint jsx-a11y rules pass with zero warnings

## Testing

- [ ] Every component has at least: one render test, one interaction test, one accessibility assertion
- [ ] Every custom hook has: initial state test, state transition test, error handling test
- [ ] Queries use `getByRole` as first choice — `getByTestId` only as last resort
- [ ] `userEvent.setup()` used for interaction tests (not `fireEvent`)
- [ ] Async state changes use `waitFor` or `findBy*` queries
- [ ] No implementation detail testing (no testing internal state or private methods)
- [ ] Coverage meets thresholds: 80% branches, functions, lines, statements
- [ ] E2E test added for any complete user flow introduced by this story

## Linting and Format

- [ ] `pnpm lint` exits 0 with zero warnings
- [ ] `pnpm format:check` exits 0
- [ ] `pnpm type-check` exits 0
- [ ] No `// eslint-disable` comments without justification
- [ ] Import order follows Google style (external → internal → relative)

## Architecture

- [ ] No business logic in components — in hooks
- [ ] No API calls directly in components — in `api/` functions or hooks
- [ ] No cross-feature imports
- [ ] New shared utilities are domain-agnostic and have unit tests
- [ ] No new dependencies added without discussion

## Performance

- [ ] No expensive computations during render without `useMemo`
- [ ] Callback props are stable across renders where needed (avoid child re-render churn)
- [ ] Images have explicit `width` and `height` to prevent layout shift
- [ ] No unnecessary `useEffect` chains

## Final Verification

- [ ] `pnpm ci` passes (lint + type-check + test:coverage + build)
- [ ] Commit message follows: `type(scope): description` + `closes #N`

---

**Report format:** List each category as PASS or FAIL.
For failures, state the specific violation and the file:line where it occurs.
Do NOT suggest committing until every category passes.

Categories:

1. TypeScript
2. React Correctness
3. Component Design
4. Styling (Tailwind)
5. Accessibility
6. Testing
7. Linting and Format
8. Architecture
9. Performance

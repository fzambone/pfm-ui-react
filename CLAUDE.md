# PFM-UI-React — Personal Financial Manager Frontend

## Project Identity

- **Repo:** `github.com/fzambone/pfm-ui-react`
- **API repo:** `github.com/fzambone/pfm-go` — backend this UI consumes
- **Stack:** React 19 + TypeScript 5 + Vite + Tailwind CSS v4
- **Package manager:** pnpm (strict, frozen lockfile in CI)
- **Node:** 20 LTS (pinned in `.nvmrc`)
- **Commits:** Conventional Commits:
  ```
  type(scope): imperative description

  - Bullet per meaningful change (what and why, not how)

  closes #N
  ```
  Prefixes: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `style`.
  Scope = feature or UI concern (e.g. `auth`, `dashboard`, `household`, `routing`).
- **Git:** Trunk-based, squash-merge, short-lived branches: `feat/<scope>-<description>-<N>`
- **CI Gate:** `pnpm lint && pnpm type-check && pnpm test:coverage && pnpm build`. All must pass.

## Non-Negotiables — Blocking Issues

1. **Strict TDD.** Red → Green → Refactor. No production code without a failing test first.
2. **No `any`.** `@typescript-eslint/no-explicit-any` is `error`. Use `unknown` + narrowing.
3. **Google TypeScript Style.** Enforced by ESLint + Prettier. Zero warnings (`--max-warnings 0`).
4. **Accessibility first.** `eslint-plugin-jsx-a11y` enforced at `error` level. All interactive elements must be keyboard-navigable.
5. **No magic.** No class-based state managers, no DI containers. React hooks + context + server state (React Query when introduced). Explicit wiring.
6. **Hermetic tests.** Unit/component = Vitest + Testing Library, never real network calls (use `msw` for API mocking when introduced). E2E = Playwright against the built app.
7. **Coverage gate.** 80% minimum on branches, functions, lines, statements. Enforced in CI.

## Architecture — Feature-Based

```
src/
  features/           → one folder per domain feature
    auth/
      components/     → React components for this feature
      hooks/          → custom hooks
      api/            → API call functions (fetch wrappers)
      types.ts        → TypeScript types for this feature
      index.ts        → public API of the feature (barrel export)
    household/
    dashboard/
  shared/             → truly reusable across features
    components/       → Button, Input, Modal, etc.
    hooks/            → useDebounce, useLocalStorage, etc.
    utils/            → pure utility functions
    types/            → shared TypeScript types
  test/               → global test setup and utilities
  main.tsx            → entry point — wires everything
  App.tsx             → root component + routing
```

### Import Rules

| Layer | Can Import | NEVER Imports |
|-------|-----------|---------------|
| `features/*` | `shared/`, external libs | Other `features/` directly |
| `shared/*` | external libs, stdlib | `features/` |
| `main.tsx` / `App.tsx` | Everything (composition root) | — |

Features communicate through lifted state, context, or URL (router). Never direct cross-feature imports.

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component file | PascalCase | `HouseholdCard.tsx` |
| Hook file | camelCase with `use` prefix | `useHouseholdList.ts` |
| Utility file | camelCase | `formatCurrency.ts` |
| Type file | camelCase | `types.ts` |
| Component | PascalCase noun | `HouseholdCard` |
| Hook | `use` + PascalCase verb/noun | `useHouseholdList` |
| Handler prop | `on` + PascalCase event | `onDelete`, `onSubmit` |
| Boolean prop | `is`/`has`/`can` prefix | `isLoading`, `hasError` |
| Test file | Same name + `.test.tsx` | `HouseholdCard.test.tsx` |
| Test function | `describe('<Component>')` + `it('<behavior>')` | — |
| E2E file | Feature + `.spec.ts` | `household.spec.ts` |

## Technology Stack

| Concern | Choice |
|---------|--------|
| Framework | React 19 |
| Language | TypeScript 5 (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Linting | ESLint 9 (flat config) + Google TS rules |
| Formatting | Prettier (Google style) |
| Unit/Component tests | Vitest + @testing-library/react |
| E2E tests | Playwright (Chromium in CI) |
| API mocking | msw (when introduced) |
| HTTP client | Native `fetch` (no axios unless justified) |

### Dependency Policy

**Allowed:** Single-purpose libs (react-router, @tanstack/react-query, zod, msw).
**Forbidden:** jQuery, class-based state managers (Redux without RTK), CSS-in-JS (styled-components), UI kits that don't support Tailwind, anything that requires a babel macro.
**Evaluate carefully:** Any lib adding >50KB to the bundle. Always check bundle impact.

## Design Decisions

**Tailwind v4:** CSS-first configuration (no `tailwind.config.js`). Theme tokens defined with `@theme` in CSS. Utility classes only — no `@apply` in component CSS (defeats the purpose).

**TypeScript strict mode:** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns` all enabled. Array indexing returns `T | undefined`. Treat this as the natural state — don't suppress with `!`.

**No barrel `index.ts` in component folders:** Import from the specific file. Barrel exports cause circular dependency risk and make tree-shaking harder. Exception: feature `index.ts` is the public API — nothing outside the feature imports from sub-paths.

**Testing philosophy:**
- Unit tests for pure functions and custom hooks (`renderHook`)
- Component tests for rendering, interaction, and accessibility (`render` + `userEvent`)
- E2E tests for complete user flows (Playwright)
- Never test implementation details — test behavior from the user's perspective

**Forms:** Uncontrolled with native validation first. Add `react-hook-form` + `zod` when a form exceeds 3 fields or needs complex validation (future milestone).

## Error Handling

1. **Network errors:** Every API call returns a typed `Result<T, ApiError>` — no unhandled promise rejections.
2. **Component errors:** Error boundaries at the feature level — a broken feature doesn't crash the whole app.
3. **Type narrowing:** Never use `as` for type casting unless interfacing with untyped third-party code. Use type guards.
4. **Never swallow:** Intentional ignores are commented: `// handled by error boundary above`.

## Testing

| Layer | Tool | What It Tests |
|-------|------|---------------|
| Pure functions | Vitest | Input/output, edge cases |
| Custom hooks | Vitest + `renderHook` | State logic, side effects |
| Components | Vitest + Testing Library | Rendering, interaction, accessibility |
| User flows | Playwright | Full feature flows, navigation |

- **Queries in priority order:** `getByRole` > `getByLabelText` > `getByPlaceholderText` > `getByText` > `getByTestId`. Never `getByTestId` as first choice.
- **`userEvent` over `fireEvent`:** `userEvent` simulates real browser behavior (focus, keyboard, pointer events). `fireEvent` is for edge cases only.
- **Arrange-Act-Assert:** Every test follows AAA. No nested `describe` blocks beyond one level.
- **No snapshot tests:** They test implementation, not behavior. Exception: complex SVG/chart output.

## Pre-Commit Gates — Run Before Every Commit

**Step 1:** Run `/project:verify-issue` to confirm implementation satisfies the issue's acceptance criteria.

**Step 2:** Run `/project:review` for the full quality checklist:

- [ ] **Types:** No `any`, proper narrowing, no `!` non-null assertions
- [ ] **Lint:** `pnpm lint` exits 0 (zero warnings)
- [ ] **Format:** `pnpm format:check` exits 0
- [ ] **Tests:** All pass with coverage above thresholds
- [ ] **Accessibility:** Interactive elements have ARIA labels, keyboard navigation works
- [ ] **Architecture:** No cross-feature imports, feature public API through `index.ts`
- [ ] **Performance:** No unnecessary re-renders (check with React DevTools profiler if in doubt)

## Build & Run

```
pnpm dev            — start dev server (http://localhost:5173)
pnpm build          — production build
pnpm preview        — preview production build
pnpm lint           — lint (zero warnings)
pnpm type-check     — TypeScript check
pnpm test           — run unit/component tests once
pnpm test:watch     — run tests in watch mode
pnpm test:coverage  — run with coverage report
pnpm test:e2e       — run Playwright E2E tests
pnpm ci             — full local CI gate (lint + type-check + test:coverage + build)
```

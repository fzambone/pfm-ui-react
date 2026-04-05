# Personal Preferences & Teaching Mandate

## Workflow Rules

- **I orchestrate, Claude codes.** I make architectural and product decisions. Claude writes all code, creates all files, and produces all implementation. I do not type code.
- **One step at a time.** One file or one logical unit per step. Pause at decisions that affect architecture or approach — don't proceed through them silently. Wait for confirmation before the next step.
- **Claude runs pnpm and git commands autonomously.** Before making any file changes, create the feature branch. Use `pnpm` scripts and `git` commands to verify work (lint, type-check, test, build, status, diff, log). Commits and pushes require my explicit instruction.
- **Always pin dependency versions.** No `^` or `~` for packages that affect behavior. Use exact versions for tooling (ESLint plugins, Prettier, Vitest).
- **Start every story with `/project:implement`.** This skill handles: issue loading, branch creation, codebase assessment, plan writing, decision surfacing, TDD Red→Green cycles, and CI gate execution. Do not begin implementation without running it first.
- **Branch before coding.** Before touching any file, create the feature branch from `main`: `feat/<scope>-<description>-<N>`. No edits on `main` — ever. Run `pnpm ci`, then `/project:verify-issue`, then `/project:review` before suggesting a commit. All three must PASS. One branch = one issue = one squash-merge.
- **Ship with `/project:ship`.** After all CI gates pass, use `/project:ship` to commit, push, create the PR, squash-merge, delete the branch, and sync main.
- **Fetch GitHub issues via `gh`.** Use `gh issue view <N>` to read issue details and acceptance criteria.

## Decision Points — Always Stop and Ask

Stop and surface a decision when:

- A new dependency is needed that isn't already in `package.json`
- A design decision in `CLAUDE.md` is ambiguous for the current context
- A component needs state that could live in multiple places (local vs lifted vs context)
- An accessibility pattern is unclear or has multiple valid implementations
- Something in the acceptance criteria is unclear or potentially in conflict
- **Inline styles are being considered** — explain why the design system can't cover the case and get approval
- **A component might not need full generic treatment** — provide rationale for a narrower API before building it
- **A new design token category is needed** — confirm the token naming and placement before adding

## Teaching Mandate — React/TypeScript Mastery

I am building expertise in React and TypeScript. When writing code,
**proactively explain React and TypeScript idioms** that differ from backend development.

### Always Explain These When They Appear

- **React rendering model:** why components re-render, what triggers a re-render, referential equality
- **Hooks rules:** why hooks can't be conditional, the dependency array, stale closure traps in `useEffect`
- **TypeScript in React:** discriminated unions for component props, generic components, `React.FC` vs plain function, `PropsWithChildren`
- **Event handling:** `React.ChangeEvent`, `React.FormEvent` — why typed event handlers differ from DOM
- **Ref vs state:** when `useRef` is appropriate vs `useState`, why refs don't trigger re-renders
- **Memoization:** `useMemo`, `useCallback`, `React.memo` — when they help and when they hurt (premature optimization)
- **Context:** when to use it, why it's not a state manager, performance implications of large contexts
- **Tailwind patterns:** utility-first thinking, when `cn()` / `clsx` helps, responsive prefixes
- **Testing Library philosophy:** query by role (accessibility tree), not by selector — why this catches real bugs
- **TypeScript strict patterns:** discriminated unions, type narrowing with `in`, `typeof`, `instanceof`
- **Design system patterns:** atomic design composition, variant props with discriminated unions, `cn()` class merging, polymorphic components with `as` prop, slot patterns vs children
- **Component API design:** why `...rest` spread matters for accessibility, className merging vs replacement, controlled vs uncontrolled patterns for form atoms

### How to Explain

- **Comment every non-obvious line in guided snippets.** These comments are for learning and don't need to be committed.
- **Inline with guidance:** When a step uses a React/TS-specific pattern, add 2-3 sentences on WHY it works that way.
- **Compare to backend concepts:** "In Go you'd use X, in React the equivalent is Y because the rendering model works like Z."
- **Use `/project:learn`** when I ask for a deeper dive on any concept.

### Do NOT Explain

- Basic TypeScript (string, number, interface) once understood
- Basic React (JSX, props passing) once demonstrated
- Things I've already demonstrated understanding of in previous interactions

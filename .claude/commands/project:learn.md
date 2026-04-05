# React & TypeScript Concept Deep Dive

The user wants to understand a React, TypeScript, or frontend concept more deeply.
They may specify a topic, or reference code they just wrote but didn't fully understand.

Follow this structure for every explanation:

## 1. What It Is

Explain the concept in plain language. No jargon. One paragraph max.

## 2. How It Works in React/TypeScript

Show the mechanics with a minimal code example. Prefer examples from the pfm-ui-react
codebase when possible. Every meaningful line has an inline comment explaining it.

## 3. Why React/TypeScript Does It This Way

Connect to the design philosophy:

- React: declarative UI, unidirectional data flow, composition over inheritance
- TypeScript: structural typing, type inference, safety without verbosity
- Every idiom exists for a reason — explain the tradeoff

## 4. Coming From Backend Development (Go)

Compare with Go equivalents. Use this table format:

| Go Concept | React/TypeScript Equivalent | Why It Differs |
| ---------- | --------------------------- | -------------- |
| ...        | ...                         | ...            |

Highlight:

- The mental model shift (imperative → declarative)
- The specific muscle-memory trap to watch for
- What's genuinely better or worse about each approach

## 5. In Our Codebase

Point to specific files in pfm-ui-react where this concept is used or will be used.

## 6. Common Mistakes

List the 2-3 most common mistakes, especially from developers coming from backend/Go.

---

## Reference: Concepts by Category

### React Fundamentals

- **Rendering model:** when React re-renders, reconciliation, the virtual DOM mental model
- **Component lifecycle:** mount → update → unmount, `useEffect` timing
- **Controlled vs uncontrolled inputs:** when each is appropriate
- **Lifting state:** when and how to move state up the component tree
- **Composition patterns:** children prop, render props, compound components

### Hooks

- **`useState`:** local state, batching, functional updates
- **`useEffect`:** side effects, dependency array, cleanup function
- **`useRef`:** mutable container that doesn't trigger re-render, DOM refs
- **`useMemo`:** memoize expensive computations, referential equality
- **`useCallback`:** stable function identity, when it matters
- **`useContext`:** reading context, performance implications
- **`useReducer`:** complex state transitions, action pattern
- **Custom hooks:** extracting reusable stateful logic, naming convention

### TypeScript in React

- **Component prop types:** interface vs type, optional props, default props
- **Generic components:** `<T>` in component signatures, constrained generics
- **`React.FC` vs function declaration:** why function declarations are preferred
- **Event types:** `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent`
- **`children` prop:** `React.ReactNode`, `React.PropsWithChildren`
- **Discriminated unions for state:** loading/error/success pattern
- **Type narrowing:** `in`, `typeof`, `instanceof`, type predicates
- **`as const`:** literal type inference for object/array values
- **Utility types:** `Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>`, `ReturnType<T>`

### Tailwind CSS

- **Utility-first philosophy:** why inline styles but not bad ones
- **Responsive design:** mobile-first, breakpoint prefixes
- **State variants:** `hover:`, `focus:`, `disabled:`, `dark:`
- **`cn()` / `clsx`:** conditional class merging pattern
- **Tailwind v4 changes:** CSS-first config, `@theme`, no `tailwind.config.js`

### Testing

- **Testing Library philosophy:** test behavior, not implementation
- **Query priority:** role > label > placeholder > text > testId
- **`userEvent` vs `fireEvent`:** why userEvent is almost always right
- **Async testing:** `waitFor`, `findBy*`, `act`
- **`renderHook`:** testing custom hooks in isolation
- **`msw`:** intercepting network requests at the service worker level
- **Playwright:** page object model, locators, assertions, waiting strategies

### State Management Patterns

- **Local state (`useState`):** when it's enough
- **Lifted state:** when multiple components need the same state
- **Context:** global UI state (theme, auth), not server cache
- **React Query (when introduced):** server state vs UI state distinction

### Performance

- **When `useMemo` / `useCallback` help vs hurt:** profiling first
- **`React.memo`:** preventing child re-renders, referential equality trap
- **Code splitting:** `React.lazy`, `Suspense`, route-level splitting
- **Bundle size:** why it matters for perceived performance

### Go → React Mental Model Shifts

| Go Concept        | React Equivalent                     | Key Shift                            |
| ----------------- | ------------------------------------ | ------------------------------------ |
| `struct`          | Props interface                      | Props are immutable in the component |
| Function call     | Component render                     | React decides when to call it        |
| `for` loop        | `Array.map()`                        | Declarative, returns new array       |
| `if err != nil`   | Error boundary + discriminated union | Errors propagate up the tree         |
| `context.Context` | React Context                        | Similar name, different mechanism    |
| `sync.Mutex`      | Not needed                           | React state updates are batched      |
| Goroutine         | `useEffect` + cleanup                | Side effects must be cancellable     |
| `interface`       | TypeScript `interface` / `type`      | Structural, not nominal              |
| Pointer receiver  | `useRef`                             | Mutable reference without re-render  |
| `defer`           | `useEffect` cleanup                  | Runs when component unmounts         |

---

If the user doesn't specify a topic, ask: "What React or TypeScript concept would you like to understand better?"

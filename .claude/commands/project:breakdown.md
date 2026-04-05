# Break Down an Epic Issue

Expand a parent epic into implementable child issues.

---

## Phase 1 — Load the Epic

```
gh issue view <N> --repo fzambone/pfm-ui-react
```

Extract: breakdown pattern, acceptance criteria, scope boundaries, dependencies.

Assess the existing codebase:

- Read relevant feature folders
- Check for existing components, hooks, or types that the new issues can build on
- Note the layer order: types → hooks → components → wiring

---

## Phase 2 — Expand Into Child Issues

Map each item in the epic's breakdown to a full issue. For each:

1. Distribute relevant acceptance criteria from the epic
2. Add edge cases specific to this UI layer
3. Set scope boundaries to avoid overlap

**Structure each child issue as:**

```markdown
## Context

Why this issue exists, what UI layer, how it fits.

## Depends On

- #{N} — what's needed

## What This Enables

- What this unlocks

## Acceptance Criteria

1. When {user action}, {observable outcome}.

## Edge Cases to Handle

- [ ] {edge case}

## Scope Boundaries

- No {exclusion}.
```

**Quality standards:**

- User-facing language: "When the user clicks X, Y happens"
- No code snippets
- Each issue independently verifiable in the browser
- Layer order: types → hooks → components → integration/wiring → E2E

---

## Phase 3 — Present for Review

Show the full table + full body of each issue. **Stop. Wait for approval.**

---

## Phase 4 — Create Issues

```
gh issue create --repo fzambone/pfm-ui-react \
  --title "{title}" --milestone "{milestone}" \
  --body "$(cat <<'EOF'
Parent epic: #{epic}

{full body}
EOF
)"
```

Create in dependency order. Update `Depends On` sections with real numbers.

---

## Phase 5 — Update the Epic

Append the child checklist to the epic body.

---

## Phase 6 — Report

```
Epic #N: {title}
Created {count} issues:
- #{A} — {title}
...

Dependency graph:
#{A} → #{B} → #{C}

Ready for /project:implement #{first_issue}.
```

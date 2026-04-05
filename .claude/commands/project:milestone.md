# Create a New Milestone

Plan and create a new GitHub milestone with an epic issue and fully broken-down child
issues. This skill is **conversational first** — it asks questions to get the milestone
right before touching GitHub.

---

## Phase 1 — Gather Information

Before proposing anything, ask the following questions **in a single message**:

```
I need to understand the milestone before drafting it. Please answer:

1. **Goal** — One sentence: what does this milestone deliver?
2. **Motivation** — Why now? What capability does it unlock?
3. **What it enables** — What becomes possible after this milestone?
4. **Depends on** — Which previous milestones or issues must be complete first?
5. **Scope** — What is explicitly IN scope? What is explicitly OUT of scope?
6. **Rough size** — Small (2–4 stories) or larger (5–10 stories)?
7. **Any constraints** — UX patterns, API contracts, or non-negotiables?
```

---

## Phase 2 — Determine the Milestone Number

```
gh api repos/fzambone/pfm-ui-react/milestones --jq '.[].number' | sort -n | tail -1
```

New milestone number = `max + 1`. Format: `M{N}: {Title}`.

---

## Phase 3 — Draft the Epic and Breakdown

### 3.1 Epic structure

```markdown
## Context
Two to four sentences: current state, gap, why this milestone addresses it.

## What This Enables
- Capability unlocked
- User experience improved
- Future milestone unblocked

## Depends On
- M{N} — reason

## Acceptance Criteria (Epic-Level)
1. When {user action}, {observable outcome}.
...

## Scope Boundaries
- No {thing excluded}.

**Action Required:** Break into {N} issues.

## Child Issues
(populated after creation)
```

### 3.2 Child issue structure

```markdown
Parent epic: #{epic_number}

## Context
Why this issue exists, which UI layer it operates in, how it fits the milestone.

## Depends On
- #{N} — what's needed

## What This Enables
- What this unlocks for the next issue

## Acceptance Criteria
1. When {user action}, {observable outcome}.
...

## Edge Cases to Handle
- [ ] {Edge case and expected behavior}

## Scope Boundaries
- No {thing excluded}.
```

### 3.3 Quality standards

**Behavioral, user-facing language:**
- GOOD: "When the user submits the login form with valid credentials, they are redirected to the dashboard"
- BAD: "Implement the LoginForm component with a POST to /api/auth/login"

**No code snippets** in issues. The implementer decides the shape.

**Each issue independently testable** — after completing N, a user can verify the behavior in the browser.

---

## Phase 4 — Present for Review

```
Milestone: M{N}: {Title}
Epic: {one-line summary}

| # | Title | Layer | Depends On | Key user-facing behavior |
|---|-------|-------|------------|--------------------------|
...
```

Show full body of every issue. **Stop. Wait for approval.**

---

## Phase 5 — Create

```
gh api repos/fzambone/pfm-ui-react/milestones --method POST \
  --field title="M{N}: {Title}" \
  --field description="{description}"

gh issue create --repo fzambone/pfm-ui-react \
  --title "{title}" --milestone "M{N}: {Title}" \
  --body "$(cat <<'EOF'
{body}
EOF
)"
```

Update epic with child checklist after all issues are created.

---

## Phase 6 — Report

```
Milestone: M{N}: {Title}
Epic:      #{N} — {title}
Issues:    {count} created

Child issues:
- #{A} — {title}
...

Ready for /project:implement #{first_issue}.
```

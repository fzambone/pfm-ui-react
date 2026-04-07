# pfm-go

Personal Finance Manager API — a Go backend for tracking household finances with multi-user support, double-entry bookkeeping, and role-based access control.

## What It Does

The API organizes finances around **Households** — shared financial spaces for families or couples. Every account, transaction, and balance belongs to a household. Members of a household collaborate with role-based permissions (Admin / Member).

**Domains:**

| Domain                   | Responsibility                                                   |
| ------------------------ | ---------------------------------------------------------------- |
| **Users**                | Registration, authentication, profile management                 |
| **Households**           | Shared financial spaces with role-based membership               |
| **Accounts**             | Checking, savings, credit card, and investment accounts          |
| **Ledger**               | Double-entry bookkeeping — the authoritative source for balances |
| **Credit Card Settings** | Billing cycle and credit limit configuration                     |

## API

**Live:** `https://pfm-go-api.fly.dev`

| Resource                 | URL                        |
| ------------------------ | -------------------------- |
| Interactive docs (Redoc) | `GET /docs`                |
| OpenAPI spec (YAML)      | `GET /api/v1/openapi.yaml` |
| Health                   | `GET /healthz`             |

### Authentication

PASETO v4 tokens. Get a token with `POST /auth/login`, then pass it as `Authorization: Bearer <token>` on every protected request.

### Endpoints at a Glance

```
POST   /auth/login

POST   /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
PUT    /api/v1/users/{id}/password
DELETE /api/v1/users/{id}

POST   /api/v1/households
GET    /api/v1/households
GET    /api/v1/households/{id}
PUT    /api/v1/households/{id}
DELETE /api/v1/households/{id}
POST   /api/v1/households/{id}/members
DELETE /api/v1/households/{id}/members/{user_id}

POST   /api/v1/households/{id}/accounts
GET    /api/v1/households/{id}/accounts
GET    /api/v1/households/{id}/accounts/{account_id}
PUT    /api/v1/households/{id}/accounts/{account_id}/name
PUT    /api/v1/households/{id}/accounts/{account_id}/balance
DELETE /api/v1/households/{id}/accounts/{account_id}

POST   /api/v1/households/{id}/accounts/{account_id}/credit-card-settings
GET    /api/v1/households/{id}/accounts/{account_id}/credit-card-settings
PUT    /api/v1/households/{id}/accounts/{account_id}/credit-card-settings/closing-day
PUT    /api/v1/households/{id}/accounts/{account_id}/credit-card-settings/due-day
PUT    /api/v1/households/{id}/accounts/{account_id}/credit-card-settings/limit
DELETE /api/v1/households/{id}/accounts/{account_id}/credit-card-settings

POST   /api/v1/households/{id}/transactions
GET    /api/v1/households/{id}/transactions
GET    /api/v1/households/{id}/accounts/{account_id}/balance
```

## Domains

### Users

Users are the people who use the app. A user has an email, display name, and a hashed password — no plain-text credentials are stored or returned. Users are not tied to any household at creation; they join households separately.

**What users can do:**

- Register with email + display name + password
- Log in to get a PASETO token
- Update their display name
- Change their password (requires current password)
- Deactivate their account (soft delete — reversible)

**Frontend features this powers:**

- Registration and login screens
- Profile settings page (display name, password change)
- Account deletion flow

**Notes for the frontend:**

- The token returned by `POST /auth/login` must be stored client-side and attached to every subsequent request as `Authorization: Bearer <token>`. On token expiry (or any `401` response), redirect to login.
- `DELETE /api/v1/users/{id}` is a deactivation, not a hard delete. The user cannot log in again after deactivation, but their data remains in the system.
- All `PUT` requests require sending the current `version` field back. Fetch the user first, hold the version, and pass it on save. A `409` means someone else (or another tab) modified the user concurrently — re-fetch and prompt the user.

---

### Households

A household is the central organizing unit of the app. Every account and transaction belongs to a household. A user can belong to multiple households (e.g., personal finances and family finances).

**Membership roles:**

| Role     | Can do                                                                                |
| -------- | ------------------------------------------------------------------------------------- |
| `ADMIN`  | Everything: rename household, add/remove members, promote roles, deactivate household |
| `MEMBER` | Read all household data, post transactions, update account balances                   |

The user who creates a household automatically becomes its first `ADMIN`.

**What households support:**

- Create a household (creator becomes admin)
- List all households the authenticated user belongs to
- Rename a household (admin only)
- Add a member by user ID, with a role (admin only)
- Remove a member (admin only)
- Deactivate the household (admin only)

**Frontend features this powers:**

- Household selector / switcher (user belongs to many households)
- Household settings page (rename, manage members)
- Invite member flow (enter user ID or email, assign role)
- Member list with role badges and remove action

**Notes for the frontend:**

- The household ID is required in the URL path for every account and transaction request. The frontend should keep the active household ID in application state (context or URL param) after the user selects one.
- A `403` on household endpoints means either: (a) the user is not a member at all, or (b) the user is a `MEMBER` attempting an admin-only action. The UI should hide admin controls for non-admin members rather than letting them fail.
- `GET /api/v1/households` returns only the households where the authenticated user is an active member. Use this to build the household switcher on load.

---

### Accounts

Accounts represent real financial accounts owned by a household. The balance on an account reflects the sum of all ledger entries against it — it is not stored independently (except for direct balance adjustments during manual reconciliation).

**Account types:**

| Type          | Typical use                                    |
| ------------- | ---------------------------------------------- |
| `CHECKING`    | Day-to-day spending account                    |
| `SAVINGS`     | Savings or emergency fund                      |
| `CREDIT_CARD` | Credit card (paired with credit card settings) |
| `INVESTMENT`  | Brokerage, pension, or investment fund         |

**Supported currencies:** `USD`, `BRL`, `EUR`

**What accounts support:**

- Create an account with type and currency (initial balance = 0)
- List all active accounts in a household
- Rename an account (name must be unique within the household)
- Set balance directly (for initial setup or reconciliation)
- Deactivate an account

**Frontend features this powers:**

- Account list / dashboard showing all accounts with current balances
- "Add account" flow (type selector, currency selector, name)
- Account detail page (name, type, currency, balance, transaction history)
- Rename and deactivate actions in account settings
- Balance reconciliation (manual balance override)

**Notes for the frontend:**

- **Balance is in minor units (cents).** `balance: 150000` for a USD account means $1,500.00. Always divide by 100 for display and multiply by 100 when sending a balance update.
- The `PUT .../balance` endpoint is for manual reconciliation only — setting the balance to match a bank statement. For day-to-day money movement, use the Ledger.
- Credit card accounts should prompt the user to configure credit card settings after creation (closing day, due day, credit limit).
- Deactivating an account hides it from the account list but preserves all its transaction history.

---

### Credit Card Settings

Credit card settings are additional configuration for accounts with `account_type: "CREDIT_CARD"`. They store the billing cycle (closing day, due day) and the credit limit. There is exactly one settings record per credit card account.

**What credit card settings support:**

- Create settings for a credit card account (once)
- Read settings
- Update closing day independently
- Update due day independently
- Update credit limit independently
- Delete settings (if the card is reconfigured or deactivated)

**Frontend features this powers:**

- Credit card setup flow shown after creating a `CREDIT_CARD` account
- Credit card settings panel within account detail
- Credit limit display alongside current balance (used/available calculation)
- Billing cycle display (e.g., "Closes on the 15th, due on the 22nd")

**Notes for the frontend:**

- The credit limit (`limit_amount`) is also in minor units (cents).
- Each setting (closing day, due day, limit) has its own `PUT` endpoint. When the user changes only one field, call only that endpoint — don't send a full update.
- Every update endpoint requires the current `version`. Since three separate fields can each be updated independently, always read settings fresh before presenting the edit form.
- `closing_day` and `due_day` are integers from 1 to 31. The UI should validate this range before submitting.

---

### Ledger

The ledger is the source of truth for all money movement. It uses **double-entry bookkeeping**: every transaction records where money came from and where it went. A salary deposit, for example, debits your checking account and credits an income account. A grocery purchase debits your checking account and credits your expenses account.

**Rules:**

- Every transaction must have at least two entries.
- Total debit amount must exactly equal total credit amount (balanced entries).
- Transactions are **immutable** — once posted, they cannot be updated or deleted.
- Amounts in entries are always positive integers; the `entry_type` (`DEBIT` or `CREDIT`) determines direction.

**What the ledger supports:**

- Post a balanced transaction with one or more entries
- Get the current balance of an account (computed from all entries)
- Get transaction history for a household, optionally filtered by account, with pagination

**Frontend features this powers:**

- Transaction entry form (description, date, debit/credit entries with amounts)
- Transaction history list per account or household-wide
- Account balance display (fetched from ledger, not stored separately)
- Future: category tagging, budget tracking, monthly summaries

**Notes for the frontend:**

- The UI does not need to expose double-entry directly to the user. A simpler "transfer from → to" form, or "expense from account", can construct the correct debit/credit entries behind the scenes.
- `transaction_date` is a date string (`YYYY-MM-DD`), not a timestamp. This is the business date (when the transaction happened), not when it was recorded.
- Transaction history is paginated via `?offset=0&limit=20`. Implement infinite scroll or page controls — do not fetch all records at once.
- The `GET .../accounts/{account_id}/balance` endpoint computes balance from all ledger entries. Call this when displaying an account rather than relying on a cached value from the accounts list.
- A `422 Unprocessable Entity` means the entries are not balanced. The form should validate that debits equal credits before submitting.

---

## Key Design Decisions

**Money as integers.** All monetary values are `int64` in minor units (cents for USD/EUR, centavos for BRL). `$10.50 = 1050`. No floats, no rounding errors.

**Double-entry bookkeeping.** Every transaction has balanced entries: total debits must equal total credits. Transactions are immutable once posted — no updates or deletes.

**Optimistic concurrency.** Mutable entities carry a `version` field. `PUT` requests must include the current version; a mismatch returns `409 Conflict`.

**Soft deletes.** Nothing is hard-deleted. Entities have a `status` field (`ACTIVE` / `INACTIVE`). Deactivation is idempotent.

**Household guard.** All financial data is scoped to a household. The middleware verifies membership before the request reaches the domain. Admins can manage members and settings; members can read and post transactions.

## Tech Stack

| Concern     | Choice                                 |
| ----------- | -------------------------------------- |
| Language    | Go 1.25                                |
| Database    | PostgreSQL 18                          |
| Migrations  | goose v3                               |
| SQL codegen | sqlc                                   |
| Auth tokens | PASETO v4                              |
| Logging     | `log/slog` (structured JSON)           |
| Tracing     | OpenTelemetry (manual instrumentation) |
| Deployment  | Fly.io                                 |

## Running Locally

**Prerequisites:** Go 1.25+, Docker (for the database)

```bash
# Start the database
make up

# Run migrations
make migrate

# Start the API
make run
```

The API listens on `http://localhost:8080` by default.

**Configuration** is via environment variables — see `internal/platform/config/` for the full list. Required:

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                        |
| `PASETO_KEY`   | 32-byte hex-encoded symmetric key for PASETO tokens |
| `TOKEN_TTL`    | Token lifetime (e.g., `24h`)                        |

## Development

```bash
make test          # unit tests
make lint          # golangci-lint
make build         # compile
make ci            # lint + test + build (full gate)
make generate      # regenerate sqlc types and OpenAPI spec
```

**Architecture:** Hexagonal (Ports & Adapters). Domain packages have zero infrastructure imports. All wiring in `cmd/pfm/main.go`.

```
cmd/pfm/              → main.go (composition root)
internal/
  domain/             → pure business logic (household/, account/, ledger/, user/)
  port/               → shared interface definitions
  adapter/            → postgres, auth, http handlers
  middleware/         → authn, authz, logging, tracing
  platform/           → config, clock, money, validate, database
  message/            → all error messages and log strings
db/
  migrations/         → goose SQL migrations
  queries/            → sqlc SQL queries
```

## Related Repositories

| Repo                                                     | Purpose                                             |
| -------------------------------------------------------- | --------------------------------------------------- |
| [pfm-ui-react](https://github.com/fzambone/pfm-ui-react) | React/TypeScript frontend                           |
| [pfm-infra](https://github.com/fzambone/pfm-infra)       | Terraform infrastructure (Cloudflare DNS, WAF, TLS) |

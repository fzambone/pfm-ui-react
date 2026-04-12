# PFM API Reference

The backend is a personal finance manager API built in Go with hexagonal architecture.
Live API: **`https://pfm-go-api.fly.dev`** (custom domain `https://pfm-go-api.zambone.dev` after M1 infra migration).

Interactive docs: `GET /docs` — fetch the machine-readable spec at `GET /api/v1/openapi.yaml` before writing any integration code.

---

## What the Backend Does

The API manages personal finances organized around **Households** — shared financial spaces (e.g., a family or couple). All financial data (accounts, transactions) belongs to a household.

**Core domains:**

| Domain                   | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| **Users**                | Registration, profile, authentication                       |
| **Households**           | Shared financial space; role-based membership               |
| **Accounts**             | Checking, savings, credit card, investment accounts         |
| **Ledger**               | Double-entry bookkeeping — the source of truth for balances |
| **Credit Card Settings** | Billing cycle and limit configuration for card accounts     |

---

## Authentication

The API uses **PASETO v4 tokens** — modern authenticated encryption, not JWTs.

### Get a token

```
POST /auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secure_password" }
```

Response:

```json
{ "token": "v4.local.Abc123...", "expires_at": "2026-04-06T12:00:00Z" }
```

### Use the token

Every protected endpoint requires the token in the `Authorization` header:

```
Authorization: Bearer v4.local.Abc123...
```

### How to handle it in the frontend

```typescript
// Store token after login
const { token, expires_at } = await login(email, password);
localStorage.setItem('auth_token', token);
localStorage.setItem('auth_expires_at', expires_at);

// Attach to every request
function authHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Check expiry before a request
function isTokenExpired(): boolean {
  const exp = localStorage.getItem('auth_expires_at');
  return !exp || new Date(exp) <= new Date();
}
```

Token failures return `401 Unauthorized`. Redirect to `/login` on any 401 — do not retry with the same token.

---

## Money: Always Cents, Never Floats

**All monetary values in the API are integers in minor units** (cents for USD/EUR, centavos for BRL).

| Display   | Wire value |
| --------- | ---------- |
| $10.50    | `1050`     |
| $1,000.00 | `100000`   |
| R$99.99   | `9999`     |

```typescript
// Utility functions — put these in src/shared/utils/money.ts

/** Converts minor units (cents) from the API to a display string */
export function formatMoney(
  cents: number,
  currency: 'USD' | 'BRL' | 'EUR',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

/** Converts a user-entered decimal string to minor units for the API */
export function toMinorUnits(displayValue: string): number {
  return Math.round(parseFloat(displayValue) * 100);
}
```

Never convert to float for calculations — always work in integers.

---

## Optimistic Concurrency (version field)

Mutable entities (User, Household, Account, Credit Card Settings) carry a `version` field. Every `PUT` request **must** include the current version. If another client modified the entity between your `GET` and `PUT`, the API returns `409 Conflict`.

```typescript
// Correct update flow
const account = await getAccount(householdId, accountId);

// user edits name...

await updateAccountName(householdId, accountId, {
  name: newName,
  version: account.version, // always pass this back
});
```

Handle 409 by re-fetching the latest version and showing a conflict message to the user.

---

## Endpoints

### Health (no auth)

| Method | Path            | Returns                                |
| ------ | --------------- | -------------------------------------- |
| `GET`  | `/healthz`      | `{ "status": "ok", "version": "..." }` |
| `GET`  | `/health/live`  | Kubernetes liveness probe              |
| `GET`  | `/health/ready` | Kubernetes readiness probe             |

---

### Users

| Method   | Path                          | Auth   | Notes              |
| -------- | ----------------------------- | ------ | ------------------ |
| `POST`   | `/api/v1/users`               | None   | Register           |
| `GET`    | `/api/v1/users/{id}`          | Bearer |                    |
| `PUT`    | `/api/v1/users/{id}`          | Bearer | Requires `version` |
| `PUT`    | `/api/v1/users/{id}/password` | Bearer | Requires `version` |
| `DELETE` | `/api/v1/users/{id}`          | Bearer | Soft-deactivates   |

**Register:**

```json
POST /api/v1/users
{ "email": "user@example.com", "display_name": "Jane Doe", "password": "secure_password" }
→ 201 { "id": "...", "email": "...", "display_name": "...", "version": 1, "created_at": "...", "updated_at": "..." }
```

**Update profile:**

```json
PUT /api/v1/users/{id}
{ "display_name": "Jane Smith", "version": 1 }
→ 200 { ...user with version: 2 }
```

**Change password:**

```json
PUT /api/v1/users/{id}/password
{ "old_password": "old", "new_password": "new_secure_password", "version": 1 }
→ 200 { ...user with incremented version }
```

---

### Households

| Method   | Path                                        | Auth   | Guard  | Notes                     |
| -------- | ------------------------------------------- | ------ | ------ | ------------------------- |
| `POST`   | `/api/v1/households`                        | Bearer | —      | Creator becomes ADMIN     |
| `GET`    | `/api/v1/households`                        | Bearer | —      | Lists caller's households |
| `GET`    | `/api/v1/households/{id}`                   | Bearer | Member |                           |
| `PUT`    | `/api/v1/households/{id}`                   | Bearer | Admin  | Requires `version`        |
| `DELETE` | `/api/v1/households/{id}`                   | Bearer | Admin  | Soft-deactivates          |
| `POST`   | `/api/v1/households/{id}/members`           | Bearer | Admin  |                           |
| `DELETE` | `/api/v1/households/{id}/members/{user_id}` | Bearer | Admin  |                           |

**Create household:**

```json
POST /api/v1/households
{ "name": "Smith Family" }
→ 201 { "id": "...", "name": "Smith Family", "status": "ACTIVE", "version": 1, ... }
```

**Add member:**

```json
POST /api/v1/households/{id}/members
{ "user_id": "...", "role": "MEMBER" }   // role: "ADMIN" | "MEMBER"
→ 201 { "household_id": "...", "user_id": "...", "role": "MEMBER", "invited_by": "...", "joined_at": "..." }
```

**Authorization guards:**

- `403 Forbidden` — authenticated user is not a household member
- `403 Forbidden` — operation requires ADMIN role but caller is MEMBER

---

### Accounts

All account endpoints are scoped to a household: `/api/v1/households/{household_id}/accounts`.
All require Bearer auth + household membership.

| Method   | Path                        | Admin? | Notes                                  |
| -------- | --------------------------- | ------ | -------------------------------------- |
| `POST`   | `.../accounts`              | No     | Initial balance = 0                    |
| `GET`    | `.../accounts`              | No     | Active accounts only                   |
| `GET`    | `.../accounts/{id}`         | No     |                                        |
| `PUT`    | `.../accounts/{id}/name`    | No     | Requires `version`                     |
| `PUT`    | `.../accounts/{id}/balance` | No     | Direct balance set; requires `version` |
| `DELETE` | `.../accounts/{id}`         | No     | Soft-deactivates                       |

**Account types:** `CHECKING` | `SAVINGS` | `CREDIT_CARD` | `INVESTMENT`
**Currency codes:** `USD` | `BRL` | `EUR`

**Create account:**

```json
POST /api/v1/households/{household_id}/accounts
{ "name": "Main Checking", "account_type": "CHECKING", "currency_code": "USD" }
→ 201 {
  "id": "...", "household_id": "...", "name": "Main Checking",
  "account_type": "CHECKING", "currency_code": "USD",
  "balance": 0, "status": "ACTIVE", "version": 1, ...
}
```

**Set balance** (manual reconciliation):

```json
PUT /api/v1/households/{household_id}/accounts/{id}/balance
{ "balance": 150000, "version": 1 }   // 150000 cents = $1,500.00
→ 200 { ...account with updated balance and version: 2 }
```

Note: For day-to-day transactions, use the Ledger endpoints — they update balances atomically. The balance endpoint is for initial setup and manual reconciliation.

---

### Credit Card Settings

Only for accounts with `account_type: "CREDIT_CARD"`. One-to-one with the account.
Base path: `/api/v1/households/{household_id}/accounts/{account_id}/credit-card-settings`

| Method   | Path                                   | Notes                     |
| -------- | -------------------------------------- | ------------------------- |
| `POST`   | `.../credit-card-settings`             | Create (once per account) |
| `GET`    | `.../credit-card-settings`             |                           |
| `PUT`    | `.../credit-card-settings/closing-day` | Requires `version`        |
| `PUT`    | `.../credit-card-settings/due-day`     | Requires `version`        |
| `PUT`    | `.../credit-card-settings/limit`       | Requires `version`        |
| `DELETE` | `.../credit-card-settings`             | Soft-deletes              |

**Create settings:**

```json
POST .../credit-card-settings
{
  "closing_day": 15,       // billing cycle closes on the 15th
  "due_day": 22,           // payment due on the 22nd
  "limit_amount": 1000000  // cents: 1000000 = $10,000.00 limit
}
→ 201 { "id": "...", "account_id": "...", "closing_day": 15, "due_day": 22, "limit_amount": 1000000, "version": 1, ... }
```

---

### Ledger (Transactions & Balances)

The ledger uses **double-entry accounting**: every transaction has entries where total debits must equal total credits. Transactions are **immutable** — never updated or deleted.

Base path: `/api/v1/households/{household_id}`

| Method | Path                                | Notes                                    |
| ------ | ----------------------------------- | ---------------------------------------- |
| `POST` | `.../transactions`                  | Post a balanced transaction              |
| `GET`  | `.../transactions`                  | Paginated history; filterable by account |
| `GET`  | `.../accounts/{account_id}/balance` | Current balance from ledger              |

**Post a transaction:**

```json
POST /api/v1/households/{household_id}/transactions
{
  "description": "Grocery shopping",
  "transaction_date": "2026-04-05",  // YYYY-MM-DD
  "entries": [
    { "account_id": "...", "entry_type": "DEBIT",  "amount": 8750 },  // $87.50 out of checking
    { "account_id": "...", "entry_type": "CREDIT", "amount": 8750 }   // must balance
  ]
}
→ 201 { "id": "...", "description": "...", "transaction_date": "2026-04-05", "entries": [...] }
```

Unbalanced entries return `422 Unprocessable Entity`.

**Get account balance from ledger:**

```json
GET /api/v1/households/{household_id}/accounts/{account_id}/balance
→ 200 { "account_id": "...", "balance": 550000 }  // cents
```

**Get transaction history (paginated):**

```
GET /api/v1/households/{household_id}/transactions?offset=0&limit=20
GET /api/v1/households/{household_id}/transactions?account_id={id}&offset=0&limit=20
```

---

## HTTP Status Codes

| Code  | Meaning               | When to see it                                         |
| ----- | --------------------- | ------------------------------------------------------ |
| `200` | OK                    | Successful GET or update                               |
| `201` | Created               | Resource created                                       |
| `204` | No Content            | Successful deletion                                    |
| `400` | Bad Request           | Malformed JSON, invalid UUID, missing required field   |
| `401` | Unauthorized          | Missing/expired/invalid token, wrong credentials       |
| `403` | Forbidden             | Not a household member, or needs ADMIN role            |
| `404` | Not Found             | Resource doesn't exist                                 |
| `409` | Conflict              | Version mismatch (optimistic locking), duplicate name  |
| `422` | Unprocessable Entity  | Business rule violation (e.g., unbalanced transaction) |
| `500` | Internal Server Error | Unexpected server error                                |

**Error response shape:**

```json
{ "error": "descriptive message here" }
```

**Validation error shape:**

```json
{
  "error": "validation failed",
  "fields": {
    "email": ["is required"],
    "password": ["must be at least 8 characters"]
  }
}
```

---

## Frontend Integration Patterns

### API client structure

Put API functions in `src/features/<domain>/api/`. Each file handles one resource:

```
src/features/
  auth/api/
    login.ts          → POST /auth/login
  household/api/
    households.ts     → CRUD for /api/v1/households
    members.ts        → membership endpoints
  account/api/
    accounts.ts       → CRUD for /api/v1/households/:id/accounts
    balance.ts        → balance endpoint
  ledger/api/
    transactions.ts   → POST/GET /api/v1/households/:id/transactions
```

### Base fetch wrapper

```typescript
// src/shared/utils/api.ts

// In dev, Vite proxies /auth, /api, and /health to the remote API server-side,
// so there are no CORS issues and no remote origin needed here.
// In production, VITE_API_URL is empty and paths are relative to the deployed host.
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export type ApiError = { error: string; fields?: Record<string, string[]> };
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError; status: number };

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return { ok: true, data: undefined as T };
  }

  const body: unknown = await response.json();

  if (!response.ok) {
    return { ok: false, error: body as ApiError, status: response.status };
  }

  return { ok: true, data: body as T };
}
```

### Handling 401 globally

```typescript
// In your auth context or router:
// If any request returns 401, clear token and redirect to /login.

if (!result.ok && result.status === 401) {
  localStorage.removeItem('auth_token');
  navigate('/login');
}
```

### Handling 409 (version conflict)

```typescript
const result = await updateAccountName(householdId, accountId, {
  name,
  version,
});

if (!result.ok && result.status === 409) {
  // Re-fetch the account to get the latest version, show user a message
  await refetch();
  showToast('Someone else updated this account — please review and try again.');
  return;
}
```

### Displaying money

```typescript
// src/shared/utils/money.ts
export type CurrencyCode = 'USD' | 'BRL' | 'EUR';

export function formatMoney(cents: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

// Usage in component:
// formatMoney(account.balance, account.currency_code)
// → "$1,500.00" for USD, "R$1.500,00" for BRL
```

---

## Environment Variables

| Variable       | Description                                               | Default |
| -------------- | --------------------------------------------------------- | ------- |
| `VITE_API_URL` | Backend base URL — leave empty in dev (proxy handles it)  | `""`    |

**Local development:** do not set `VITE_API_URL`. The Vite dev server proxies `/auth`, `/api`, and `/health` to `https://pfm-go-api.fly.dev` server-side, so no CORS headers are needed and no remote origin is sent from the browser.

**Production:** `VITE_API_URL` should remain unset if the frontend and API share the same domain, or be set to the API's full origin if they are on separate domains (which requires CORS to be configured on the backend to allow the frontend's domain).

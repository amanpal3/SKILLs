# Code Standards — Tony Stark's Coding Bible

> *"The suit is only as good as the engineer inside it."*  
> Read this before every coding sprint. Non-negotiable.

---

## 1. Naming

| Element | Convention | Example |
|---|---|---|
| Variables | camelCase | `userOrderList` |
| Functions | camelCase, verb-first | `getUserOrders()` |
| Classes | PascalCase | `OrderService` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Files | kebab-case | `user-service.js` |
| DB Tables | snake_case, plural | `user_orders` |
| DB Columns | snake_case | `created_at` |
| CSS Classes | BEM or kebab | `card__title--active` |
| Env Vars | SCREAMING_SNAKE | `DATABASE_URL` |

---

## 2. Function Rules

```js
// ✅ One responsibility — clear name — early returns — typed
async function getUserById(userId: string): Promise<User | null> {
  if (!userId) return null;

  const user = await db.users.findUnique({ where: { id: userId } });
  if (!user) return null;

  return user;
}

// ❌ Multiple responsibilities — vague name — no types — no error handling
async function handle(id) {
  let u = await db.query(`SELECT * FROM users WHERE id = ${id}`);
  sendEmail(u.email);
  return u;
}
```

### Rules
- Max **30 lines** per function. Split beyond this.
- Max **3 levels** of nesting. Flatten with early returns.
- Every function has a **docstring** explaining what, why, and params.
- Every **async function** has try/catch or .catch() - no unhandled rejections.
- Every function that can fail **returns a typed result** (Result<T, E> or null).

---

## 3. Error Handling

```js
// ✅ Structured, contextual, propagated correctly
try {
  const order = await orderService.create(payload);
  return { success: true, data: order };
} catch (error) {
  logger.error('Order creation failed', {
    userId: payload.userId,
    error: error.message,
    stack: error.stack
  });
  throw new AppError('ORDER_CREATE_FAILED', 'Could not place order', 500);
}

// ❌ Swallowed silently
try {
  const order = await orderService.create(payload);
} catch (e) {}
```

### AppError Class (always use)
```js
class AppError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(userMessage);
    this.name = 'AppError';
  }
}
```

---

## 4. TypeScript Standards

```ts
// ✅ Explicit types — no any — interfaces over types for objects
interface CreateUserPayload {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'viewer';
}

async function createUser(payload: CreateUserPayload): Promise<User> {
  // implementation
}

// ❌ Lazy typing defeats the purpose of TypeScript
async function createUser(payload: any): Promise<any> {}
```

### Rules
- **No `any`** — use `unknown` then narrow, or define the type
- **Interfaces** for objects passed between functions
- **Enums or union types** for fixed value sets
- **Generics** for reusable utilities
- All **API response types** must be defined and exported

---

## 5. Comments

```js
// ✅ Explains WHY — not WHAT (code shows what)
// Using bcrypt with cost 12 — below 10 is too fast for brute force
const hash = await bcrypt.hash(password, 12);

// ❌ Redundant — we can see it's bcrypt.hash
// Hashing the password with bcrypt
const hash = await bcrypt.hash(password, 12);
```

### When to Comment
- **Why a non-obvious decision was made** (security, performance, business rule)
- **Workarounds** for known bugs or external API quirks
- **Complex algorithms** — explain the approach, not the syntax
- **TODO/FIXME** — always include ticket reference: `// TODO: PROJ-234 — add rate limit`

---

## 6. File Organization

```
src/
├── api/           ← Route handlers (thin — delegate to services)
├── services/      ← Business logic (no DB or HTTP here)
├── repositories/  ← DB access only (no business logic)
├── middleware/    ← Auth, validation, error handling
├── models/        ← DB schema / ORM models
├── utils/         ← Pure functions, shared helpers
├── config/        ← Environment, constants, feature flags
└── types/         ← Shared TypeScript interfaces
```

### Layer Rules
- **API layer**: Parse request → call service → return response. No logic.
- **Service layer**: Business rules, orchestration. No DB queries directly.
- **Repository layer**: DB queries only. Returns domain objects, not raw DB rows.

---

## 7. Constants vs Hardcoding

```js
// ❌ Magic numbers everywhere
setTimeout(fn, 86400000);
if (retries > 3) { ... }
const url = 'https://api.example.com/v1';

// ✅ Named constants — searchable, refactorable
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = process.env.API_BASE_URL;

setTimeout(fn, ONE_DAY_MS);
if (retries > MAX_RETRY_COUNT) { ... }
const url = `${API_BASE_URL}/users`;
```

---

## 8. Code Review Checklist (Tony Stark's Gate)

Before any code is merged, verify:

```
TONY STARK CODE REVIEW GATE
============================
[ ] Functions < 30 lines and single-responsibility
[ ] All async code has error handling
[ ] No `any` type in TypeScript
[ ] No hardcoded secrets, URLs, or magic numbers
[ ] Console.log removed (use logger)
[ ] All edge cases handled (null, empty, zero, error)
[ ] Naming is clear — no abbreviations (usr, tmp, val)
[ ] No duplicate logic — DRY enforced
[ ] New code has corresponding unit test
[ ] API response follows standard format

VERDICT: [APPROVED / REQUEST CHANGES]
```

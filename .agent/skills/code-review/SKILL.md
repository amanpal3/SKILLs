---
name: code-review
description: Reviews code like a senior software engineer. Improves readability, maintainability, performance, and scalability. Detects bugs, security risks, and bad practices. Use when the user asks to review, audit, improve, or refactor any code.
---

# Code Review — Senior Engineer Intelligence

## When to Use This Skill
- User asks to review, audit, or critique code
- User wants to refactor or clean up existing code
- Checking code for bugs, security issues, or bad practices
- Before a pull request or code merge
- Evaluating code quality of a new codebase or file

---

## 1. Core Principles

> **Rule**: Prioritize correctness → security → readability → performance. In that order.

- **Clarity over cleverness** — Code is read 10x more than it's written
- **DRY** — Don't Repeat Yourself; duplicate logic = future bug waiting to happen
- **KISS** — Keep It Simple, Stupid; simple solutions scale better
- **YAGNI** — You Aren't Gonna Need It; don't build for hypothetical futures
- **Single Responsibility** — Every function/class does one thing, and does it well
- **Fail fast** — Surface errors early; don't silently swallow failures
- **Optimize last** — Correct and readable first, performant second

---

## 2. Code Quality Checklist

### Readability
- [ ] Code is understandable at first glance (no mental gymnastics needed)
- [ ] Proper indentation and consistent formatting (use a linter/formatter)
- [ ] No unnecessary complexity or over-abstraction
- [ ] Comments explain **why**, not **what** (code explains what)
- [ ] No commented-out dead code left behind

### Structure
- [ ] Functions are small and focused (Single Responsibility Principle)
- [ ] Logical file and module organization (related things live together)
- [ ] Nesting depth ≤ 3 levels (flatten with early returns or extraction)
- [ ] No god objects/functions (>200 lines = red flag)

### Reusability
- [ ] No duplicate logic (DRY enforced)
- [ ] Reusable helpers/utilities extracted into their own modules
- [ ] Proper abstraction — not too low (copy-paste), not too high (over-engineered)

### Maintainability
- [ ] No hardcoded magic values (use named constants or config)
- [ ] Consistent coding style across the file/project
- [ ] Logic is easy to modify without breaking other things (low coupling)
- [ ] Dependencies are explicit, not hidden

---

## 3. Naming Conventions

> Good names are the cheapest form of documentation.

### Variables — Use nouns, be descriptive
```js
// ❌ Bad
let x = 5;
let data = [];
let flag = true;

// ✅ Good
let retryCount = 5;
let userOrders = [];
let isEmailVerified = true;
```

### Functions — Use action verbs
```js
// ❌ Bad
function userData() {}
function check() {}

// ✅ Good
function getUserData() {}
function validateEmailFormat() {}
function calculateOrderTotal() {}
```

### Booleans — Prefix with `is`, `has`, `can`, `should`
```js
// ❌ Bad
let active = true;
let permission = false;

// ✅ Good
let isActive = true;
let hasWritePermission = false;
let canDeletePost = false;
```

### Classes — Use nouns (PascalCase)
```js
// ❌ Bad
class manage() {}

// ✅ Good
class UserManager {}
class PaymentService {}
class OrderRepository {}
```

### Constants — SCREAMING_SNAKE_CASE
```js
const MAX_RETRY_LIMIT = 3;
const DEFAULT_PAGE_SIZE = 20;
const API_BASE_URL = "https://api.example.com";
```

---

## 4. Performance Optimization

### Algorithmic Efficiency
- Prefer O(1) lookups with Maps/Sets over O(n) array `.find()` or `.includes()`
- Avoid nested loops on large datasets (O(n²) = danger)
- Cache repeated expensive calculations (memoization)

```js
// ❌ O(n) lookup every time
const user = users.find(u => u.id === targetId);

// ✅ O(1) lookup with a Map
const userMap = new Map(users.map(u => [u.id, u]));
const user = userMap.get(targetId);
```

### Async & I/O
- Avoid blocking the event loop (use `async/await`, not sync file reads)
- Parallelize independent async operations with `Promise.all()`
- Avoid N+1 query problems (batch DB calls, use joins)

```js
// ❌ Sequential (slow)
for (const id of userIds) {
  const user = await db.getUser(id);
}

// ✅ Parallel (fast)
const users = await Promise.all(userIds.map(id => db.getUser(id)));
```

### Resource Management
- Lazy load heavy resources (images, large modules)
- Debounce/throttle high-frequency event handlers (scroll, resize, keypress)
- Minimize API/database calls (cache responses where appropriate)
- Avoid memory leaks — clean up event listeners, subscriptions, timers

---

## 5. Security Checks

> Security is non-negotiable. Review every user-facing input path.

### Input Validation & Sanitization
- [ ] All user inputs validated server-side (never trust client-side only)
- [ ] Inputs sanitized before use in DB queries, HTML output, or shell commands

### Common Vulnerabilities
| Vulnerability | What to Check |
|---|---|
| **SQL Injection** | Are queries using parameterized statements / ORM? |
| **XSS** | Is user content escaped before rendering to HTML? |
| **CSRF** | Are state-changing endpoints protected by tokens? |
| **IDOR** | Does the code verify resource ownership before access? |
| **Path Traversal** | Are file paths validated and confined to safe directories? |
| **ReDoS** | Are regex patterns safe from catastrophic backtracking? |

### Secrets & Credentials
- [ ] No API keys, passwords, or tokens hardcoded in source
- [ ] Secrets loaded from environment variables or secrets manager
- [ ] `.env` files are gitignored
- [ ] No sensitive data logged to console or error messages

### Auth Checks
- [ ] Authentication verified before accessing protected routes
- [ ] Authorization checks per resource (not just "is logged in")
- [ ] Tokens have expiry; refresh tokens are rotated on use

```js
// ❌ Dangerous — SQL injection risk
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Safe — parameterized query
const query = `SELECT * FROM users WHERE email = $1`;
db.query(query, [email]);
```

---

## 6. Clean Code Patterns

### Early Returns (Avoid nesting)
```js
// ❌ Deep nesting — hard to read
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // actual logic here
      }
    }
  }
}

// ✅ Early returns — flat and readable
function processOrder(order) {
  if (!order) return;
  if (order.items.length === 0) return;
  if (!order.isPaid) return;

  // actual logic here
}
```

### Avoid Magic Numbers
```js
// ❌ Magic number
if (status === 3) { ... }
setTimeout(fn, 86400000);

// ✅ Named constant
const STATUS_SHIPPED = 3;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

if (status === STATUS_SHIPPED) { ... }
setTimeout(fn, ONE_DAY_MS);
```

### Prefer Composition over Inheritance
```js
// ❌ Deep inheritance chains are rigid
class Animal { ... }
class Dog extends Animal { ... }
class GuideDog extends Dog { ... }

// ✅ Composable behaviors
const canBark = (state) => ({ bark: () => `${state.name} says woof!` });
const canGuide = (state) => ({ guide: () => `${state.name} is guiding` });
const createGuideDog = (name) => {
  const state = { name };
  return { ...canBark(state), ...canGuide(state) };
};
```

---

## 7. Error Handling

> Errors are first-class citizens. Handle them explicitly, always.

### Rules
- Use `try/catch` around all async operations and external calls
- Never silently swallow errors (`catch (e) {}` is forbidden)
- Provide meaningful error messages — include context
- Log errors with enough info to debug (stack trace, request ID, user context)
- Distinguish between operational errors (expected) and programmer errors (bugs)

```js
// ❌ Swallowed error
try {
  await fetchUser(id);
} catch (e) {}

// ✅ Handled with context
try {
  const user = await fetchUser(id);
  return user;
} catch (error) {
  logger.error(`Failed to fetch user ${id}:`, error.message);
  throw new AppError('USER_FETCH_FAILED', 'Could not retrieve user data', 500);
}
```

### Edge Cases to Always Handle
- [ ] Null / undefined values (use optional chaining `?.` and nullish coalescing `??`)
- [ ] Empty arrays or objects before iteration
- [ ] Network timeouts and API failures
- [ ] Unexpected user input (wrong type, out-of-range values)
- [ ] Database connection failures
- [ ] File not found / permission denied

---

## 8. Refactoring Guidelines

### When to Refactor
- Function > 30 lines → extract smaller functions
- File > 300 lines → split into modules
- Same logic appears 2+ times → extract to utility
- Condition > 3 levels deep → flatten with early returns
- Confusing name → rename immediately

### Refactoring Checklist
- [ ] Break large functions into smaller, named ones
- [ ] Remove all duplicate code paths
- [ ] Simplify complex conditionals
- [ ] Replace hardcoded values with constants/config
- [ ] Improve naming throughout
- [ ] Extract shared utilities to a dedicated file
- [ ] Add or improve error handling after changes

### Safe Refactoring Steps
1. Cover the existing behavior with tests (if not already)
2. Make one small change at a time
3. Run tests after each change
4. Commit working states frequently

---

## 9. Scalability Considerations

- **Stateless services** — Don't store session state in memory; use Redis or DB
- **Horizontal scaling** — Code shouldn't assume it runs on one machine
- **Database indexing** — Index columns used in WHERE, JOIN, and ORDER BY
- **Pagination** — Never return unbounded lists from DB or API
- **Queue heavy work** — Long operations (email, video processing) go in a job queue
- **Rate limiting** — Protect APIs from abuse at scale
- **Feature flags** — Allow safe rollout and instant rollback

```js
// ❌ Unbounded query — dangerous at scale
const orders = await db.query("SELECT * FROM orders");

// ✅ Paginated query
const orders = await db.query(
  "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2",
  [pageSize, page * pageSize]
);
```

---

## 10. Review Output Format

When reviewing code, always structure the output as:

### 🔍 Issues Found
List each issue with:
- **Type**: Bug / Security / Performance / Readability / Maintainability
- **Location**: File name + line number (if known)
- **Description**: What is wrong and why it matters

### 💡 Suggested Improvements
- Cleaner alternative approach
- Better structure or pattern to use
- Optimization opportunity

### ✏️ Refactored Code (if applicable)
Provide the corrected/improved version with clear diff or before/after blocks.

### 📊 Impact Summary
Brief explanation of:
- Why the change was made
- What improves (readability / performance / security / reliability)
- Risk level of the current code (Low / Medium / High / Critical)

### Example Output Format
```
🔍 Issue 1 — Security (Critical)
Location: auth.js, line 42
Problem: SQL query is built via string concatenation, allowing SQL injection.

💡 Fix: Use parameterized queries.

✏️ Before:
  const q = `SELECT * FROM users WHERE email = '${email}'`;

✏️ After:
  const q = `SELECT * FROM users WHERE email = $1`;
  db.query(q, [email]);

📊 Impact: Eliminates SQL injection vulnerability. Critical — fix before deployment.
```

---

## 11. Common Red Flags (Instant Review Triggers)

| Pattern | Problem |
|---|---|
| `catch (e) {}` | Silent error swallowing |
| `console.log` in production | Debug code left in |
| `TODO:` comments | Unfinished work shipped |
| `any` type in TypeScript | Defeats the purpose of TypeScript |
| Hardcoded `localhost` or IP | Breaks in any other environment |
| `SELECT *` in SQL queries | Fetches unneeded data, breaks on schema change |
| `eval()` or `innerHTML` with user data | XSS vulnerability |
| `Math.random()` for security tokens | Not cryptographically secure |
| Synchronous file reads in Node.js | Blocks event loop |
| Unbounded loops without exit conditions | Infinite loop risk |

---

## Resources
- Clean Code — Robert C. Martin (Book)
- Refactoring — Martin Fowler (Book)
- OWASP Top 10: owasp.org/www-project-top-ten
- Google Engineering Practices: google.github.io/eng-practices/review
- MDN Web Docs: developer.mozilla.org

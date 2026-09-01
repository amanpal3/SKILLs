---
name: testing-code
description: Architects, implements, and debugs comprehensive automated tests across unit, integration, and end-to-end (E2E) tiers using modern frameworks like Vitest, Jest, Pytest, and Playwright. Use when the user asks to write tests, build test suites, configure test runners, mock dependencies, prevent flaky tests, or practice TDD.
---

# Testing & QA — Automated Test Engineering

## When to Use This Skill
- Writing unit, integration, or end-to-end (E2E) tests
- Setting up test runners (Vitest, Jest, Pytest, Playwright, Cypress, Mocha)
- Designing test suites, fixtures, factories, and mocks
- Debugging flaky, slow, or failing tests
- Implementing Test-Driven Development (TDD) or Behavior-Driven Development (BDD)
- Testing API endpoints, database interactions, UI components, or async workers
- Establishing code coverage targets and quality gates for CI/CD

---

## 1. Core Testing Principles

> **Rule**: Test behavior and contracts, not implementation details. Tests should survive internal refactoring without breaking.

- **AAA Pattern (Arrange, Act, Assert)** — Every test must have clear setup, execution, and verification phases.
- **Deterministic & Isolated** — Zero dependencies between tests. Tests must pass in any order, in parallel, and repeatedly.
- **Fast Feedback Loop** — Unit tests run in milliseconds. Keep total suite execution tight to encourage frequent runs.
- **Explicit over Implicit** — Avoid magic setup in deep nesting; keep test context visible and readable.
- **Zero Flakiness** — Never use arbitrary `sleep()` or `delay()`. Always wait on deterministic conditions, promises, or locator states.
- **Fail with Clarity** — Assertion failures should tell a clear story of what was expected vs what was received.

---

## 2. The Test Pyramid & Strategy

```
           / \
          /   \     E2E Tests (Playwright / Cypress)
         / E2E \    - Critical user journeys, smoke tests, auth flows
        /-------\
       / Integr- \  Integration Tests (Supertest, Pytest DB, Component Testing)
      /  ation    \ - API routes, database queries, service boundaries, component interaction
     /-------------\
    /     Unit      \ Unit Tests (Vitest, Jest, Pytest)
   /      Tests      \ - Pure functions, business logic, domain rules, utilities, data transformers
  /-------------------\
```

| Tier | Scope | Speed | Isolation | Mocking Strategy |
|---|---|---|---|---|
| **Unit** | Individual functions, domain models, utilities | Sub-millisecond | High | Mock all I/O and external dependencies |
| **Integration** | API routes, DB repositories, multi-component flows | Fast (ms to seconds) | Medium | Mock only 3rd-party services (Stripe, Email); use test DB / containers |
| **E2E** | Full stack (Frontend + Backend + Real DB/Staging) | Slower (seconds) | System-level | Real environment or mocked external webhooks |

---

## 3. Unit & Integration Testing Guidelines

### JavaScript / TypeScript (Vitest & Jest)

#### Unit Testing Pure Logic
```ts
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './pricing';

describe('calculateDiscount', () => {
  it('applies standard 10% discount for orders over 100', () => {
    // Arrange
    const orderTotal = 150;
    const tier = 'STANDARD';

    // Act
    const finalPrice = calculateDiscount(orderTotal, tier);

    // Assert
    expect(finalPrice).toBe(135);
  });

  it('throws an error for negative order totals', () => {
    expect(() => calculateDiscount(-10, 'STANDARD')).toThrowError('Invalid order total');
  });
});
```

#### Mocking Dependencies & Timers
```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendWelcomeEmail } from './emailService';
import { mailerClient } from './mailerClient';

vi.mock('./mailerClient', () => ({
  mailerClient: {
    send: vi.fn(),
  },
}));

describe('sendWelcomeEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mailerClient with correct payload', async () => {
    vi.mocked(mailerClient.send).mockResolvedValueOnce({ status: 200 });

    await sendWelcomeEmail('user@example.com', 'Alex');

    expect(mailerClient.send).toHaveBeenCalledTimes(1);
    expect(mailerClient.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      template: 'welcome',
      vars: { name: 'Alex' },
    });
  });
});
```

#### API Route Integration Testing (Supertest / Fastify / Express)
```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';

describe('POST /api/v1/projects', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('creates a project and returns 201 with auth token', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ name: 'Alpha Suite', description: 'Core product' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(String),
      name: 'Alpha Suite',
      createdAt: expect.any(String),
    });
  });

  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app)
      .post('/api/v1/projects')
      .send({ name: 'Unauthorized Project' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});
```

---

### Python (Pytest)

```python
import pytest
from unittest.mock import AsyncMock, patch
from my_app.services.user import create_user, UserAlreadyExistsError

@pytest.fixture
def mock_user_repo():
    repo = AsyncMock()
    repo.find_by_email.return_value = None
    repo.save.return_value = {"id": "usr_123", "email": "test@example.com"}
    return repo

@pytest.mark.asyncio
async def test_create_user_success(mock_user_repo):
    # Arrange & Act
    user = await create_user("test@example.com", "SecurePass123!", repo=mock_user_repo)

    # Assert
    assert user["id"] == "usr_123"
    assert user["email"] == "test@example.com"
    mock_user_repo.save.assert_called_once()

@pytest.mark.asyncio
async def test_create_user_duplicate_email_raises_error(mock_user_repo):
    mock_user_repo.find_by_email.return_value = {"id": "existing_user"}

    with pytest.raises(UserAlreadyExistsError):
        await create_user("test@example.com", "SecurePass123!", repo=mock_user_repo)
```

---

## 4. End-to-End (E2E) Testing with Playwright

### Resilient Locators & User-Centric Assertions
- Always prefer accessible roles and labels over CSS selectors or XPaths.
- Hierarchy of locators: `getByRole` > `getByLabel` > `getByText` > `getByTestId` > CSS.

```ts
import { test, expect } from '@playwright/test';

test.describe('Authentication & Dashboard Flow', () => {
  test('user logs in and creates a new document', async ({ page }) => {
    // 1. Navigate
    await page.goto('/login');

    // 2. Fill login form using accessible locators
    await page.getByLabel('Email address').fill('alex@example.com');
    await page.getByLabel('Password').fill('SuperSecret123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // 3. Verify successful redirection and landing state
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /welcome back, alex/i })).toBeVisible();

    // 4. Perform interactive action
    await page.getByRole('button', { name: /new document/i }).click();
    await page.getByPlaceholder('Document title...').fill('Q3 Strategic Plan');
    await page.getByRole('button', { name: /save/i }).click();

    // 5. Assert persistent feedback
    await expect(page.getByText('Document saved successfully')).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Q3 Strategic Plan' })).toBeVisible();
  });
});
```

---

## 5. UI Component Testing (React Testing Library)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('<LoginForm />', () => {
  it('submits credentials when valid and calls onSubmit handler', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@company.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'user@company.com',
      password: 'password123',
    });
  });

  it('displays validation error if email format is invalid', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/valid email required/i);
  });
});
```

---

## 6. Test Quality & Anti-Patterns Checklist

### ❌ Anti-Patterns to Eliminate
| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| **Arbitrary Sleeps (`sleep(2000)`)** | Flaky, slow, non-deterministic | Await explicit locator/promise resolution (`expect(locator).toBeVisible()`) |
| **Testing Implementation Details** | Breaks on internal refactoring | Test public API / external inputs and outputs |
| **Shared Mutable State** | Tests depend on execution order | Reset DB/fixtures in `beforeEach` / use factories |
| **Over-Mocking Domain Logic** | Tests pass while production crashes | Only mock external I/O boundaries (APIs, network, hardware) |
| **Tautological Assertions** | `expect(true).toBe(true)` or re-asserting mocks | Assert meaningful side effects or return values |
| **Single Massive Test** | 50 assertions in one test file | Break into focused, atomic test cases per scenario |

### ✅ Production-Ready Test Checklist
- [ ] Tests follow the **Arrange-Act-Assert (AAA)** pattern
- [ ] Edge cases covered (empty lists, invalid inputs, boundary values, `null`/`undefined`)
- [ ] Error paths explicitly tested (timeouts, network errors, unauthorized status)
- [ ] Test names describe the expected behavior clearly (`should return 400 when email is missing`)
- [ ] Mocks are cleaned up in `afterEach` or `beforeEach` to prevent test pollution
- [ ] Async operations properly awaited (no unhandled rejections)
- [ ] CI execution is parameterized and runs headless

---

## 7. Test-Driven Development (TDD) Workflow

```
       ┌───────────────────────────────┐
       │   1. RED: Write Failing Test  │
       │   (Specifies desired behavior)│
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │  2. GREEN: Make Test Pass     │
       │  (Write simplest working code)│
       └──────────────┬────────────────┘
                      │
                      ▼
       ┌───────────────────────────────┐
       │  3. REFACTOR: Clean & Optimize│
       │  (Maintain passing test suite)│
       └──────────────┬────────────────┘
                      │
                      └──── Loop for next requirement
```

1. **Write the test first**: Define the public contract and assertions before writing implementation code.
2. **Run test**: Confirm it fails for the expected reason (prevents false positives).
3. **Write minimal code**: Implement just enough logic to make the test pass.
4. **Refactor with confidence**: Clean up structure, improve readability, eliminate duplication while tests stay green.

---

## Resources
- Vitest Documentation: `https://vitest.dev/`
- Playwright Documentation: `https://playwright.dev/`
- Testing Library Guiding Principles: `https://testing-library.com/docs/guiding-principles/`
- Martin Fowler — Practical Test Pyramid: `https://martinfowler.com/articles/practical-test-pyramid.html`
- Pytest Documentation: `https://docs.pytest.org/`

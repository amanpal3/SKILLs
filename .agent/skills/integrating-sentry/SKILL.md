---
name: integrating-sentry
description: Architects, configures, and implements production-grade Sentry error tracking, distributed performance tracing, session replay, and alerts across Python, TypeScript/JavaScript, Next.js, FastAPI, Node.js, and background workers. Use when setting up Sentry, configuring DSNs, instrumenting exceptions, adding breadcrumbs/tags, or adding monitoring.
---

# Integrating Sentry

Production-grade error tracking, distributed tracing, and real-time observability across applications.

## When to Use This Skill

Activate this skill when:
- Setting up or configuring Sentry in any project (Python, Node.js, Next.js, React, FastAPI, Django, Express)
- Instrumenting unhandled exception capture and custom error boundaries
- Adding contextual metadata (breadcrumbs, tags, user contexts, extra data)
- Configuring distributed tracing and performance profiling
- Setting up alerts, release tracking, and environment-based filtering

---

## Core Rules & Guardrails

1. **Never Hardcode DSNs**: Always retrieve the Sentry DSN via environment variables (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`).
2. **Graceful Degradation**: If `SENTRY_DSN` is empty or missing (e.g. local offline dev), Sentry must fail silently or log a warning without crashing the app.
3. **Sensitive Data Protection**: Never send secrets, auth tokens, passwords, or PII unless intentionally sanitized via `before_send`.
4. **Sample Rates**: In production, tune `traces_sample_rate` (e.g., 0.1 to 0.5) according to traffic volume to control quota and costs. Use 1.0 for dev/staging.
5. **Explicit Capture in Catch Blocks**: Any caught exception that cannot be completely recovered from should be sent to Sentry via `capture_exception(e)`.

---

## Integration Recipes

### 1. Python (`sentry-sdk`)

#### General Setup & CLI/Scripts
```python
import os
import sentry_sdk

SENTRY_DSN = os.getenv("SENTRY_DSN")

if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        environment=os.getenv("APP_ENV", "development"),
        traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "1.0")),
        send_default_pii=False,
    )
```

#### FastAPI
```python
import os
from fastapi import FastAPI
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=0.2,
    environment=os.getenv("APP_ENV", "production"),
)

app = FastAPI()

@app.get("/api/health")
async def health():
    return {"status": "ok"}
```

#### Explicit Exception Capture with Context
```python
import sentry_sdk

try:
    process_payment(order_id)
except PaymentFailedError as exc:
    with sentry_sdk.push_scope() as scope:
        scope.set_tag("order_id", order_id)
        scope.set_extra("payload", sanitize(payload))
        sentry_sdk.capture_exception(exc)
    raise
```

---

### 2. Next.js (`@sentry/nextjs`)

Install with:
```bash
npx @sentry/wizard@latest -i nextjs
```

#### `sentry.client.config.ts`
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
```

#### `sentry.server.config.ts`
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
});
```

---

### 3. Node.js / Express (`@sentry/node`)

```typescript
import * as Sentry from "@sentry/node";
import express from "express";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

Sentry.setupExpressErrorHandler(app);

app.listen(3000);
```

---

## Verification Checklist

- [ ] Sentry dependency installed (`sentry-sdk` or `@sentry/*`)
- [ ] DSN configured through environment variable (`.env`)
- [ ] Fallback present when DSN is unset
- [ ] Test trigger executed to verify dashboard connection:
  ```python
  # Python test trigger
  sentry_sdk.capture_message("Sentry verification test successful!", level="info")
  ```
- [ ] Sensitive headers/fields redacted in `before_send` if handling auth/billing

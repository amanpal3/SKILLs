# ARCHITECTURE.md — [Project Name]

> Maintained by Tony Stark. Updated whenever a major architecture decision is made.

---

## System Overview

[2–3 sentences describing what this system does and its primary purpose]

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | | |
| Backend | | |
| Database | | |
| Cache | | |
| Auth | | |
| File Storage | | |
| CI/CD | | |
| Hosting | | |

## Directory Structure

```
project-root/
├── src/
│   ├── api/          ← Route handlers (thin — delegate to services)
│   ├── services/     ← Business logic
│   ├── repositories/ ← DB access only
│   ├── middleware/   ← Auth, validation, error handling
│   ├── models/       ← DB schema / ORM models
│   ├── utils/        ← Pure functions, shared helpers
│   ├── config/       ← Environment, constants, feature flags
│   └── types/        ← Shared TypeScript interfaces
├── tests/
│   ├── unit/
│   └── integration/
├── scripts/
├── .env.example
├── docker-compose.yml
└── package.json
```

## Database Schema

```sql
-- [Table 1]
CREATE TABLE [name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [Table 2]
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/v1/health | No | Health check |
| POST | /api/v1/auth/login | No | User login |
| GET | /api/v1/users/me | Yes | Get current user |

## Data Flow Diagrams

### [Feature Name] Flow
```
[Client] → [API Gateway] → [Auth Middleware] → [Route Handler]
       → [Service Layer] → [Repository] → [Database]
       ← [Response] ← [Service] ← [Repository]
```

## Key Architecture Decisions (ADRs)

### ADR-001: [Decision Title]
- **Date**: [Date]
- **Status**: Accepted
- **Context**: [Why a decision was needed]
- **Decision**: [What was decided]
- **Consequences**: [Tradeoffs accepted]

## Environment Variables

```bash
# Required
DATABASE_URL=
JWT_SECRET=
NODE_ENV=

# Optional
REDIS_URL=
SENTRY_DSN=
```

## Performance Targets

| Metric | Target |
|---|---|
| API p95 response time | < 200ms |
| DB query time | < 50ms |
| Page LCP | < 2.5s |
| Uptime | 99.9% |

## Known Technical Debt

| Item | Impact | Priority | Owner |
|---|---|---|---|
| | | | |

---
name: building-backend
description: Architect, implement, and optimize production-grade backend systems, APIs (REST, GraphQL, gRPC), database schemas and migrations, caching layers, background worker queues, authentication, and microservices. Use when the user asks to build backend services, write APIs, design databases, configure Redis/queues, implement server-side logic, or optimize backend performance.
---

# Building Backend — Production-Grade Backend Architecture & Engineering

This skill provides senior-level architecture, standards, implementation patterns, and validation workflows for developing robust, scalable, and secure backend systems.

## When to Use This Skill
- Designing or implementing backend services, RESTful APIs, GraphQL endpoints, or gRPC services
- Writing database schemas, migrations, relations, and complex queries (PostgreSQL, MySQL, MongoDB)
- Implementing authentication (JWT, Session, OAuth2) and authorization (RBAC, ABAC)
- Setting up caching strategies (Redis, Cache-Aside, Memcached)
- Designing asynchronous background task queues (BullMQ, Celery, Kafka, RabbitMQ)
- Structuring backend repositories (Clean Architecture, Domain-Driven Design, Hexagonal/Ports & Adapters)
- Handling database transactions, locks, and concurrency
- Setting up observability, structured logging, health checks, and graceful shutdown

---

## 1. Clean Layered Architecture

Always enforce separation of concerns across 4 distinct layers:

```
[ HTTP / Gateway ] 
       ↓ (Request / DTO)
[ Controller / Handler ]  ← Protocol translation, input schema validation, HTTP status codes
       ↓ (Validated Domain DTO)
[ Service / Use Case ]    ← Pure business rules, orchestration, atomic transactions
       ↓ (Domain Entity)
[ Repository / DAO ]      ← Data access, query building, ORM abstraction, persistence
       ↓ (SQL / Cache)
[ Database / Redis ]
```

### TypeScript (Node.js / Express / Fastify) Pattern
```typescript
// 1. Controller: Schema validation & protocol handling
export class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedDto = CreateUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedDto);
      return res.status(201).json({
        success: true,
        data: user,
        meta: { requestId: req.id, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  }
}

// 2. Service: Business logic & transaction orchestration
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailQueue: EmailQueueService,
    private hasher: PasswordHasher
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.hasher.hash(dto.password);
    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    await this.emailQueue.enqueueWelcomeEmail({ userId: user.id, email: user.email });
    return user;
  }
}

// 3. Repository: Database abstraction & queries
export class UserRepository {
  constructor(private db: PrismaClient) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    return this.db.user.create({ data });
  }
}
```

### Python (FastAPI / SQLAlchemy) Pattern
```python
# 1. Schemas (Pydantic DTOs)
class UserCreateDTO(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str

class UserResponseDTO(BaseModel):
    id: str
    email: EmailStr
    name: str
    created_at: datetime
    class Config:
        from_attributes = True

# 2. Router / Controller
router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=StandardResponse[UserResponseDTO], status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreateDTO,
    service: UserService = Depends(get_user_service)
):
    user = await service.create_user(payload)
    return StandardResponse(success=True, data=user)

# 3. Service Layer
class UserService:
    def __init__(self, repo: UserRepository, queue: TaskQueue):
        self.repo = repo
        self.queue = queue

    async def create_user(self, dto: UserCreateDTO) -> User:
        if await self.repo.get_by_email(dto.email):
            raise DuplicateResourceException("Email already exists")
        hashed_pwd = hash_password(dto.password)
        user = await self.repo.create(email=dto.email, password_hash=hashed_pwd, name=dto.name)
        await self.queue.enqueue("send_welcome_email", user_id=user.id)
        return user
```

---

## 2. API Design & Standards

### Uniform Response Envelope
All API endpoints must return structured, consistent payloads:

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "req_123", "timestamp": "2026-09-01T12:00:00Z" }
}

// Paginated List
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "nextCursor": "eyJpZCI6MjB9"
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [{ "field": "email", "message": "Email is required" }]
  },
  "meta": { "requestId": "req_123", "timestamp": "2026-09-01T12:00:00Z" }
}
```

### Idempotency Pattern
For mutating operations (payments, balance updates, order creations), require an `Idempotency-Key` header:
```typescript
export async function withIdempotency<T>(
  key: string,
  ttlSeconds: number,
  operation: () => Promise<T>
): Promise<T> {
  const redisKey = `idempotency:${key}`;
  const existing = await redis.get(redisKey);
  if (existing) {
    return JSON.parse(existing);
  }

  // Acquire lock
  const acquired = await redis.set(`lock:${redisKey}`, '1', 'EX', 10, 'NX');
  if (!acquired) {
    throw new ConflictException('Concurrent request in progress for this idempotency key');
  }

  try {
    const result = await operation();
    await redis.set(redisKey, JSON.stringify(result), 'EX', ttlSeconds);
    return result;
  } finally {
    await redis.del(`lock:${redisKey}`);
  }
}
```

---

## 3. Database Architecture, Migrations & Transactions

### Invariants
1. **Migrations as Code:** Every schema alteration must have a forward and rollback migration.
2. **Transaction Scoping:** Run all multi-table mutations within an atomic transaction.
3. **Optimistic Locking:** Use a `version` or `updated_at` column to prevent concurrent overwrite collisions:
   ```sql
   UPDATE accounts 
   SET balance = balance - 100, version = version + 1 
   WHERE id = 'acc_123' AND version = 2;
   ```
4. **Foreign Key Indexing:** Always create indexes on foreign keys to prevent full table locks during cascading operations.
5. **No N+1 Queries:** Use joins or dataloaders for relational data fetching.

---

## 4. Caching & Performance Architecture

### Cache-Aside (Standard Pattern)
```typescript
export async function getCached<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const freshData = await fetchFn();
  if (freshData !== null && freshData !== undefined) {
    await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
  }
  return freshData;
}

// Invalidation on write
export async function updateUser(userId: string, data: UpdateUserDto) {
  const updated = await db.user.update({ where: { id: userId }, data });
  await redis.del(`user:${userId}:profile`);
  return updated;
}
```

---

## 5. Background Jobs & Asynchronous Workflows

### Rules
- **Return Fast HTTP Responses:** Queue long tasks (>200ms) and return `202 Accepted`.
- **Idempotent Workers:** Every job consumer must handle duplicate deliveries gracefully.
- **Exponential Backoff:** Always specify retry delays with backoff.
- **Dead Letter Queue (DLQ):** Route persistently failing jobs to a DLQ for inspection.

```typescript
import { Queue, Worker } from 'bullmq';

export const emailQueue = new Queue('email-notifications', { connection: redisConfig });

// Enqueue with backoff
await emailQueue.add('sendWelcomeEmail', { userId: 'usr_1', email: 'a@b.com' }, {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: true,
  removeOnFail: false
});

// Worker with error isolation
new Worker('email-notifications', async job => {
  if (job.name === 'sendWelcomeEmail') {
    await mailer.send(job.data.email, 'Welcome!', '...');
  }
}, { connection: redisConfig });
```

---

## 6. Authentication, RBAC & Security Integration

- **Token Strategy:** Access Token (15 min) + Refresh Token with rotation.
- **Password Security:** Use Argon2id or bcrypt (cost >= 12).
- **Authorization:** Enforce granular permissions server-side on every route.
- **Rate Limiting:** Protect APIs with Token Bucket / Sliding Window algorithms.

```typescript
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
}
```

---

## 7. Graceful Shutdown & Resilience

Ensure the server terminates cleanly without dropping in-flight requests or corrupting transactions:

```typescript
function setupGracefulShutdown(server: Server, db: PrismaClient, redis: Redis) {
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await db.$disconnect();
        console.log('Database connections closed.');
        await redis.quit();
        console.log('Redis connections closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    });

    // Force shutdown after 15 seconds if hanging
    setTimeout(() => {
      console.error('Forceful shutdown after timeout');
      process.exit(1);
    }, 15000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
```

---

## 8. Backend Verification Checklist

Before shipping any backend feature, verify each gate:

- [ ] **Layered Separation:** Controller only handles I/O; Service holds domain rules; Repository isolates queries.
- [ ] **Input Validation:** Strict schema validation on all inputs (body, query, params, headers).
- [ ] **Response Envelope:** Predictable `{ success, data, meta }` or `{ success, error, meta }` format.
- [ ] **Transactions & Concurrency:** Multi-step mutations execute inside database transactions.
- [ ] **Indexing:** Foreign keys and filter/sort columns are indexed.
- [ ] **No N+1 Queries:** Relations eagerly loaded or batched via DataLoader.
- [ ] **Caching:** Cache-Aside with explicit TTL; proper invalidation on writes.
- [ ] **Background Tasks:** Non-blocking operations offloaded to queues with retries and DLQ.
- [ ] **Auth & RBAC:** Auth tokens verified, role permissions checked, resource tenant ownership validated.
- [ ] **Health & Probes:** `/healthz` and `/ready` probes exposed.
- [ ] **Graceful Shutdown:** Process traps SIGTERM/SIGINT and drains connections cleanly.

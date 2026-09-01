# API Design Guide — Thor's REST/GraphQL Patterns

> *"An API is a promise. Keep it."*

---

## 1. REST API Conventions

### URL Structure
```
/api/v{version}/{resource}
/api/v1/users
/api/v1/users/:id
/api/v1/users/:id/orders          ← nested resource (max 1 level deep)
/api/v1/users/:id/orders/:orderId
```

### Rules
- **Lowercase + hyphens** in URLs (`/user-profiles` not `/UserProfiles`)
- **Plural nouns** for collections (`/users` not `/user`)
- **No verbs** in URLs — use HTTP methods instead (`/users/:id` not `/getUser`)
- **Versioning** in URL path (`/api/v1/`) — never in headers for simplicity
- **Max 2 levels** of nesting — flatten beyond that

### HTTP Method Semantics
| Method | Action | Idempotent | Body |
|---|---|---|---|
| `GET` | Read | Yes | No |
| `POST` | Create | No | Yes |
| `PUT` | Full replace | Yes | Yes |
| `PATCH` | Partial update | No | Yes |
| `DELETE` | Delete | Yes | No |

---

## 2. Standard Response Format

Every endpoint — success or failure — returns this shape:

```json
{
  "success": true,
  "data": {},
  "message": "Human-readable description",
  "timestamp": "2026-03-28T21:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No user exists with the provided ID",
    "details": {}
  },
  "timestamp": "2026-03-28T21:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### HTTP Status Codes
| Code | Use When |
|---|---|
| `200 OK` | Successful read or update |
| `201 Created` | Resource created (POST) |
| `204 No Content` | Successful delete (no body) |
| `400 Bad Request` | Invalid input / validation failure |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Authenticated but not authorized |
| `404 Not Found` | Resource doesn't exist |
| `409 Conflict` | Duplicate resource (email already exists) |
| `422 Unprocessable` | Semantically invalid (valid JSON, wrong business logic) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server failure |

---

## 3. Pagination

Always paginate list endpoints. Never return unbounded arrays.

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 248,
      "totalPages": 13,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Query params**: `GET /api/v1/users?page=2&pageSize=20&sortBy=createdAt&order=desc`

**DB query pattern**:
```sql
SELECT * FROM users
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;
-- $1 = pageSize, $2 = (page - 1) * pageSize
```

---

## 4. Filtering & Searching

```
GET /api/v1/orders?status=pending&minAmount=100&maxAmount=500
GET /api/v1/users?search=john&role=admin
GET /api/v1/products?category=electronics&inStock=true
```

- Use query params for filtering (not POST body)
- Validate filter values before passing to DB
- Index all frequently filtered columns

---

## 5. API Validation Layer

```js
// Validate every request before it hits business logic
const createUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'viewer']),
  age: z.number().int().min(13).max(120).optional()
});

// Middleware
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: result.error.flatten()
        }
      });
    }
    req.validatedBody = result.data;
    next();
  };
}

app.post('/api/v1/users', validate(createUserSchema), createUserHandler);
```

---

## 6. Authentication Middleware

```js
// Verify JWT on every protected route
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'MISSING_TOKEN', message: 'Authentication required' }
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' }
    });
  }
}
```

---

## 7. Rate Limiting

```js
const rateLimit = require('express-rate-limit');

// Auth endpoints — strict
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many attempts. Try again in 15 minutes.' } }
});

// General API — relaxed
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Request limit exceeded.' } }
});

app.use('/api/auth/', authLimiter);
app.use('/api/', apiLimiter);
```

---

## 8. GraphQL Patterns (when to use + how)

### Use GraphQL When:
- Frontend needs flexible queries across complex relationships
- You have multiple client types (web, mobile, partners) with different data needs
- Over-fetching/under-fetching is a real problem at scale

### GraphQL Schema Conventions
```graphql
# Types: PascalCase
type User {
  id: ID!
  email: String!
  name: String!
  orders: [Order!]!
  createdAt: DateTime!
}

# Queries: camelCase, describe what they return
type Query {
  user(id: ID!): User
  users(page: Int, pageSize: Int): UserConnection!
}

# Mutations: camelCase, verb-first
type Mutation {
  createUser(input: CreateUserInput!): UserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UserPayload!
  deleteUser(id: ID!): DeletePayload!
}

# Always return a payload type (not the model directly)
type UserPayload {
  success: Boolean!
  user: User
  errors: [UserError!]!
}
```

### GraphQL Security
- Depth limit: max 5 levels of nesting
- Complexity limit: max 100 points per query
- Rate limit by user, not just IP
- Disable introspection in production
- Authenticate at resolver level, not just gateway

---

## 9. API Documentation Standard

Every endpoint must have inline documentation:

```js
/**
 * Create a new user account
 *
 * @route   POST /api/v1/users
 * @access  Public
 * @body    { email: string, name: string, password: string }
 * @returns { success: bool, data: { user: User, token: string } }
 * @errors  400 (validation), 409 (email exists)
 */
async function createUser(req, res) {
  // implementation
}
```

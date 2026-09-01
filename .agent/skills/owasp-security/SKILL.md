---
name: owasp-security
description: Writes secure, production-grade code following OWASP Top 10 best practices. Identifies and prevents common vulnerabilities including injection, broken access control, auth failures, and more. Use when writing backend code, APIs, auth systems, or reviewing code for security risks.
---

# OWASP Security — Production-Grade Secure Coding

## When to Use This Skill
- Writing backend APIs, authentication systems, or database queries
- Reviewing code for security vulnerabilities
- Building login, registration, file upload, or payment flows
- Setting up CI/CD pipelines, environment config, or server settings
- Any feature that handles user data, secrets, or external requests

---

## 1. Core Security Principles

> **Rule**: Security is a feature, not an afterthought.

| Principle | Meaning |
|---|---|
| **Never trust user input** | Validate and sanitize everything from outside the system |
| **Defense in depth** | Multiple security layers — if one fails, others hold |
| **Least privilege** | Code, users, and services get only the access they need |
| **Fail securely** | On error, deny access and reveal no sensitive details |
| **Keep it simple** | Complex security logic is harder to audit and easier to break |
| **Shift left** | Catch vulnerabilities in development, not production |

---

## 2. OWASP Top 10 — Threats & Fixes

### #1 — Broken Access Control
**Threat**: Users access data or functions they shouldn't (e.g., reading another user's data by changing an ID in the URL).

**Fixes**:
- Enforce authorization checks server-side on **every request** — never trust the client
- Use RBAC (Role-Based Access Control) or ABAC (Attribute-Based)
- Deny by default — if no explicit permission, deny access
- Verify resource ownership before returning data

```js
// ❌ Broken — anyone can access any user's data
app.get('/api/orders/:id', async (req, res) => {
  const order = await db.getOrder(req.params.id);
  res.json(order);
});

// ✅ Fixed — verify ownership
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await db.getOrder(req.params.id);
  if (!order || order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});
```

---

### #2 — Cryptographic Failures
**Threat**: Sensitive data (passwords, PII, payment info) stored or transmitted without proper encryption.

**Fixes**:
- Always use **HTTPS** (TLS 1.2+)
- Hash passwords with **bcrypt** or **argon2** (never MD5/SHA1)
- Encrypt sensitive data at rest (AES-256)
- Never store plaintext secrets anywhere
- Use strong, random keys for JWT secrets

```js
// ❌ Never store plain passwords
const user = { password: req.body.password };

// ✅ Hash with bcrypt (cost factor 12+)
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(req.body.password, 12);
const user = { password: hashedPassword };

// ✅ Verify password
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

---

### #3 — Injection (SQL, NoSQL, OS, LDAP)
**Threat**: Untrusted data is sent to an interpreter as part of a command or query, altering its intended behavior.

**Fixes**:
- Use **parameterized queries** / prepared statements always
- Use an ORM (Prisma, Sequelize, TypeORM) as a second layer
- Escape output for the correct context (HTML, JSON, SQL)
- Never build queries or shell commands via string concatenation

```js
// ❌ SQL Injection — critical vulnerability
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
db.query(query);

// ✅ Parameterized query — safe
const query = `SELECT * FROM users WHERE email = $1`;
db.query(query, [req.body.email]);

// ❌ NoSQL Injection (MongoDB)
User.findOne({ username: req.body.username, password: req.body.password });

// ✅ Sanitize MongoDB input
const { username } = req.body;
if (typeof username !== 'string') return res.status(400).json({ error: 'Invalid input' });
User.findOne({ username });
```

---

### #4 — Insecure Design
**Threat**: Security flaws baked into the architecture — no amount of implementation fixes can compensate for a broken design.

**Fixes**:
- Threat model during planning (ask: "How could this be abused?")
- Apply security design patterns (defense in depth, fail-secure defaults)
- Limit "blast radius" — if one service is compromised, others shouldn't fall
- Separate concerns: auth layer ≠ business logic ≠ data layer
- Don't design features that require dangerous workarounds

**Design Questions to Ask Before Building**:
- What happens if a user submits unexpected data?
- Can a user access another user's resources?
- What's the worst-case scenario if this endpoint is hit 1M times?
- Where does sensitive data flow, and who can see it?

---

### #5 — Security Misconfiguration
**Threat**: Default credentials, open cloud buckets, exposed admin panels, verbose error messages, unnecessary features enabled.

**Fixes**:
- Remove default credentials and unused features immediately
- Disable directory listing and debug modes in production
- Set proper HTTP security headers (see Section 6)
- Keep error messages generic to users; log details server-side
- Use infrastructure-as-code to enforce consistent config

```js
// ❌ Exposes stack trace to user
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// ✅ Generic message to user, full detail in logs
app.use((err, req, res, next) => {
  logger.error({ err, req: { method: req.method, url: req.url } });
  res.status(500).json({ error: 'An unexpected error occurred' });
});
```

---

### #6 — Vulnerable & Outdated Components
**Threat**: Using libraries with known CVEs (Common Vulnerabilities and Exposures).

**Fixes**:
- Run `npm audit` / `pip-audit` / `bundle audit` regularly
- Enable **Dependabot** or **Snyk** in your repo for automated alerts
- Pin dependency versions in production; use lockfiles
- Remove unused packages (each dependency is an attack surface)
- Check CVE databases before adding new dependencies

```bash
# Check for vulnerabilities
npm audit

# Auto-fix safe updates
npm audit fix

# Check outdated packages
npm outdated
```

---

### #7 — Identification & Authentication Failures
**Threat**: Weak passwords, no brute-force protection, insecure session management, broken "forgot password" flows.

**Fixes**:
- Enforce strong password policy (min 8 chars, complexity)
- Implement **rate limiting** on login endpoints
- Support **MFA** (TOTP/SMS)
- Use **HTTPOnly + Secure + SameSite** cookies for sessions
- Invalidate sessions on logout (delete server-side session)
- Use short-lived JWT access tokens + long-lived refresh tokens (stored in HTTPOnly cookie)

```js
// ✅ Secure cookie settings
res.cookie('session', token, {
  httpOnly: true,      // JS cannot access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // No cross-site sending
  maxAge: 15 * 60 * 1000  // 15 minutes
});

// ✅ Rate limit login
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max: 10,                      // 10 attempts
  message: 'Too many login attempts. Try again later.'
});
app.post('/auth/login', loginLimiter, loginHandler);
```

---

### #8 — Software & Data Integrity Failures
**Threat**: Code or data from untrusted sources (unverified npm packages, insecure CI/CD pipelines, unsigned updates).

**Fixes**:
- Verify package integrity with lockfiles (`package-lock.json`, `yarn.lock`)
- Use subresource integrity (SRI) for CDN-loaded scripts
- Sign deployments and artifacts in CI/CD
- Avoid `npm install` from untrusted or unofficial sources
- Use protected pipeline environments; don't allow arbitrary code injection

```html
<!-- ✅ Subresource Integrity for CDN scripts -->
<script
  src="https://cdn.example.com/library.min.js"
  integrity="sha384-[hash]"
  crossorigin="anonymous">
</script>
```

---

### #9 — Security Logging & Monitoring Failures
**Threat**: Attacks go undetected because there's no audit trail or alerting.

**What to Log**:
- All authentication attempts (success + failure)
- Authorization failures (403 events)
- Input validation failures
- Admin/privileged actions
- Unusual traffic patterns (rate limit hits, abnormal request volumes)

**What NOT to Log**:
- Passwords or password hashes
- Full credit card numbers or CVVs
- Session tokens or JWT values
- PII beyond what's operationally required

```js
// ✅ Structured security logging
logger.warn({
  event: 'AUTH_FAILURE',
  userId: req.body.email,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString()
});

logger.info({
  event: 'AUTH_SUCCESS',
  userId: user.id,
  ip: req.ip
});
```

---

### #10 — Server-Side Request Forgery (SSRF)
**Threat**: Attacker tricks the server into making requests to internal services (metadata APIs, databases, internal dashboards).

**Fixes**:
- Validate and whitelist allowed URLs/domains for any server-side fetch
- Block requests to private IP ranges (10.x.x.x, 172.16.x.x, 192.168.x.x, 169.254.x.x)
- Use an allowlist, not a blocklist (attacker can bypass blocklists with redirects)
- Disable HTTP redirects if not needed
- Never pass raw user input as a URL to fetch

```js
// ❌ SSRF risk — user controls the URL
app.post('/fetch-url', async (req, res) => {
  const data = await fetch(req.body.url);
  res.json(await data.json());
});

// ✅ Allowlist validation
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

app.post('/fetch-url', async (req, res) => {
  if (!isAllowedUrl(req.body.url)) {
    return res.status(400).json({ error: 'URL not allowed' });
  }
  const data = await fetch(req.body.url);
  res.json(await data.json());
});
```

---

## 3. Input Validation Rules

> Validate on the server always. Client-side validation is UX, not security.

### Rules
- Validate **type** (string, integer, email, UUID, etc.)
- Enforce **length limits** (min and max)
- Use **allowlists** over blocklists (define what IS valid, reject everything else)
- **Normalize** input before processing (trim whitespace, lowercase emails)
- **Reject early** — validate before any business logic runs

### Common Validations
```js
// Email
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());

// UUID (safe for DB lookups)
const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// Integer with bounds
const page = parseInt(req.query.page, 10);
if (isNaN(page) || page < 1 || page > 1000) return res.status(400).json({ error: 'Invalid page' });

// File upload
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
if (!ALLOWED_TYPES.includes(file.mimetype)) return res.status(400).json({ error: 'Invalid file type' });
if (file.size > MAX_SIZE_BYTES) return res.status(400).json({ error: 'File too large' });
```

### Use a Validation Library
```js
// Zod (TypeScript-first)
import { z } from 'zod';
const UserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  age: z.number().int().min(13).max(120)
});
const result = UserSchema.safeParse(req.body);
if (!result.success) return res.status(400).json({ error: result.error.flatten() });
```

---

## 4. HTTP Security Headers

Add these headers to every response:

```js
// Express — use helmet.js
const helmet = require('helmet');
app.use(helmet());

// Or manually set key headers:
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');                         // Prevent clickjacking
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'                   // HSTS — HTTPS only
  );
  next();
});
```

| Header | Purpose |
|---|---|
| `Strict-Transport-Security` | Force HTTPS for 1 year |
| `Content-Security-Policy` | Restrict script/style/resource sources |
| `X-Frame-Options: DENY` | Prevent clickjacking |
| `X-Content-Type-Options: nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | Control referrer info leakage |
| `Permissions-Policy` | Disable unused browser APIs |

---

## 5. Environment & Secrets Management

```bash
# .env (never commit this)
DATABASE_URL=postgres://user:pass@host/db
JWT_SECRET=supersecretrandombytes64chars
STRIPE_SECRET_KEY=sk_live_xxxxx
```

```js
// ✅ Load via dotenv
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET must be set');

// ❌ Never do this
const jwtSecret = "my-hardcoded-secret-123";
```

### .gitignore Essentials
```
.env
.env.local
.env.production
*.key
*.pem
secrets/
```

### For Production
- Use a secrets manager: **AWS Secrets Manager**, **HashiCorp Vault**, **GCP Secret Manager**
- Rotate secrets regularly
- Audit who has access to secrets

---

## 6. API Security Checklist

- [ ] All endpoints require authentication (unless explicitly public)
- [ ] Authorization checked per resource (ownership verified)
- [ ] Rate limiting on all public endpoints
- [ ] HTTPS enforced (redirect HTTP → HTTPS)
- [ ] Request body size limited (prevent DoS via huge payloads)
- [ ] All inputs validated with schema
- [ ] Sensitive data excluded from responses (no passwords, tokens, internal IDs)
- [ ] CORS configured to specific origins (not `*` in production)
- [ ] Security headers set on all responses
- [ ] API versioning (`/api/v1/`) to allow safe updates

```js
// ✅ CORS — specific origins only
const cors = require('cors');
app.use(cors({
  origin: ['https://yourapp.com', 'https://www.yourapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// ✅ Body size limit
app.use(express.json({ limit: '10kb' }));
```

---

## 7. XSS Prevention

```js
// ❌ Direct innerHTML with user data = XSS
element.innerHTML = userInput;

// ✅ Use textContent (no HTML interpretation)
element.textContent = userInput;

// ✅ Or sanitize with DOMPurify (browser)
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ Server-side: escape before sending HTML (Node.js)
const escapeHtml = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');
```

---

## 8. CSRF Prevention

```js
// ✅ Use csurf middleware (Express)
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Send token in response
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Token is automatically verified on mutating requests (POST/PUT/DELETE)
```

```html
<!-- Include in every form -->
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

> **SameSite cookies** also mitigate CSRF. Use `SameSite=Strict` or `SameSite=Lax`.

---

## 9. Security Review Checklist (Pre-Deploy)

### Authentication & Sessions
- [ ] Passwords hashed with bcrypt/argon2 (cost ≥ 12)
- [ ] Sessions use HTTPOnly + Secure + SameSite cookies
- [ ] Login endpoint rate-limited
- [ ] JWT secret is strong (≥ 64 random chars), stored in env
- [ ] Refresh tokens rotated on use and invalidated on logout

### Data & Storage
- [ ] No secrets in source code or version control
- [ ] `.env` in `.gitignore`
- [ ] Sensitive DB columns encrypted at rest
- [ ] DB user has minimum required permissions

### API & Network
- [ ] HTTPS everywhere (HSTS header set)
- [ ] CORS locked to known origins
- [ ] All inputs validated with schema
- [ ] Rate limiting on all public/auth endpoints
- [ ] Security headers set (helmet.js or manual)

### Dependencies & Config
- [ ] `npm audit` passes with 0 critical/high issues
- [ ] No debug mode or verbose errors in production
- [ ] Unnecessary endpoints/services disabled
- [ ] Logging captures security events (without sensitive data)

---

## 10. Quick Vulnerability Reference

| Vulnerability | Risk | One-Line Fix |
|---|---|---|
| SQL Injection | Critical | Use parameterized queries |
| XSS | High | Escape output; use CSP; DOMPurify |
| CSRF | High | CSRF tokens + SameSite cookies |
| Broken Auth | Critical | bcrypt + rate limit + HTTPOnly cookie |
| IDOR | High | Always verify resource ownership |
| Secrets in code | Critical | Use `.env` + secrets manager |
| No HTTPS | High | Enforce TLS + HSTS header |
| Missing auth check | Critical | Authenticate every protected route |
| Verbose errors | Medium | Generic user messages, log internally |
| Outdated deps | High | `npm audit` + Dependabot |

---

## Resources
- OWASP Top 10: owasp.org/www-project-top-ten
- OWASP Cheat Sheet Series: cheatsheetseries.owasp.org
- OWASP Testing Guide: owasp.org/www-project-web-security-testing-guide
- CVE Database: cve.mitre.org
- Helmet.js (Node security headers): helmetjs.github.io
- Snyk (dependency scanning): snyk.io
- Have I Been Pwned API (breached passwords): haveibeenpwned.com/API

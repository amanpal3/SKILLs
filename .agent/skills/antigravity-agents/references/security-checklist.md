# Security Checklist — Black Widow's Full OWASP Guide

> *"Trust no one. Verify everything."*

---

## OWASP Top 10 — Full Audit Checklist

### A01 — Broken Access Control

```
[ ] Every protected route has authentication middleware
[ ] Every resource access verifies ownership (user can only access their data)
[ ] Admin endpoints have role-based authorization, not just authentication
[ ] No security decisions on the frontend only
[ ] Directory listing disabled on web server
[ ] CORS configured to specific allowed origins (not *)
[ ] JWT tokens verified with correct secret on every request
[ ] Expired tokens rejected — expiry check in middleware
[ ] Refresh token rotation on use — old token invalidated
```

### A02 — Cryptographic Failures

```
[ ] All data in transit uses TLS 1.2+ (HTTPS enforced, HTTP redirects)
[ ] HSTS header set: Strict-Transport-Security: max-age=31536000
[ ] Passwords hashed with bcrypt (cost ≥ 12) or Argon2id
[ ] No MD5 or SHA1 for passwords — ever
[ ] Sensitive DB columns encrypted at rest (AES-256)
[ ] JWT secrets are ≥ 64 random characters
[ ] Secrets stored in environment variables or secrets manager
[ ] No sensitive data in URLs (tokens, passwords) — use POST + headers
[ ] API keys rotated regularly and old ones invalidated
```

### A03 — Injection

```
[ ] All SQL queries use parameterized statements or ORM
[ ] No string concatenation in any database query
[ ] MongoDB queries sanitized (no operator injection via $where, $regex)
[ ] OS commands use subprocess with array args (no shell=True / exec())
[ ] LDAP queries sanitized with proper escaping
[ ] XML input validated against strict schema (prevent XXE)
[ ] HTML output escaped before rendering user content
[ ] Template engines use auto-escaping (Jinja2, Handlebars, etc.)
```

### A04 — Insecure Design

```
[ ] Threat model documented for sensitive features (auth, payments, uploads)
[ ] Rate limiting on all auth endpoints (login, register, forgot-password)
[ ] Account lockout after N failed attempts
[ ] Business logic validated server-side (prices, quantities, discounts)
[ ] Sensitive actions require re-authentication (password change, delete account)
[ ] Multi-tenancy isolation verified — tenant A cannot access tenant B's data
[ ] Principle of least privilege applied to all roles
```

### A05 — Security Misconfiguration

```
[ ] Debug mode OFF in production (DEBUG=False, NODE_ENV=production)
[ ] Default credentials changed (DB, admin panels, cloud consoles)
[ ] Stack traces not exposed to users — generic error messages only
[ ] Unnecessary HTTP methods disabled (TRACE, OPTIONS where not needed)
[ ] Server version headers removed (X-Powered-By, Server)
[ ] Security headers set (see header checklist below)
[ ] Cloud storage buckets not publicly readable unless intentional
[ ] Database not publicly accessible — only reachable from app server
[ ] SSH root login disabled on production servers
```

### A06 — Vulnerable & Outdated Components

```
[ ] npm audit / pip-audit / bundle audit run — 0 critical/high issues
[ ] Dependabot or Snyk configured on the repo
[ ] Dependencies pinned in lockfile (package-lock.json, yarn.lock)
[ ] Unused packages removed
[ ] Docker base images use specific version tags (not :latest)
[ ] Docker images scanned with Trivy or Snyk
[ ] Third-party scripts loaded with Subresource Integrity (SRI) hashes
```

### A07 — Identification & Authentication Failures

```
[ ] Password minimum 8 chars, complexity enforced
[ ] Passwords checked against breached database (Have I Been Pwned API)
[ ] Multi-factor authentication available (TOTP preferred)
[ ] Session tokens cryptographically random (≥ 128 bits entropy)
[ ] Sessions stored server-side or as signed JWTs (never unsigned)
[ ] HTTPOnly + Secure + SameSite=Strict cookies
[ ] Session invalidated on logout (server-side deletion)
[ ] Password reset tokens expire in ≤ 15 minutes, single-use
[ ] "Forgot password" reveals no info about whether email exists
```

### A08 — Software & Data Integrity Failures

```
[ ] package-lock.json or yarn.lock committed and used in CI
[ ] npm install --frozen-lockfile in CI/CD (no surprise updates)
[ ] CI/CD pipeline requires code review before deploy
[ ] Deployment artifacts signed and verified
[ ] File uploads: type validated (not just extension — check MIME + magic bytes)
[ ] File uploads stored outside web root or in separate storage service
[ ] Generated files scanned for malware if user-supplied
```

### A09 — Security Logging & Monitoring Failures

```
MUST LOG (structured JSON):
[ ] All authentication attempts (success + failure) with IP + timestamp
[ ] All authorization failures (403 events)
[ ] All input validation failures with attempted payload context
[ ] All admin actions (who did what, when)
[ ] Rate limit violations

MUST NOT LOG:
[ ] Passwords or password hashes
[ ] Full credit card numbers (PCI DSS)
[ ] Session tokens or JWT values
[ ] Full API keys (log last 4 chars only)
[ ] PII beyond what's operationally required

[ ] Logs shipped to centralized system (not just local disk)
[ ] Alerting configured for: repeated 401s, error spikes, unusual traffic
[ ] Log retention policy defined and enforced
```

### A10 — SSRF (Server-Side Request Forgery)

```
[ ] No raw user input ever passed directly to fetch/axios/requests
[ ] Allowlist of permitted external domains for any server-side fetch
[ ] Block requests to private IP ranges:
    - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (private)
    - 169.254.0.0/16 (link-local / cloud metadata)
    - 127.0.0.0/8 (loopback)
[ ] HTTP redirects disabled for server-side fetches
[ ] Cloud metadata endpoint (http://169.254.169.254) blocked at network level
```

---

## HTTP Security Headers Checklist

```
[ ] Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
[ ] Content-Security-Policy: [configured for your app's sources]
[ ] X-Frame-Options: DENY
[ ] X-Content-Type-Options: nosniff
[ ] Referrer-Policy: strict-origin-when-cross-origin
[ ] Permissions-Policy: camera=(), microphone=(), geolocation=()
[ ] X-XSS-Protection: 1; mode=block (legacy browsers)
[ ] Cache-Control: no-store (for sensitive pages)
```

---

## Threat Level Classification

| Level | Criteria | Response |
|---|---|---|
| **LOW** | Informational issue, no immediate exploit | Fix in next sprint |
| **MEDIUM** | Exploitable with significant effort | Fix within 2 weeks |
| **HIGH** | Exploitable by motivated attacker | Fix before next deploy |
| **CRITICAL** | Active exploit possible, data at risk | Stop ship. Fix now. |

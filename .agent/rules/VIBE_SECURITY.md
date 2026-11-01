# Vibe-Coded Security & Production Rules (Global Invariant)

> **Mandatory Security & Pre-Ship Guardrails for all code, APIs, and architectures.**
> These rules must be enforced across every feature, endpoint, database schema, and deployment.

---

## 1. 💉 INJECTION & INPUT HANDLING (Injection Aur Input)

1. **SQL Injection (SQLi):**
   * Never concatenate or interpolate raw strings into database queries (`${input}`).
   * Always use parameterized queries (`$1`, `?`), prepared statements, or typesafe ORMs (Prisma, Drizzle, SQLAlchemy).
2. **Cross-Site Scripting (XSS):**
   * Never render unescaped user-provided HTML or markdown (`dangerouslySetInnerHTML`).
   * Sanitize all rich text using `DOMPurify.sanitize()` or server-side HTML parsers before rendering.
3. **Cross-Site Request Forgery (CSRF):**
   * Enforce `SameSite=Lax` or `Strict` on all authentication cookies.
   * Verify anti-CSRF tokens on state-changing requests (POST, PUT, DELETE, PATCH).
4. **File Upload Validation:**
   * Never trust client-supplied `file.type` or file extensions.
   * Verify file magic bytes / MIME sniffing on the server before storage.
   * Restrict file sizes, whitelist extensions (`.jpg`, `.png`, `.pdf`), and store uploads in isolated, private buckets with random UUID filenames.
5. **Server-Side Request Forgery (SSRF) Prevention:**
   * If fetching URLs supplied by users (e.g. webhooks, link previews), resolve DNS and block internal/private IP ranges (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.169.254` cloud metadata).
   * Restrict protocols to `http:` and `https:` only (disable `file:`, `ftp:`, `gopher:`).

---

## 2. 🔐 AUTHENTICATION & ACCESS CONTROL (Authentication Aur Access)

6. **Broken Object Level Authorization (BOLA / IDOR):**
   * Never query or mutate records by ID alone (`SELECT * FROM orders WHERE id = :id`).
   * Scope every query to the verified session tenant or user ID (`WHERE id = :id AND user_id = :sessionUserId`).
7. **Check Every API Route for Authentication:**
   * Client-side page redirects are NOT security boundaries.
   * Verify session/token validity inside every server handler and API route before executing logic.
8. **Never Trust the Frontend:**
   * Always validate request payloads on the server using schema validators (Zod in TypeScript, Pydantic in Python).
   * Enforce business logic constraints server-side (e.g. pricing, quantity, discount codes).
9. **Rate Limiting:**
   * Protect public, auth, and expensive endpoints (e.g. `/api/auth/*`, `/api/chat`, password resets, OTPs) with IP and user-based rate limiters (e.g. Upstash Redis, sliding window).
10. **Secure Password Hashing:**
    * Hash passwords using **Argon2id** or **bcrypt** (minimum work factor 12).
    * Never use MD5, SHA-1, or plain SHA-256 for passwords.
11. **Multi-Factor Authentication (MFA):**
    * Support and enforce TOTP or WebAuthn/Passkeys for administrative or high-privilege accounts.
12. **Server-Side Permissions & Hidden Admin Pages:**
    * Restrict admin and sensitive actions with server-side Role-Based Access Control (RBAC).
    * Do not merely hide UI tabs or navigation links; return 401/403 directly from server endpoints.
13. **Row-Level Security (RLS):**
    * In PostgreSQL / Supabase, always enable RLS (`ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;`) on every table.
    * Define explicit policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

---

## 3. 🔑 SECRETS & TOKEN SECURITY (Secrets Aur Tokens)

14. **Cryptographically Secure JWTs:**
    * Sign JWTs using high-entropy secrets (minimum 256 bits).
    * Enforce short expiration times (e.g. 15 minutes) and rotate refresh tokens.
    * Never store sensitive plaintext data (passwords, payment details, PII) in the JWT payload.
15. **API Secrets Isolation:**
    * Server secrets (`STRIPE_SECRET_KEY`, `DATABASE_URL`, `SERVICE_ROLE_KEY`) must never be imported into client components or prefixed with `NEXT_PUBLIC_` or `VITE_`.
    * Verify that no `.env` files or secrets are checked into Git.
16. **Token Storage (Cookies vs. LocalStorage):**
    * Store session tokens in `httpOnly`, `Secure`, `SameSite=Lax` cookies to prevent token theft via XSS.
    * Avoid storing sensitive credentials in `localStorage` or `sessionStorage`.
17. **No Default Credentials:**
    * Replace all default passwords (database root, Redis, admin panels) with high-entropy generated credentials before deployment.

---

## 4. ⚙️ CONFIGURATION & INFRASTRUCTURE HYGIENE (Config Aur Hygiene)

18. **CORS Hardening:**
    * Never configure `Access-Control-Allow-Origin: *` with credentials enabled.
    * Whitelist explicit trusted origins only.
19. **Verify Webhook Signatures:**
    * Always verify incoming webhook signatures (Stripe, LemonSqueezy, GitHub) using raw request bodies and timing-safe equality (`crypto.timingSafeEqual`).
20. **Turn Off Debug Mode & Disable Production Source Maps:**
    * Disable debug flags in production (`NODE_ENV=production`, `DEBUG=False`).
    * Set `productionBrowserSourceMaps: false` to avoid leaking unminified backend source code.
21. **Log Redaction & Sensitive Data Scrubbing:**
    * Never log credentials, API keys, passwords, or PII into stdout, files, or monitoring services (Sentry/Datadog).
    * Configure log serializers to mask sensitive keys.
22. **Make Storage Buckets Private:**
    * S3 / Supabase storage buckets must be private by default.
    * Serve files via short-lived presigned URLs or authenticated proxy endpoints.
23. **Security Headers & HTTPS:**
    * Enforce HTTPS with HSTS (`Strict-Transport-Security`).
    * Send essential security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and Content-Security-Policy (CSP).
24. **Vulnerable Dependencies & Auditing:**
    * Run dependency vulnerability audits (`npm audit`, Dependabot, Snyk) and block high/critical severity packages in CI/CD.
25. **Add CAPTCHA to Public Forms:**
    * Protect registration, login, and feedback forms against automated bots with Cloudflare Turnstile or reCAPTCHA v3.
26. **Log Admin Actions:**
    * Maintain immutable audit logs for administrative events (role changes, bans, refunds, data deletions).

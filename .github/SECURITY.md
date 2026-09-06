# Security Policy

## ??? Security Architecture & Shielding

This repository implements a multi-layer defense model to ensure safe execution across AI coding agents (Antigravity, Codex CLI, Claude Code, Cursor).

---

## 1. Supported Versions

| Version / Branch | Supported | Security Maintenance |
| :--- | :---: | :--- |
| `main` (Latest) | ? | Actively patched & audited |
| `< 1.0` | ? | Deprecated |

---

## 2. Security Standards & Guardrails

All skills, scripts, and workflows in this ecosystem adhere to the following mandatory policies:

### A. Zero Hardcoded Secrets
* **Never commit keys, tokens, or credentials:** All sensitive values (e.g., `SENTRY_DSN`, `CONTEXT7_API_KEY`, `OPENAI_API_KEY`, database URLs) must be loaded from environment variables.
* `.gitignore` enforces strict exclusions for `.env*`, `auth.json`, `oauth_creds.json`, and database state files.

### B. Sandboxed Subagent Execution
* Subagents and autonomous processes (`codex exec`, `ralph-loop`, `gsd-executor`) must operate with bounded workspace permissions.
* Dangerous root directory executions (`/`, `C:\`, `C:\Windows`) are blocked by path validation assertions (`Assert-SafePath`).

### C. Safe Documentation Retrieval (Context7)
* Use Context7 MCP to fetch official API documentation directly, preventing the ingestion of untrusted or hallucinated code patterns.

### D. Continuous Observability (Sentry)
* All backend and frontend execution patterns include Sentry exception tracking and breadcrumb logging to catch runtime exceptions safely.

---

## 3. Reporting a Vulnerability

If you discover a potential security vulnerability or secret leak within this repository:

1. **Do NOT open a public issue.**
2. Please report the issue privately through **[GitHub Private Vulnerability Reporting](https://github.com/amanpal3/SKILLs/security/advisories/new)** or contact the repository maintainer directly.
3. Include:
   - Description of the vulnerability
   - Affected skill, plugin, or script
   - Steps to reproduce
   - Potential remediation or patch

### Response SLA
* **Initial Acknowledgement:** Within 24 hours
* **Vulnerability Assessment:** Within 72 hours
* **Patch Release & Advisory:** Within 7 days

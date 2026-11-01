# Security Policy

## 🛡️ Security Architecture & Shielding

This repository implements a multi-layer defense model to ensure safe execution across AI coding agents (Google Antigravity, OpenAI Codex, Claude Code, Cursor, Windsurf).

---

## 1. Supported Versions

| Version / Branch | Supported | Security Maintenance |
| :--- | :---: | :--- |
| `main` (Latest v2.x) | ✅ | Actively patched, scanned & audited |
| `< 2.0` | ❌ | Deprecated |

---

## 2. Security Standards & Guardrails

All skills, scripts, and workflows in this ecosystem adhere to the following mandatory policies:

### A. Zero Hardcoded Secrets
* **Never commit keys, tokens, or credentials:** All sensitive values (e.g., `SENTRY_DSN`, `CONTEXT7_API_KEY`, `OPENAI_API_KEY`, GitHub PATs, database URLs) must be loaded from environment variables or secure local stores (`~/.config/21st/auth.json`, `~/.gemini/config/mcp_config.json`).
* `.gitignore` enforces strict exclusions for `.env*`, `auth.json`, `oauth_creds.json`, and database state files.
* Automated CI secret scanning via Gitleaks verifies zero committed credentials.

### B. Safe Installer Execution & Non-Destructive Operations
* All installers create automated backups in `~/.gemini/backups/` before modifying files.
* Path validation (`assertSafePath`) blocks path traversal, UNC network paths, root system directories (`C:\Windows`, `/etc`), and sensitive credential vaults (`.ssh`, `.aws`, `.gnupg`, `.git`).
* Uninstallation (`npx dr-skills uninstall` / `install-skills.ps1 uninstall`) safely removes only declared ecosystem skills, strictly preserving user code and configurations.

### C. Sandboxed Subagent Execution
* Subagents and autonomous processes (`codex exec`, `ralph-loop`, `gsd-executor`) must operate with bounded workspace permissions.
* The Ralph autonomous loop enforces permission gates by default, disabling dangerous flags unless explicitly opted in via `RALPH_ALLOW_UNSAFE_PERMISSIONS=true`.

### D. Safe Documentation Retrieval (Context7) & Registry Verification (shadcn & 21st)
* Use Context7 MCP to fetch official API documentation directly, preventing the ingestion of untrusted or hallucinated code patterns.
* Registry tools (`shadcn`, `21st`) inspect source components before local installation.

### E. Continuous Diagnostics (`doctor`)
* Run `npx dr-skills doctor` to execute empirical health checks on Node version, manifest integrity, MCP configurations, secret detection, and file permissions.

---

## 3. GitHub Branch Protection & Governance Recommendations

For fork maintainers and team deployments, we enforce:
1. **Require Pull Request Reviews:** Require at least 1 code review approval matching `CODEOWNERS` before merging into `main`.
2. **Require Status Checks to Pass:** Ensure CodeQL analysis and Gitleaks security scans pass before merging.
3. **Disable Force Pushes:** Prevent history rewrites on `main` to protect audit trails.
4. **Dependabot Security Updates:** Automated pull requests for vulnerable npm dependencies and GitHub Actions.

---

## 4. Reporting a Vulnerability

If you discover a potential security vulnerability or secret leak within this repository:

1. **Do NOT open a public issue.**
2. Please report the issue privately through **[GitHub Private Vulnerability Reporting](https://github.com/amanpal3/Dr-SKILLs/security/advisories/new)** or contact the repository maintainer directly.
3. Include:
   - Description of the vulnerability
   - Affected skill, plugin, or script
   - Steps to reproduce
   - Potential remediation or patch

### Response SLA
* **Initial Acknowledgement:** Within 24 hours
* **Vulnerability Assessment:** Within 72 hours
* **Patch Release & Advisory:** Within 7 days

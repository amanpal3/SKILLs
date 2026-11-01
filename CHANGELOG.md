# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-11-02

### Added
- **Expanded Skill Catalog (54 Skills)**: Added 7 new specialized skills: `banner-design`, `brand`, `design`, `design-system`, `humanizer`, `slides`, and `ui-styling`.
- **76-File Merkle Integrity Ledger**: Expanded `integrity.json` to cryptographically hash all 54 skills (`SKILL.md`), all 6 plugin manifests/rules, and root governance documents with SHA-256 root digest verification.
- **Automated Catalog Synchronization Gate**: Added `scripts/sync-catalog.js` with self-validating CI gate enforcing 100% sync across filesystem, `manifest.json`, `README.md`, and `ECOSYSTEM.md`.
- **Pre-Install Cryptographic & MCP Gate**: Enforced automated integrity and MCP URL verification before file copying in `cmdInstall`.

### Fixed & Hardened (Red-Team Audit Mitigation)
- **RT-01 (Supply Chain)**: Pinned remote GSD install and update workflows to immutable release commit SHA (`5b7762fd6f5ad5119a6f591fa943c48b6ab6028a`), added commit verification, diff inspection, and review prompts.
- **RT-02 (Integrity Scope)**: Expanded file integrity coverage from 7 files to 76 files, preventing unvetted prompt manipulation in agent skills.
- **RT-03 (Dependency Pinning)**: Pinned `mcp-remote` to reviewed version `mcp-remote@0.15.2` across configs and docs.
- **RT-04 (Network & Env Leakage)**: Guarded benchmark tooling with `BENCHMARK_ALLOW_NETWORK=1` barrier and excluded benchmarks from npm package tarball.
- **RT-05 (Rollback Trust)**: Hardened rollback against directory traversal (`..`, `/`, `\`), enforced `BACKUP_ROOT` boundaries, and added SHA-256 tree hashing for backup payload restoration.
- **RT-06 (Network Binding)**: Bound dev-browser standalone server explicitly to loopback adapter `127.0.0.1` and added optional Bearer token authorization.
- **RT-07 (SSRF Prevention)**: Enforced HTTPS and blocked private/internal/cloud metadata IP ranges (`169.254.*`, `10.*`, `192.168.*`, `127.*`, `localhost`) for remote MCP server configurations.

## [2.1.0] - 2026-11-01

### Added
- **Native NPX Execution**: Full support for `npx -y ai-skills-ecosystem <command>` without requiring manual repository cloning.
- **Dedicated Antigravity Target**: Added `install antigravity` command to automatically synchronize skills into `~/.gemini/config/skills`, plugins into `~/.gemini/config/plugins`, and governance rules into `~/.gemini/config/rules`.
- **Targeted Platforms**: CLI commands support `install antigravity`, `install claude`, `install cursor`, `install codex`, `install all`, and custom project paths.
- **Selective Safe Uninstall**: `uninstall` command selectively removes only declared ecosystem skills and plugins from `manifest.json`, safely preserving custom user skills and files.
- **Comprehensive Test Suite**: Added `tests/security/antigravity-install.test.js` validating backup creation, idempotency, non-destruction of user files, and permission handling.
- **Cryptographic File Integrity**: Added versioned `integrity.json` checksum manifest and automated integrity validator in `cmdDoctor`.
- **Community Templates**: Added GitHub Issue Templates (`bug_report.yml`, `feature_request.yml`), Pull Request template, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md`.

### Fixed
- **P0 Rollback Fix**: Fixed rollback implementation in both Node CLI (`bin/ai-ecosystem.js`) and PowerShell installer (`install-skills.ps1`) to properly restore payloads via staging directories and verify non-empty states before replacing targets.
- **Symlink & Junction Traversal**: Replaced link-following file copies with `secureCopyDirectory` using `lstatSync` and `ReparsePoint` rejections to eliminate link escapes.
- **Path Validation Boundary Check**: Fixed `assertSafePath` to validate directory traversal boundaries on leaf targets while safely resolving realpaths of existing parent directories.
- **Nested Skill Directory Preservation**: Fixed installer omission of nested skill folders (`references/`, `scripts/`, `data/`, `templates/`).
- **Secret Scanner Precision**: Enhanced `secret-scanner.js` to detect modern OpenAI project tokens (`sk-proj-...`), match multiple tokens per line, and skip symlinks.

### Security
- Hardened all filesystem operations against directory traversal, UNC network paths, and sensitive credential directory modifications.

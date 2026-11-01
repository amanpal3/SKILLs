# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

# Dr-SKILLs 🩺⚡ — Release Checklist

This document details the complete pre-release, packaging, verification, and release steps for publishing `dr-skills` (`Dr-SKILLs`) to npm and GitHub.

---

## 📋 1. Pre-Release Verification

Before tagging or publishing any release, execute all local quality gates:

```bash
# 1. Clean working tree check
git status

# 2. Run ecosystem diagnostics (doctor)
node bin/ai-ecosystem.js doctor

# 3. Run full automated test suite
npm test

# 4. Verify no secrets or sensitive keys exist
node -e "const { scanForSecrets } = require('./security/scanners/secret-scanner'); const r = scanForSecrets('.'); if (r.findings.length > 0) process.exit(1); console.log('Zero secrets found.');"

# 5. Verify package integrity
node -e "const { verifyPackageIntegrity } = require('./security/scanners/file-integrity'); const r = verifyPackageIntegrity('.'); if (!r.passed) process.exit(1); console.log('Integrity verified.');"
```

---

## 📦 2. NPM Pack Inspection

Verify that only the necessary runtime files are packaged and that no sensitive or unnecessary build artifacts are included:

```bash
# Generate the distribution tarball
npm pack

# Inspect the tarball contents
tar -tf dr-skills-*.tgz

# Verify key entries are present:
# - package/bin/ai-ecosystem.js
# - package/manifest.json
# - package/mcp.json
# - package/integrity.json
# - package/assets/
# - package/.agent/skills/
# - package/.agent/plugins/
# - package/README.md
# - package/LICENSE
```

---

## 🧪 3. Local Tarball Verification

Test the packaged tarball in an isolated directory using `npx`:

```bash
# Create temporary sandbox
mkdir -p /tmp/ecosystem-pack-test && cd /tmp/ecosystem-pack-test

# Test CLI help
npx -y /path/to/dr-skills-2.1.0.tgz help

# Test CLI doctor
npx -y /path/to/dr-skills-2.1.0.tgz doctor

# Clean up
cd - && rm -rf /tmp/ecosystem-pack-test
```

---

## 🚀 4. Dry-Run Publish

Validate that npm accepts the package metadata and tarball without errors:

```bash
npm publish --dry-run
```

---

## 🏷️ 5. GitHub Release Specifications

### Recommended Release Title
`v2.1.0 — Dr-SKILLs: Precision AI Developer Agent Skills & MCP Ecosystem`

### Recommended GitHub Topics
Ensure the repository has the following 10 tags applied in repository settings:
1. `ai-agents`
2. `ai-agent-skills`
3. `antigravity`
4. `google-antigravity`
5. `claude-code`
6. `codex-cli`
7. `cursor`
8. `mcp`
9. `developer-tools`
10. `developer-productivity`

### Release Notes Outline
```markdown
## What's Changed in Dr-SKILLs v2.1.0

### 🚀 Highlights
- **Rebranded to Dr-SKILLs:** Surgical precision intelligence, diagnosis, and modular skills for modern AI developers.
- **New Visual Identity & Watermark:** Brand-new cyber-medical aesthetic logo and banner curated by Aman Pal.
- **Native NPX Execution:** Direct execution via `npx -y dr-skills <command>` (and `npx -y ai-skills-ecosystem <command>`)
- **Dedicated Google Antigravity Support:** `install antigravity` synchronizes global skills, plugins, and governance rules into `~/.gemini/config/`
- **Selective Safe Uninstall:** `uninstall` selectively removes only declared ecosystem skills while preserving custom user files
- **Hardened Security & Rollback:** Real payload restoration via staging directories, zero symlink escapes, and cryptographic manifest verification

### 📦 Installation
```bash
npx -y dr-skills doctor
npx -y dr-skills install antigravity
```

**Full Changelog**: https://github.com/amanpal3/Dr-SKILLs/compare/v2.0.0...v2.1.0
```

---

## 🔒 6. Post-Release Verification

After publishing to npm:
```bash
# Verify live npm package can be run directly:
npx -y dr-skills@latest doctor
# or
npx -y ai-skills-ecosystem@latest doctor
```

# Contributing to Dr-SKILLs 🩺⚡

Thank you for your interest in contributing to **Dr-SKILLs** (`dr-skills` / `ai-skills-ecosystem`)! This project provides modular skills, plugins, MCP servers, and multi-agent governance rules for **Google Antigravity**, **Antigravity CLI**, **Claude Code**, **Cursor**, and **OpenAI Codex CLI**.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 9.0.0`
- **Git**

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/amanpal3/Dr-SKILLs.git
cd Dr-SKILLs
npm install
```

### Running Health Diagnostics
Verify your local environment and manifest consistency:

```bash
npm run doctor
# or
node bin/ai-ecosystem.js doctor
```

### Running Automated Tests
Run the comprehensive security and workflow test suite:

```bash
npm test
```

---

## 📁 Repository Layout

- `bin/ai-ecosystem.js`: The primary CLI executable supporting `doctor`, `help`, `install`, `update`, `uninstall`, and `rollback`.
- `.agent/skills/`: Core declared agent skills containing `SKILL.md`, references, data, and scripts.
- `.agent/plugins/`: Integrated agent plugins (e.g., `gsd`, `coderabbit`, `ralph`, `ponytail`, `unified-build-pipeline`).
- `.agent/rules/`: Shared agent governance rules (`GEMINI.md`, `AGENTS.md`, `DEFEND.md`, `VIBE_SECURITY.md`, etc.).
- `security/`: Path validators, secret scanners, manifest checkers, and package integrity verification.
- `manifest.json`: Single source of truth for declared skills, plugins, and MCP configurations.
- `integrity.json`: Cryptographic integrity manifest verifying repository governance files.

---

## 🧩 Adding a New Skill

1. **Create Skill Folder**:
   Create a dedicated directory under `.agent/skills/<skill-name>/`.
2. **Add `SKILL.md`**:
   Every skill MUST include a valid `SKILL.md` with YAML frontmatter:
   ```markdown
   ---
   name: your-skill-name
   description: Concise explanation of what this skill does and when to activate it.
   ---

   # Detailed Instructions
   ...
   ```
3. **Register in `manifest.json`**:
   Add the skill name to the `skills` array in `manifest.json` and update `skills_count`.
4. **Preserve Subdirectories**:
   If the skill requires reference files or scripts, place them under `references/`, `data/`, or `scripts/` inside the skill directory. Never use symlinks or junctions.
5. **Update Integrity Manifest**:
   Ensure `npm test` passes and `manifest.json` is validated.

---

## 🔒 Security Invariants

All contributions must strictly adhere to the project security policies:
1. **Zero Hardcoded Secrets**: Never commit API keys, tokens, or credentials.
2. **Path Sanitization**: All file operations must pass through `assertSafePath` to prevent directory traversal and symlink escapes.
3. **Non-Destructive Operations**: Installers and uninstallers must never modify or delete non-ecosystem user files.

---

## 📬 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feature/my-new-skill`.
2. Commit your changes following conventional commits (`feat: add my-new-skill`).
3. Run `npm test` and `npm run doctor` to ensure zero regressions.
4. Push your branch and open a Pull Request using the PR template.

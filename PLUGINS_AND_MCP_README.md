# 🔌 Plugins, MCP Servers & API Key Setup Guide

> **Comprehensive installation instructions, configuration references, and credential matrices for the AI Skills & Agent Ecosystem.**

---

## 🌍 Core Doctrine: Global Installation

> [!IMPORTANT]
> **All 54 skills, 6 plugins, and governance rules in this repository are installed GLOBALLY upon running the installer.**
>
> You do **not** need to manually copy or reinstall skills into every repository or workspace. Once installed globally, supported global coding agents (Google Antigravity, Claude Code, Cursor, and OpenAI Codex CLI) automatically discover and access the entire ecosystem from your user home directory:
>
> - **Google Antigravity Global Skills:** `~/.gemini/config/skills/`
> - **Google Antigravity Global Plugins:** `~/.gemini/config/plugins/`
> - **Google Antigravity Global Rules:** `~/.gemini/config/rules/` and `~/.gemini/GEMINI.md`
> - **Universal Agent Standards (Claude Code / Cursor):** `~/.agent/skills/` and `~/.agent/rules/`
> - **OpenAI Codex CLI:** `~/.codex/skills/` and `~/.codex/rules/`
> - **Centralized Archive:** `~/.gemini/global-skills/`
>
> 💡 **Project-Level Installation for Windsurf, Copilot & Other Editors:**
> For repository-level agents that discover skills inside the workspace (e.g., Windsurf, GitHub Copilot, Trae, RooCode, Kiro, Continue), run `npx -y dr-skills install ./my-project` to deploy the ecosystem directly into `<project>/.agent/skills/` and `<project>/.agent/rules/`.

---

## ⚡ 1-Step Global Installation

Clone the repository and run the automated installer:

### In PowerShell (Windows):
```powershell
# 1. Clone repository
git clone https://github.com/amanpal3/Dr-SKILLs.git
cd Dr-SKILLs

# 2. Store & install globally (syncs to all agent paths across the entire machine)
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1 store
```

### In Windows Command Prompt (CMD):
```cmd
install-skills.bat store
```

### In macOS / Linux:
```bash
mkdir -p ~/.gemini/config/skills ~/.gemini/config/plugins ~/.agent/skills ~/.codex/skills
cp -r .agent/skills/* ~/.gemini/config/skills/
cp -r .agent/skills/* ~/.agent/skills/
cp -r .agent/skills/* ~/.codex/skills/
cp -r .agent/plugins/* ~/.gemini/config/plugins/
```

---

## 🔑 Master API Key & Credentials Matrix

Below is the definitive requirements table for all MCP servers, plugins, and services:

| Server / Component | Category | Auth Required? | Cost / Tier | Provider / Signup URL | Environment Variable / Header | Configuration Location |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **`shadcn`** | MCP Server | ❌ **No** | 100% Free & Open Source | Built into `shadcn@4.23.0` | None (Local execution) | `mcp_config.json` |
| **`21st` (Magic UI)** | MCP Server | ✅ **Yes** | Free Tier Available | [21st.dev/mcp](https://21st.dev/mcp) | `API_KEY` / `API_KEY_21ST` / `TWENTYFIRST_TOKEN` | `mcp_config.json` or `~/.config/21st/auth.json` |
| **`context7`** | MCP Server | ✅ **Yes** | Free Tier Available | [context7.com](https://context7.com) | `Authorization: Bearer <KEY>` | `mcp_config.json` headers |
| **`StitchMCP`** | MCP Server | ✅ **Yes** | Google Cloud / Stitch Preview | [stitch.googleapis.com](https://stitch.googleapis.com) | `X-Goog-Api-Key: <KEY>` | `mcp_config.json` args |
| **`chrome-devtools-mcp`**| MCP Server | ❌ **No** | 100% Free & Local | Built into Chrome / Node | None (Local execution) | `mcp_config.json` |
| **`playwright`** | MCP Server | ❌ **No** | 100% Free & Local | Open Source Playwright | None (Local browser engine) | `mcp_config.json` |
| **`github-mcp-server`**| MCP Server | ✅ **Yes** | Free (GitHub Account) | [github.com/settings/tokens](https://github.com/settings/tokens) | `GITHUB_PERSONAL_ACCESS_TOKEN` | `mcp_config.json` env |
| **`gmp-code-assist`** | MCP Server | ⚠️ **Optional** | Google Cloud Tier | [console.cloud.google.com](https://console.cloud.google.com) | Google ADC / Remote Endpoint | `mcp_config.json` serverUrl |
| **`firebase-mcp-server`**| MCP Server | ✅ **Yes** | Free Tier Available | [firebase.google.com](https://firebase.google.com) | Firebase CLI (`firebase login`) | System OAuth / ADC |
| **`integrating-sentry`** | Skill / APM | ✅ **Yes** | Free Developer Tier | [sentry.io](https://sentry.io) | `SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | `.env` / Project config |
| **`coderabbit`** | Plugin | ❌ **No** | Built-in rules | Local Agent Intelligence | None | `.agent/plugins/coderabbit/` |
| **`gsd`** | Plugin | ❌ **No** | Built-in rules | Local Agent Intelligence | None | `.agent/plugins/gsd/` |
| **`ponytail`** | Plugin | ❌ **No** | Built-in rules | Local Agent Intelligence | None | `.agent/plugins/ponytail/` |
| **`ralph-loop`** | Plugin | ❌ **No** | Built-in rules | Local Agent Intelligence | None | `.agent/plugins/ralph-loop/` |
| **`unified-build-pipeline`**| Plugin | ❌ **No** | Built-in pipeline | Local Agent Intelligence | None | `.agent/plugins/unified-build-pipeline/`|

---

## 🔌 Plugins Installation & Overview

Plugins package **Rules (`rules/`)**, **Skills (`skills/`)**, and **Playbooks** into single, atomic engineering modules. They are installed globally into `~/.gemini/config/plugins/` and locally into `.agent/plugins/`.

### 1. `coderabbit`
* **Directory:** `.agent/plugins/coderabbit/`
* **Integrated Skill:** [`code-review`](.agent/skills/code-review/)
* **Enforced Rules:** Prioritize `Correctness` → `Security` → `Readability` → `Performance`. Enforces OWASP input validation, auth boundary checks, and pre-commit diff reviews.
* **Requirements:** Zero external keys required.

### 2. `gsd` (Get Shit Done Methodology)
* **Directory:** `.agent/plugins/gsd/`
* **Integrated Skills:** 14 atomic sub-skills:
  - `gsd-planner`: Decomposes roadmaps into atomic phase plans (`PLAN.md`) with dependency waves.
  - `gsd-plan-checker`: Validates plans against architecture before execution.
  - `gsd-executor`: Executes atomic tasks with git checkpointing.
  - `gsd-verifier`: Independent validation against must-haves using test commands.
  - `gsd-debugger`: 3-strike hypothesis-driven debugging in clean contexts.
  - `gsd-codebase-mapper`: Living architecture and dependency maps.
  - `gsd-subagent-delegation`: Multi-agent delegation with branch workspace isolation.
  - `gsd-context-fetch`, `gsd-context-compressor`, `gsd-context-health-monitor`, `gsd-token-budget`, `gsd-empirical-validation`.
* **Slash Commands:** `/map`, `/plan`, `/execute`, `/verify`, `/pause`, `/resume`.
* **Requirements:** Zero external keys required.

### 3. `ponytail` (Senior Dev Anti-Overengineering)
* **Directory:** `.agent/plugins/ponytail/`
* **Integrated Skills:** `ponytail`, `ponytail-audit`, `ponytail-review`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`.
* **Enforced Rules:** Radical simplicity, standard library first, YAGNI, zero speculative abstractions, minimal diffs.
* **Requirements:** Zero external keys required.

### 4. `ralph-loop` (Autonomous Build Loop)
* **Directory:** `.agent/plugins/ralph-loop/`
* **Integrated Skills:** `ralph-loop`, `ralph-prd`.
* **Enforced Rules:** Deterministic story-by-story execution from `prd.json`, quality gates (typecheck, lint, test), and real headless browser validation.
* **Requirements:** Requires Node.js and Playwright for browser tests.

### 5. `unified-build-pipeline`
* **Directory:** `.agent/plugins/unified-build-pipeline/`
* **Integrated Skills:** Unifies `gsd` + `ralph-loop` + `coderabbit`.
* **Execution Flow:**
  1. Spec Lock (`.gsd/SPEC.md` + `.gsd/PLAN.md`)
  2. Deterministic story loop (`prd.json` via Ralph)
  3. Pre-commit CodeRabbit review audit before each commit.

---

## 🌐 Model Context Protocol (MCP) Setup

Model Context Protocol (MCP) provides standard JSON-RPC interfaces so AI agents can query live tools, fetch docs, inspect component libraries, and automate browsers.

### Configuration Files

Antigravity and AI coding agents read MCP servers from two locations:

1. **Global Configuration:** `~/.gemini/config/mcp_config.json`
   *(User-level configuration file; stores your private API keys safely without committing them to git).*
2. **Project-level Configuration:** `mcp.json`
   *(Workspace-level file committed to Git; uses placeholders like `"YOUR_API_KEY"` to prevent credential leaks).*
3. **Tool Schema Cache:** `~/.gemini/antigravity-cli/mcp/<serverName>/`
   *(Stores cached JSON schemas for tools so agents know arguments and descriptions).*

---

### Step-by-Step Server Setup

#### 1. `shadcn` (Official UI & Block Registry)
* **What it does:** Searches and adds official shadcn/ui components, typography, blocks, and templates directly to your project.
* **Installation:** Built-in via npx. No global packages or keys required.
* **Config in `mcp_config.json`:**
  ```json
  "shadcn": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": ["-y", "shadcn@4.23.0", "mcp"]
  }
  ```
* **Verify:**
  ```bash
  npx -y shadcn@4.23.0 mcp
  ```

---

#### 2. `21st` (21st.dev / Magic UI Component & Motion Registry)
* **What it does:** Searches over 5,000+ animated components, Tailwind themes, Remotion video blocks, and logos from 21st.dev.
* **Installation & Auth:**
  1. Install CLI globally:
     ```bash
     npm i -g @21st-dev/cli
     ```
  2. Authenticate via browser:
     ```bash
     21st login
     ```
     This opens your browser, completes OAuth sign-in, and securely saves your session token to `~/.config/21st/auth.json`.
  3. Or obtain an API key directly from [21st.dev/mcp](https://21st.dev/mcp).
* **Config in `mcp_config.json`:**
  ```json
  "21st": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": ["-y", "@21st-dev/magic@0.2.3"],
    "env": {
      "API_KEY": "YOUR_21ST_TOKEN_HERE",
      "API_KEY_21ST": "YOUR_21ST_TOKEN_HERE"
    }
  }
  ```

---

#### 3. `context7` (Real-Time Documentation Lookup)
* **What it does:** Queries live, versioned documentation for React, Next.js, Prisma, Tailwind, Supabase, FastAPI, and hundreds of libraries.
* **Signup:** Free account at [context7.com](https://context7.com).
* **Config in `mcp_config.json`:**
  ```json
  "context7": {
    "serverUrl": "https://mcp.context7.com/mcp",
    "headers": {
      "Authorization": "Bearer YOUR_CONTEXT7_API_KEY"
    }
  }
  ```

---

#### 4. `StitchMCP` (Google Stitch UI Prototype Generator)
* **What it does:** Generates high-fidelity UI prototypes, screens, and design system tokens from prompt specifications.
* **API Key:** Google Stitch API Key from Google Cloud Console.
* **Config in `mcp_config.json`:**
  ```json
  "StitchMCP": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": [
      "-y",
      "mcp-remote@0.15.2",
      "https://stitch.googleapis.com/mcp",
      "--header",
      "X-Goog-Api-Key: YOUR_STITCH_API_KEY"
    ]
  }
  ```

---

#### 5. `chrome-devtools-mcp` (Chrome Automation & Lighthouse)
* **What it does:** Full Chrome DevTools Protocol automation, performance tracing, network request monitoring, and Lighthouse audits.
* **Auth:** None required.
* **Config in `mcp_config.json`:**
  ```json
  "chrome-devtools-mcp": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": ["-y", "chrome-devtools-mcp@1.12.0"]
  }
  ```

---

#### 6. `playwright` (Persistent Headless Browser)
* **What it does:** Automates web flows, screenshots, DOM queries, and form interactions for verification.
* **Auth:** None required.
* **Config in `mcp_config.json`:**
  ```json
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@0.0.84"],
    "disabled": false
  }
  ```

---

#### 7. `github-mcp-server` (GitHub Repository Management)
* **What it does:** Creates PRs, reviews code, manages issues, branches, and searches repositories directly.
* **Auth:** GitHub Personal Access Token (PAT):
  1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens).
  2. Create a classic token with `repo` scope, or fine-grained token with `Contents: Read and write`, `Pull requests: Read and write`, and `Issues: Read and write`.
* **Config in `mcp_config.json`:**
  ```json
  "github-mcp-server": {
    "$typeName": "exa.cascade_plugins_pb.CascadePluginCommandTemplate",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_GITHUB_PAT"
    }
  }
  ```

---

## 🧪 Testing & Verifying Connections

You can verify that your MCP servers are active and answering JSON-RPC calls with these commands:

### 1. Test `shadcn` MCP:
```bash
node -e "
const { spawn } = require('child_process');
const child = spawn('npx', ['-y', 'shadcn@4.23.0', 'mcp'], { shell: true });
child.stdout.on('data', d => console.log('Response:', d.toString()));
setTimeout(() => {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'get_add_command_for_items', arguments: { items: ['button'] } } }) + '\n');
}, 2000);
setTimeout(() => child.kill(), 6000);
"
```
*Expected Output:* `{"content":[{"type":"text","text":"npx shadcn@4.23.0 add button"}]}`

---

### 2. Test `21st` MCP:
```bash
node -e "
const fs = require('fs');
const { spawn } = require('child_process');
const auth = JSON.parse(fs.readFileSync(process.env.USERPROFILE + '/.config/21st/auth.json', 'utf8'));
const child = spawn('npx', ['-y', '@21st-dev/magic@0.2.3'], { env: { ...process.env, API_KEY: auth.token }, shell: true });
child.stdout.on('data', d => console.log('Response:', d.toString()));
setTimeout(() => {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'search', arguments: { query: 'button' } } }) + '\n');
}, 2000);
setTimeout(() => child.kill(), 6000);
"
```
*Expected Output:* `{"content":[{"type":"text","text":"... result(s) across 21st.dev ..."}]}`

---

## 🔒 Security Best Practices

1. **Zero Secret Leaks in Git:**
   - Never commit `~/.gemini/config/mcp_config.json` or `.env` files containing live keys into your Git repository.
   - Keep placeholders (`YOUR_API_KEY`) in the root `mcp.json`.
2. **Principle of Least Privilege:**
   - When generating your GitHub Personal Access Token, restrict access strictly to the repositories and scopes (`repo` or `contents:write`) needed.
3. **Session Refresh:**
   - Antigravity registers MCP servers and tool definitions at session startup. After editing `mcp_config.json`, restart your session or reload the IDE window to refresh the active tool dictionary.

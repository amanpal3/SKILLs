---
description: Install GSD into the current project from GitHub
---

# /install Workflow

<objective>
Install GSD for Antigravity into the current project from GitHub.
</objective>

<process>

## 1. Check for Existing Installation

Look for GSD marker directories:

**PowerShell:**
```powershell
$alreadyInstalled = (Test-Path ".agents") -or (Test-Path ".agent") -or (Test-Path ".gsd")
if ($alreadyInstalled) {
    Write-Output "GSD files detected in this project."
}
```

**Bash:**
```bash
if [ -d ".agents" ] || [ -d ".agent" ] || [ -d ".gsd" ]; then
    echo "GSD files detected in this project."
fi
```

**If already installed:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► ALREADY INSTALLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GSD files already exist in this project.

───────────────────────────────────────────────────────

A) Reinstall — Overwrite with latest version
B) Cancel — Keep current installation

If you want to update instead: /update

───────────────────────────────────────────────────────
```

If user chooses Cancel, exit.
If user chooses Reinstall, continue to Step 2.

---

## 2. Clone from GitHub (Pinned Immutable Release)

To prevent supply-chain attacks and unvetted remote code execution, always clone and check out a pinned release commit SHA:

**Bash:**
```bash
GSD_PINNED_COMMIT="5b7762fd6f5ad5119a6f591fa943c48b6ab6028a"
git clone https://github.com/toonight/get-shit-done-for-antigravity.git .gsd-install-temp
cd .gsd-install-temp
git checkout "$GSD_PINNED_COMMIT"

# Verify commit hash matches expected release digest
ACTUAL_COMMIT=$(git rev-parse HEAD)
if [ "$ACTUAL_COMMIT" != "$GSD_PINNED_COMMIT" ]; then
    echo "Security Error: Commit SHA mismatch ($ACTUAL_COMMIT != $GSD_PINNED_COMMIT). Aborting install."
    cd ..
    rm -rf .gsd-install-temp
    exit 1
fi
cd ..
```

**PowerShell:**
```powershell
$GsdPinnedCommit = "5b7762fd6f5ad5119a6f591fa943c48b6ab6028a"
git clone https://github.com/toonight/get-shit-done-for-antigravity.git .gsd-install-temp
Push-Location .gsd-install-temp
git checkout $GsdPinnedCommit
$actualCommit = (git rev-parse HEAD).Trim()
if ($actualCommit -ne $GsdPinnedCommit) {
    Pop-Location
    Remove-Item -Recurse -Force .gsd-install-temp
    throw "Security Error: Commit SHA mismatch ($actualCommit != $GsdPinnedCommit). Aborting install."
}
Pop-Location
```

---

## 2.5 Security Review & Diff Gate

Inspect incoming files before copying into the active workspace. Never install unreviewed binary executables or unknown scripts:

```bash
# Verify no untrusted binaries or scripts exist in incoming payload
git -C .gsd-install-temp diff HEAD~1 --stat
```

Prompt the user:
```
Incoming GSD release verified against pinned commit: 5b7762fd6f5ad5119a6f591fa943c48b6ab6028a.
Proceed with synchronizing verified files to workspace? (y/n)
```

---

## 3. Copy Files

**PowerShell:**
```powershell
# Core directories
Copy-Item -Recurse ".gsd-install-temp\.agent" ".\"
Copy-Item -Recurse ".gsd-install-temp\.agents" ".\"
Copy-Item -Recurse ".gsd-install-temp\.gemini" ".\"
Copy-Item -Recurse ".gsd-install-temp\.gsd" ".\"
Copy-Item -Recurse ".gsd-install-temp\adapters" ".\"
Copy-Item -Recurse ".gsd-install-temp\docs" ".\"
Copy-Item -Recurse ".gsd-install-temp\scripts" ".\"

# Root files
Copy-Item -Force ".gsd-install-temp\PROJECT_RULES.md" ".\"
Copy-Item -Force ".gsd-install-temp\GSD-STYLE.md" ".\"
Copy-Item -Force ".gsd-install-temp\model_capabilities.yaml" ".\"
```

**Bash:**
```bash
# Core directories
cp -r .gsd-install-temp/.agent ./
cp -r .gsd-install-temp/.agents ./
cp -r .gsd-install-temp/.gemini ./
cp -r .gsd-install-temp/.gsd ./
cp -r .gsd-install-temp/adapters ./
cp -r .gsd-install-temp/docs ./
cp -r .gsd-install-temp/scripts ./

# Root files
cp .gsd-install-temp/PROJECT_RULES.md ./
cp .gsd-install-temp/GSD-STYLE.md ./
cp .gsd-install-temp/model_capabilities.yaml ./
```

---

## 4. Cleanup

**PowerShell:**
```powershell
Remove-Item -Recurse -Force ".gsd-install-temp"
```

**Bash:**
```bash
rm -rf .gsd-install-temp
```

---

## 5. Add to .gitignore (Optional)

Check if `.gsd/STATE.md` and other session files should be gitignored:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► ADD TO .gitignore?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recommended .gitignore additions for session-specific files:

.gsd/STATE.md
.gsd/JOURNAL.md
.gsd/TODO.md

───────────────────────────────────────────────────────

A) Yes — Add recommended entries
B) No — Skip

───────────────────────────────────────────────────────
```

---

## 6. Confirm Installation

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► INSTALLED ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GSD for Antigravity has been installed.

Files installed:
• .agent/        (workflows)
• .agents/       (subagents + skills — Agent Skills standard)
• .gemini/       (Gemini integration)
• .gsd/          (project state templates)
• adapters/      (model-specific enhancements)
• docs/          (operational documentation)
• scripts/       (utility scripts)
• PROJECT_RULES.md
• GSD-STYLE.md
• model_capabilities.yaml

───────────────────────────────────────────────────────

Next step:

/new-project — Initialize your project with GSD

───────────────────────────────────────────────────────
```

</process>

<notes>
- This workflow is designed to work from a clean project (no prior GSD installation)
- It copies ALL necessary files, unlike manual installation which may miss some
- For updates to an existing installation, use /update instead
- The /new-project command should be run after installation to set up SPEC.md
</notes>

# ============================================================
# install-skills.ps1 — Portable Skill Installer
# ============================================================
# Usage:
#   .\install-skills.ps1 store    → Backup all skills to global store
#   .\install-skills.ps1 install  → Install skills from global store into current project
#   .\install-skills.ps1 install -TargetPath "C:\path\to\project"
# ============================================================

param(
    [Parameter(Position = 0)]
    [ValidateSet("store", "install")]
    [string]$Action = "install",

    [Parameter(Position = 1)]
    [string]$TargetPath = (Get-Location).Path
)

$GlobalStore = "$env:USERPROFILE\.gemini\global-skills"
$GeminiConfig = "$env:USERPROFILE\.gemini\config"
$SkillsSubdir = ".agent\skills"

# Security & Execution Safety Controls
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-SafePath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) {
        throw "Path cannot be null or empty."
    }
    $resolved = Resolve-Path $Path -ErrorAction SilentlyContinue
    $cleanPath = if ($resolved) { $resolved.Path } else { [System.IO.Path]::GetFullPath($Path) }

    $dangerousPaths = @(
        $env:SystemRoot,
        "$env:SystemDrive\",
        "$env:SystemDrive",
        "$env:SystemDrive\Windows",
        "$env:ProgramFiles",
        "${env:ProgramFiles(x86)}"
    )

    foreach ($dp in $dangerousPaths) {
        if ($dp -and ($cleanPath.TrimEnd('\') -eq $dp.TrimEnd('\'))) {
            throw "Security Block: Target path '$cleanPath' matches protected system directory '$dp'."
        }
    }
    return $cleanPath
}

function Write-Banner {
    param([string]$msg)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  $msg" -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

# ----------------------------------------------------------
# STORE: Copy skills from current project → global store & Antigravity config
# ----------------------------------------------------------
if ($Action -eq "store") {
    Write-Banner "STORING skills to global store & Antigravity config"

    $SourceSkills = Join-Path $PSScriptRoot ".agent\skills"
    $SourcePlugins = Join-Path $PSScriptRoot ".agent\plugins"
    $SourceWorkflows = Join-Path $PSScriptRoot ".agent\workflows"
    $SourceGemini = Join-Path $PSScriptRoot "GEMINI.md"
    $SourceClaude = Join-Path $PSScriptRoot "CLAUDE.md"
    $SourceAgents = Join-Path $PSScriptRoot "AGENTS.md"
    $SourceCodex = Join-Path $PSScriptRoot "CODEX.md"
    $SourcePonytail = Join-Path $PSScriptRoot "PONYTAIL.md"
    $SourceBackend = Join-Path $PSScriptRoot "backend.md"

    if (-not (Test-Path $SourceSkills)) {
        Write-Host "ERROR: No .agent\skills\ found at $PSScriptRoot" -ForegroundColor Red
        exit 1
    }

    # 1. Create global store
    if (-not (Test-Path $GlobalStore)) {
        New-Item -ItemType Directory -Path $GlobalStore -Force | Out-Null
    }

    # 2. Copy skills to Global Store
    $SkillsDest = Join-Path $GlobalStore "skills"
    if (Test-Path $SkillsDest) { Remove-Item $SkillsDest -Recurse -Force }
    Copy-Item $SourceSkills -Destination $SkillsDest -Recurse -Force
    Write-Host "[OK] Skills copied to $SkillsDest" -ForegroundColor Green

    # 3. Antigravity Global Discovery: ~/.gemini/config/skills
    $GeminiSkillsDest = Join-Path $GeminiConfig "skills"
    if (-not (Test-Path $GeminiSkillsDest)) { New-Item -ItemType Directory -Path $GeminiSkillsDest -Force | Out-Null }
    Copy-Item -Recurse -Force "$SourceSkills\*" $GeminiSkillsDest
    Write-Host "[OK] Skills synced to Antigravity global config ($GeminiSkillsDest)" -ForegroundColor Green

    # 4. Also sync ~/.agent/skills (Universal Agent standard)
    $AgentSkillsDest = "$env:USERPROFILE\.agent\skills"
    if (-not (Test-Path $AgentSkillsDest)) { New-Item -ItemType Directory -Path $AgentSkillsDest -Force | Out-Null }
    Copy-Item -Recurse -Force "$SourceSkills\*" $AgentSkillsDest
    Write-Host "[OK] Skills synced to $AgentSkillsDest" -ForegroundColor Green

    # 5. Also sync ~/.codex/skills (OpenAI Codex CLI)
    $CodexSkillsDest = "$env:USERPROFILE\.codex\skills"
    if (-not (Test-Path $CodexSkillsDest)) { New-Item -ItemType Directory -Path $CodexSkillsDest -Force | Out-Null }
    Copy-Item -Recurse -Force "$SourceSkills\*" $CodexSkillsDest
    Write-Host "[OK] Skills synced to $CodexSkillsDest" -ForegroundColor Green

    # 6. Also sync ~/.agents/skills (Cross-agent fallback)
    $AgentsSkillsDest = "$env:USERPROFILE\.agents\skills"
    if (-not (Test-Path $AgentsSkillsDest)) { New-Item -ItemType Directory -Path $AgentsSkillsDest -Force | Out-Null }
    Copy-Item -Recurse -Force "$SourceSkills\*" $AgentsSkillsDest
    Write-Host "[OK] Skills synced to $AgentsSkillsDest" -ForegroundColor Green

    # 7. Copy plugins
    if (Test-Path $SourcePlugins) {
        $PluginsDest = Join-Path $GlobalStore "plugins"
        if (Test-Path $PluginsDest) { Remove-Item $PluginsDest -Recurse -Force }
        Copy-Item $SourcePlugins -Destination $PluginsDest -Recurse -Force
        Write-Host "[OK] Plugins copied to $PluginsDest" -ForegroundColor Green

        # Antigravity Global Discovery: ~/.gemini/config/plugins
        $GeminiPluginsDest = Join-Path $GeminiConfig "plugins"
        if (-not (Test-Path $GeminiPluginsDest)) { New-Item -ItemType Directory -Path $GeminiPluginsDest -Force | Out-Null }
        Copy-Item -Recurse -Force "$SourcePlugins\*" $GeminiPluginsDest
        Write-Host "[OK] Plugins synced to Antigravity global config ($GeminiPluginsDest)" -ForegroundColor Green

        # Also sync ~/.agent/plugins
        $AgentPluginsDest = "$env:USERPROFILE\.agent\plugins"
        if (-not (Test-Path $AgentPluginsDest)) { New-Item -ItemType Directory -Path $AgentPluginsDest -Force | Out-Null }
        Copy-Item -Recurse -Force "$SourcePlugins\*" $AgentPluginsDest
        Write-Host "[OK] Plugins synced to $AgentPluginsDest" -ForegroundColor Green
    }

    # 8. Copy workflows
    if (Test-Path $SourceWorkflows) {
        $WorkflowsDest = Join-Path $GlobalStore "workflows"
        if (Test-Path $WorkflowsDest) { Remove-Item $WorkflowsDest -Recurse -Force }
        Copy-Item $SourceWorkflows -Destination $WorkflowsDest -Recurse -Force
        Write-Host "[OK] Workflows copied to $WorkflowsDest" -ForegroundColor Green

        $AgentWorkflowsDest = "$env:USERPROFILE\.agent\workflows"
        if (-not (Test-Path $AgentWorkflowsDest)) { New-Item -ItemType Directory -Path $AgentWorkflowsDest -Force | Out-Null }
        Copy-Item -Recurse -Force "$SourceWorkflows\*" $AgentWorkflowsDest
        Write-Host "[OK] Workflows synced to $AgentWorkflowsDest" -ForegroundColor Green
    }

    # 9. Copy GEMINI.md & rules
    $GeminiRulesDest = Join-Path $GeminiConfig "rules"
    if (-not (Test-Path $GeminiRulesDest)) { New-Item -ItemType Directory -Path $GeminiRulesDest -Force | Out-Null }

    if (Test-Path $SourceGemini) {
        Copy-Item $SourceGemini -Destination (Join-Path $GlobalStore "GEMINI.md") -Force
        Copy-Item $SourceGemini -Destination (Join-Path $GeminiRulesDest "GEMINI.md") -Force
        Write-Host "[OK] GEMINI.md copied & synced to Antigravity rules" -ForegroundColor Green
    } elseif (Test-Path $SourceAgents) {
        Copy-Item $SourceAgents -Destination (Join-Path $GlobalStore "GEMINI.md") -Force
        Copy-Item $SourceAgents -Destination (Join-Path $GeminiRulesDest "GEMINI.md") -Force
        Write-Host "[OK] GEMINI.md generated from AGENTS.md for Antigravity" -ForegroundColor Green
    }

    # Copy CLAUDE.md
    if (Test-Path $SourceClaude) {
        Copy-Item $SourceClaude -Destination (Join-Path $GlobalStore "CLAUDE.md") -Force
        Write-Host "[OK] CLAUDE.md copied" -ForegroundColor Green
    }

    # Copy AGENTS.md
    if (Test-Path $SourceAgents) {
        Copy-Item $SourceAgents -Destination (Join-Path $GlobalStore "AGENTS.md") -Force
        Write-Host "[OK] AGENTS.md copied" -ForegroundColor Green
    }

    # Copy CODEX.md
    if (Test-Path $SourceCodex) {
        Copy-Item $SourceCodex -Destination (Join-Path $GlobalStore "CODEX.md") -Force
        Write-Host "[OK] CODEX.md copied" -ForegroundColor Green
    }

    # Copy PONYTAIL.md
    if (Test-Path $SourcePonytail) {
        Copy-Item $SourcePonytail -Destination (Join-Path $GlobalStore "PONYTAIL.md") -Force
        Write-Host "[OK] PONYTAIL.md copied" -ForegroundColor Green
    }

    # Copy backend.md
    if (Test-Path $SourceBackend) {
        Copy-Item $SourceBackend -Destination (Join-Path $GlobalStore "backend.md") -Force
        Write-Host "[OK] backend.md copied" -ForegroundColor Green
    }

    # Generate manifest
    $skills = Get-ChildItem $SkillsDest -Directory | Select-Object -ExpandProperty Name
    $pluginNames = @()
    if (Test-Path (Join-Path $GlobalStore "plugins")) {
        $pluginNames = Get-ChildItem (Join-Path $GlobalStore "plugins") -Directory | Select-Object -ExpandProperty Name
    }
    $manifest = @{
        storedAt        = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        source          = $PSScriptRoot
        skillCount      = $skills.Count
        skills          = $skills
        pluginCount     = $pluginNames.Count
        plugins         = $pluginNames
        antigravityPath = $GeminiConfig
    }
    $manifest | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $GlobalStore "manifest.json")
    Write-Host "[OK] Manifest created ($($skills.Count) skills, $($pluginNames.Count) plugins)" -ForegroundColor Green

    $countMsg = "DONE -- " + $skills.Count + " skills and " + $pluginNames.Count + " plugins stored globally across Antigravity and Agent paths"
    Write-Banner $countMsg
}

# ----------------------------------------------------------
# INSTALL: Copy skills & plugins from global store → target project
# ----------------------------------------------------------
if ($Action -eq "install") {
    Write-Banner "INSTALLING skills and plugins into project"

    if (-not (Test-Path $GlobalStore)) {
        Write-Host "ERROR: No global skill store found at $GlobalStore" -ForegroundColor Red
        Write-Host "Run '.\install-skills.ps1 store' first from a project that has skills." -ForegroundColor Yellow
        exit 1
    }

    $SourceSkills = Join-Path $GlobalStore "skills"
    $SourcePlugins = Join-Path $GlobalStore "plugins"
    $SourceWorkflows = Join-Path $GlobalStore "workflows"
    $SourceGemini = Join-Path $GlobalStore "GEMINI.md"
    $SourceClaude = Join-Path $GlobalStore "CLAUDE.md"
    $SourceAgents = Join-Path $GlobalStore "AGENTS.md"
    $SourceCodex = Join-Path $GlobalStore "CODEX.md"
    $SourcePonytail = Join-Path $GlobalStore "PONYTAIL.md"
    $SourceBackend = Join-Path $GlobalStore "backend.md"

    # Validate and resolve target path safely
    $TargetPath = Assert-SafePath $TargetPath
    Write-Host "Target: $TargetPath" -ForegroundColor Yellow

    # Create .agent/skills/ in target
    $TargetSkills = Join-Path $TargetPath $SkillsSubdir
    if (-not (Test-Path $TargetSkills)) {
        New-Item -ItemType Directory -Path $TargetSkills -Force | Out-Null
    }

    # Copy each skill folder
    $installed = 0
    Get-ChildItem $SourceSkills -Directory | ForEach-Object {
        $dest = Join-Path $TargetSkills $_.Name
        Copy-Item $_.FullName -Destination $dest -Recurse -Force
        Write-Host "  [+] Skill: $($_.Name)" -ForegroundColor Green
        $installed++
    }

    # Copy plugins if present
    $pluginsInstalled = 0
    if (Test-Path $SourcePlugins) {
        $TargetPlugins = Join-Path $TargetPath ".agent\plugins"
        if (-not (Test-Path $TargetPlugins)) {
            New-Item -ItemType Directory -Path $TargetPlugins -Force | Out-Null
        }
        Get-ChildItem $SourcePlugins -Directory | ForEach-Object {
            $dest = Join-Path $TargetPlugins $_.Name
            Copy-Item $_.FullName -Destination $dest -Recurse -Force
            Write-Host "  [+] Plugin: $($_.Name)" -ForegroundColor Cyan
            $pluginsInstalled++
        }
    }

    # Copy workflows if present
    if (Test-Path $SourceWorkflows) {
        $TargetWorkflows = Join-Path $TargetPath ".agent\workflows"
        if (-not (Test-Path $TargetWorkflows)) {
            New-Item -ItemType Directory -Path $TargetWorkflows -Force | Out-Null
        }
        Get-ChildItem $SourceWorkflows -File | ForEach-Object {
            $dest = Join-Path $TargetWorkflows $_.Name
            Copy-Item $_.FullName -Destination $dest -Force
            Write-Host "  [+] Workflow: $($_.Name)" -ForegroundColor Green
        }
    }

    # Copy config files
    if (Test-Path $SourceGemini) {
        Copy-Item $SourceGemini -Destination (Join-Path $TargetPath "GEMINI.md") -Force
        Write-Host "  [+] GEMINI.md" -ForegroundColor Green
    }
    if (Test-Path $SourceClaude) {
        Copy-Item $SourceClaude -Destination (Join-Path $TargetPath "CLAUDE.md") -Force
        Write-Host "  [+] CLAUDE.md" -ForegroundColor Green
    }
    if (Test-Path $SourceAgents) {
        Copy-Item $SourceAgents -Destination (Join-Path $TargetPath "AGENTS.md") -Force
        Write-Host "  [+] AGENTS.md" -ForegroundColor Green
    }
    if (Test-Path $SourceCodex) {
        Copy-Item $SourceCodex -Destination (Join-Path $TargetPath "CODEX.md") -Force
        Write-Host "  [+] CODEX.md" -ForegroundColor Green
    }
    if (Test-Path $SourcePonytail) {
        Copy-Item $SourcePonytail -Destination (Join-Path $TargetPath "PONYTAIL.md") -Force
        Write-Host "  [+] PONYTAIL.md" -ForegroundColor Green
    }
    if (Test-Path $SourceBackend) {
        Copy-Item $SourceBackend -Destination (Join-Path $TargetPath "backend.md") -Force
        Write-Host "  [+] backend.md" -ForegroundColor Green
    }

    $doneMsg = "DONE -- " + $installed + " skills and " + $pluginsInstalled + " plugins installed into " + $TargetPath
    Write-Banner $doneMsg
}

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
$SkillsSubdir = ".agent\skills"

function Write-Banner {
    param([string]$msg)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  $msg" -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

# ----------------------------------------------------------
# STORE: Copy skills from current project → global store
# ----------------------------------------------------------
if ($Action -eq "store") {
    Write-Banner "STORING skills to global store"

    $SourceSkills = Join-Path $PSScriptRoot ".agent\skills"
    $SourcePlugins = Join-Path $PSScriptRoot ".agent\plugins"
    $SourceClaude = Join-Path $PSScriptRoot "CLAUDE.md"
    $SourceAgents = Join-Path $PSScriptRoot "AGENTS.md"
    $SourcePonytail = Join-Path $PSScriptRoot "PONYTAIL.md"
    $SourceBackend = Join-Path $PSScriptRoot "backend.md"

    if (-not (Test-Path $SourceSkills)) {
        Write-Host "ERROR: No .agent\skills\ found at $PSScriptRoot" -ForegroundColor Red
        exit 1
    }

    # Create global store
    if (-not (Test-Path $GlobalStore)) {
        New-Item -ItemType Directory -Path $GlobalStore -Force | Out-Null
    }

    # Copy skills
    $SkillsDest = Join-Path $GlobalStore "skills"
    if (Test-Path $SkillsDest) { Remove-Item $SkillsDest -Recurse -Force }
    Copy-Item $SourceSkills -Destination $SkillsDest -Recurse -Force
    Write-Host "[OK] Skills copied to $SkillsDest" -ForegroundColor Green

    # Copy plugins
    if (Test-Path $SourcePlugins) {
        $PluginsDest = Join-Path $GlobalStore "plugins"
        if (Test-Path $PluginsDest) { Remove-Item $PluginsDest -Recurse -Force }
        Copy-Item $SourcePlugins -Destination $PluginsDest -Recurse -Force
        Write-Host "[OK] Plugins copied to $PluginsDest" -ForegroundColor Green
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
        storedAt    = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        source      = $PSScriptRoot
        skillCount  = $skills.Count
        skills      = $skills
        pluginCount = $pluginNames.Count
        plugins     = $pluginNames
    }
    $manifest | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $GlobalStore "manifest.json")
    Write-Host "[OK] Manifest created ($($skills.Count) skills, $($pluginNames.Count) plugins)" -ForegroundColor Green

    $countMsg = "DONE -- " + $skills.Count + " skills and " + $pluginNames.Count + " plugins stored globally"
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
    $SourceClaude = Join-Path $GlobalStore "CLAUDE.md"
    $SourceAgents = Join-Path $GlobalStore "AGENTS.md"
    $SourcePonytail = Join-Path $GlobalStore "PONYTAIL.md"
    $SourceBackend = Join-Path $GlobalStore "backend.md"

    # Resolve target
    $resolved = Resolve-Path $TargetPath -ErrorAction SilentlyContinue
    if ($resolved) { $TargetPath = $resolved.Path }
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

    # Copy config files
    if (Test-Path $SourceClaude) {
        Copy-Item $SourceClaude -Destination (Join-Path $TargetPath "CLAUDE.md") -Force
        Write-Host "  [+] CLAUDE.md" -ForegroundColor Green
    }
    if (Test-Path $SourceAgents) {
        Copy-Item $SourceAgents -Destination (Join-Path $TargetPath "AGENTS.md") -Force
        Write-Host "  [+] AGENTS.md" -ForegroundColor Green
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

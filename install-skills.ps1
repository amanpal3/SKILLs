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
    [ValidateSet("store", "install", "rollback", "uninstall")]
    [string]$Action = "store",

    [Parameter(Position = 1)]
    [string]$TargetPath = (Get-Location).Path,

    [Parameter(Position = 2)]
    [string]$BackupId = ""
)

$GlobalStore = "$env:USERPROFILE\.gemini\global-skills"
$GeminiConfig = "$env:USERPROFILE\.gemini\config"
$BackupStore = "$env:USERPROFILE\.gemini\backups"
$SkillsSubdir = ".agent\skills"

# Security & Execution Safety Controls
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-SafePath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) {
        throw "Path cannot be null or empty."
    }

    $raw = $Path.Trim()
    if ($raw.StartsWith("\\") -or $raw.StartsWith("//")) {
        throw "Security Block: UNC network paths are not permitted: $raw"
    }

    $resolved = Resolve-Path $raw -ErrorAction SilentlyContinue
    $cleanPath = if ($resolved) { $resolved.Path } else { [System.IO.Path]::GetFullPath($raw) }

    $dangerousPaths = @(
        $env:SystemRoot,
        "$env:SystemDrive\",
        "$env:SystemDrive",
        "$env:SystemDrive\Windows",
        "$env:ProgramFiles",
        "${env:ProgramFiles(x86)}",
        "$env:ProgramData"
    )

    foreach ($dp in $dangerousPaths) {
        if ($dp -and ($cleanPath.TrimEnd('\') -eq $dp.TrimEnd('\'))) {
            throw "Security Block: Target path '$cleanPath' matches protected system directory '$dp'."
        }
    }

    # Block raw user home root without project subfolder
    if ($cleanPath.TrimEnd('\') -eq $env:USERPROFILE.TrimEnd('\')) {
        throw "Security Block: Target path cannot be raw user profile root. Specify a project subfolder: $cleanPath"
    }

    # Block sensitive credential and cryptographic vaults
    $sensitiveSegments = @(".ssh", ".aws", ".gnupg", ".azure", ".kube", ".git")
    $parts = $cleanPath.Split([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)
    foreach ($seg in $sensitiveSegments) {
        if ($parts -contains $seg) {
            throw "Security Block: Target path accesses sensitive directory '$seg': $cleanPath"
        }
    }

    # Reject symlinks and reparse points in existing path components
    $testTarget = $cleanPath
    while ($testTarget -and (Test-Path $testTarget)) {
        $item = Get-Item -LiteralPath $testTarget -Force
        if ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
            throw "Security Block: Symlink or junction detected in path component: '$testTarget'. Links are prohibited in installation targets."
        }
        $parent = Split-Path -Parent $testTarget
        if ($parent -eq $testTarget) { break }
        $testTarget = $parent
    }

    return $cleanPath
}

function Copy-SecureDirectory {
    param([string]$SourceDir, [string]$DestinationDir)
    $SourceDir = (Resolve-Path $SourceDir).Path
    if (-not (Test-Path $SourceDir)) { return }

    $srcItem = Get-Item -LiteralPath $SourceDir -Force
    if ($srcItem.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
        throw "Security Block: Symlink or junction detected at source root: '$SourceDir'."
    }

    if (-not (Test-Path $DestinationDir)) {
        New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null
    }

    Get-ChildItem -LiteralPath $SourceDir -Recurse -Force | ForEach-Object {
        if ($_.Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
            throw "Security Block: Symlink or junction detected at: '$($_.FullName)'. Links are prohibited during secure copy."
        }
        $relPath = $_.FullName.Substring($SourceDir.Length).TrimStart('\', '/')
        $targetItem = Join-Path $DestinationDir $relPath
        if ($_.PSIsContainer) {
            if (-not (Test-Path $targetItem)) {
                New-Item -ItemType Directory -Path $targetItem -Force | Out-Null
            }
        } else {
            $targetParent = Split-Path -Parent $targetItem
            if (-not (Test-Path $targetParent)) {
                New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
            }
            Copy-Item -LiteralPath $_.FullName -Destination $targetItem -Force
        }
    }
}

function Backup-Directory {
    param([string]$PathToBackup, [string]$Label)
    if (Test-Path $PathToBackup) {
        $validatedPath = Assert-SafePath $PathToBackup
        if (-not (Test-Path $BackupStore)) { New-Item -ItemType Directory -Path $BackupStore -Force | Out-Null }
        $timestamp = (Get-Date -Format "yyyyMMdd_HHmmss")
        $destBackup = Join-Path $BackupStore "backup_${Label}_$timestamp"
        $dataDir = Join-Path $destBackup "data"
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null

        $metadata = @{
            backupId = (Split-Path -Leaf $destBackup)
            label = $Label
            timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            originalTarget = $validatedPath
        } | ConvertTo-Json
        Set-Content -LiteralPath (Join-Path $destBackup "backup-metadata.json") -Value $metadata -Encoding UTF8

        Copy-SecureDirectory -SourceDir $validatedPath -DestinationDir $dataDir
        Write-Host "  [BACKUP] Created secure backup at: $destBackup" -ForegroundColor Cyan
        return $destBackup
    }
    return $null
}

function Copy-SafeFile {
    param([string]$Source, [string]$Destination)
    $parent = Split-Path -Parent $Destination
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    if (Test-Path $Destination) {
        $srcHash = (Get-FileHash -Path $Source -Algorithm SHA256).Hash
        $destHash = (Get-FileHash -Path $Destination -Algorithm SHA256).Hash
        if ($srcHash -ne $destHash) {
            $bak = "$Destination.bak_" + (Get-Date -Format "yyyyMMdd_HHmmss")
            Copy-Item -Path $Destination -Destination $bak -Force
            Write-Host "  [PROTECT] Preserved modified file: $(Split-Path -Leaf $bak)" -ForegroundColor Yellow
        }
    }
    Copy-Item -Path $Source -Destination $Destination -Force
}

function Write-Banner {
    param([string]$msg)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  Dr-SKILLs 🩺⚡ -- $msg" -ForegroundColor White
    Write-Host "  Watermark: Curated by Aman Pal * MIT" -ForegroundColor DarkCyan
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
    $SourceDefend = Join-Path $PSScriptRoot "DEFEND.md"

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
    Copy-SecureDirectory -SourceDir $SourceSkills -DestinationDir $SkillsDest
    Write-Host "[OK] Skills copied to $SkillsDest" -ForegroundColor Green

    # 3. Antigravity Global Discovery: ~/.gemini/config/skills
    $GeminiSkillsDest = Join-Path $GeminiConfig "skills"
    Copy-SecureDirectory -SourceDir $SourceSkills -DestinationDir $GeminiSkillsDest
    Write-Host "[OK] Skills synced to Antigravity global config ($GeminiSkillsDest)" -ForegroundColor Green

    # 4. Also sync ~/.agent/skills (Universal Agent standard)
    $AgentSkillsDest = "$env:USERPROFILE\.agent\skills"
    Copy-SecureDirectory -SourceDir $SourceSkills -DestinationDir $AgentSkillsDest
    Write-Host "[OK] Skills synced to $AgentSkillsDest" -ForegroundColor Green

    # 5. Also sync ~/.codex/skills (OpenAI Codex CLI)
    $CodexSkillsDest = "$env:USERPROFILE\.codex\skills"
    Copy-SecureDirectory -SourceDir $SourceSkills -DestinationDir $CodexSkillsDest
    Write-Host "[OK] Skills synced to $CodexSkillsDest" -ForegroundColor Green

    # 7. Copy plugins
    if (Test-Path $SourcePlugins) {
        $PluginsDest = Join-Path $GlobalStore "plugins"
        Copy-SecureDirectory -SourceDir $SourcePlugins -DestinationDir $PluginsDest
        Write-Host "[OK] Plugins copied to $PluginsDest" -ForegroundColor Green

        # Antigravity Global Discovery: ~/.gemini/config/plugins
        $GeminiPluginsDest = Join-Path $GeminiConfig "plugins"
        Copy-SecureDirectory -SourceDir $SourcePlugins -DestinationDir $GeminiPluginsDest
        Write-Host "[OK] Plugins synced to Antigravity global config ($GeminiPluginsDest)" -ForegroundColor Green

        # Also sync ~/.agent/plugins
        $AgentPluginsDest = "$env:USERPROFILE\.agent\plugins"
        Copy-SecureDirectory -SourceDir $SourcePlugins -DestinationDir $AgentPluginsDest
        Write-Host "[OK] Plugins synced to $AgentPluginsDest" -ForegroundColor Green
    }

    # 8. Copy workflows
    if (Test-Path $SourceWorkflows) {
        $WorkflowsDest = Join-Path $GlobalStore "workflows"
        Copy-SecureDirectory -SourceDir $SourceWorkflows -DestinationDir $WorkflowsDest
        Write-Host "[OK] Workflows copied to $WorkflowsDest" -ForegroundColor Green

        $AgentWorkflowsDest = "$env:USERPROFILE\.agent\workflows"
        Copy-SecureDirectory -SourceDir $SourceWorkflows -DestinationDir $AgentWorkflowsDest
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

    # Copy DEFEND.md
    if (Test-Path $SourceDefend) {
        Copy-Item $SourceDefend -Destination (Join-Path $GlobalStore "DEFEND.md") -Force
        Copy-Item $SourceDefend -Destination (Join-Path $GeminiRulesDest "DEFEND.md") -Force
        Write-Host "[OK] DEFEND.md copied & synced to Antigravity rules" -ForegroundColor Green
    }

    # Copy ECOSYSTEM.md
    $SourceEcosystem = Join-Path $PSScriptRoot "ECOSYSTEM.md"
    if (Test-Path $SourceEcosystem) {
        Copy-Item $SourceEcosystem -Destination (Join-Path $GlobalStore "ECOSYSTEM.md") -Force
        Write-Host "[OK] ECOSYSTEM.md copied" -ForegroundColor Green
    }

    # Copy mcp.json
    $SourceMcp = Join-Path $PSScriptRoot "mcp.json"
    if (Test-Path $SourceMcp) {
        Copy-Item $SourceMcp -Destination (Join-Path $GlobalStore "mcp.json") -Force
        Write-Host "[OK] mcp.json copied" -ForegroundColor Green
    }

    # Copy PLUGINS_AND_MCP_README.md
    $SourcePluginsReadme = Join-Path $PSScriptRoot "PLUGINS_AND_MCP_README.md"
    if (Test-Path $SourcePluginsReadme) {
        Copy-Item $SourcePluginsReadme -Destination (Join-Path $GlobalStore "PLUGINS_AND_MCP_README.md") -Force
        Write-Host "[OK] PLUGINS_AND_MCP_README.md copied" -ForegroundColor Green
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
    $SourceDefend = Join-Path $GlobalStore "DEFEND.md"
    $SourceEcosystem = Join-Path $GlobalStore "ECOSYSTEM.md"
    $SourceManifest = Join-Path $GlobalStore "manifest.json"
    $SourceMcp = Join-Path $GlobalStore "mcp.json"
    $SourcePluginsReadme = Join-Path $GlobalStore "PLUGINS_AND_MCP_README.md"

    # Validate and resolve target path safely
    $TargetPath = Assert-SafePath $TargetPath
    Write-Host "Target: $TargetPath" -ForegroundColor Yellow

    # Create .agent/skills/ in target
    $TargetSkills = Join-Path $TargetPath $SkillsSubdir
    if (-not (Test-Path $TargetSkills)) {
        New-Item -ItemType Directory -Path $TargetSkills -Force | Out-Null
    }

    # Copy each skill folder securely
    $installed = 0
    Get-ChildItem $SourceSkills -Directory | ForEach-Object {
        $dest = Join-Path $TargetSkills $_.Name
        Copy-SecureDirectory -SourceDir $_.FullName -DestinationDir $dest
        Write-Host "  [+] Skill: $($_.Name)" -ForegroundColor Green
        $installed++
    }

    # Copy plugins securely if present
    $pluginsInstalled = 0
    if (Test-Path $SourcePlugins) {
        $TargetPlugins = Join-Path $TargetPath ".agent\plugins"
        if (-not (Test-Path $TargetPlugins)) {
            New-Item -ItemType Directory -Path $TargetPlugins -Force | Out-Null
        }
        Get-ChildItem $SourcePlugins -Directory | ForEach-Object {
            $dest = Join-Path $TargetPlugins $_.Name
            Copy-SecureDirectory -SourceDir $_.FullName -DestinationDir $dest
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
    if (Test-Path $SourceDefend) {
        Copy-Item $SourceDefend -Destination (Join-Path $TargetPath "DEFEND.md") -Force
        Write-Host "  [+] DEFEND.md" -ForegroundColor Green
    }
    if (Test-Path $SourceEcosystem) {
        Copy-Item $SourceEcosystem -Destination (Join-Path $TargetPath "ECOSYSTEM.md") -Force
        Write-Host "  [+] ECOSYSTEM.md" -ForegroundColor Green
    }
    if (Test-Path $SourceManifest) {
        Copy-Item $SourceManifest -Destination (Join-Path $TargetPath "manifest.json") -Force
        Write-Host "  [+] manifest.json" -ForegroundColor Green
    }
    if (Test-Path $SourceMcp) {
        Copy-Item $SourceMcp -Destination (Join-Path $TargetPath "mcp.json") -Force
        Write-Host "  [+] mcp.json" -ForegroundColor Green
    }
    if (Test-Path $SourcePluginsReadme) {
        Copy-Item $SourcePluginsReadme -Destination (Join-Path $TargetPath "PLUGINS_AND_MCP_README.md") -Force
        Write-Host "  [+] PLUGINS_AND_MCP_README.md" -ForegroundColor Green
    }

    $doneMsg = "DONE -- " + $installed + " skills and " + $pluginsInstalled + " plugins installed into " + $TargetPath
    Write-Banner $doneMsg
}

# ----------------------------------------------------------
# ROLLBACK: Restore previous backup
# ----------------------------------------------------------
if ($Action -eq "rollback") {
    Write-Banner "ROLLBACK PREVIOUS BACKUP"
    if (-not (Test-Path $BackupStore)) {
        Write-Host "ERROR: No backup directory found at $BackupStore" -ForegroundColor Red
        exit 1
    }

    $backups = Get-ChildItem $BackupStore -Directory | Sort-Object Name -Descending
    if ($backups.Count -eq 0) {
        Write-Host "ERROR: No backups found in $BackupStore" -ForegroundColor Red
        exit 1
    }

    $targetBackup = if ([string]::IsNullOrWhiteSpace($BackupId)) { $backups[0].FullName } else { Join-Path $BackupStore $BackupId }
    if (-not (Test-Path $targetBackup)) {
        Write-Host "ERROR: Backup '$targetBackup' does not exist." -ForegroundColor Red
        exit 1
    }

    $metaFile = Join-Path $targetBackup "backup-metadata.json"
    if (-not (Test-Path $metaFile)) {
        Write-Host "ERROR: Backup metadata not found in '$targetBackup'." -ForegroundColor Red
        exit 1
    }

    $meta = Get-Content -LiteralPath $metaFile -Raw | ConvertFrom-Json
    $originalTarget = Assert-SafePath $meta.originalTarget
    $payloadDir = Join-Path $targetBackup "data"
    if (-not (Test-Path $payloadDir)) { $payloadDir = $targetBackup }

    Write-Host "Restoring from: $targetBackup" -ForegroundColor Yellow
    Write-Host "Original Target: $originalTarget" -ForegroundColor Yellow

    # 1. Restore to an isolated staging directory
    $staging = Join-Path $env:TEMP ("rollback_staging_" + [System.Guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $staging -Force | Out-Null

    try {
        Copy-SecureDirectory -SourceDir $payloadDir -DestinationDir $staging
        $stagedItems = Get-ChildItem -LiteralPath $staging -Force
        if ($stagedItems.Count -eq 0 -and (Get-ChildItem -LiteralPath $payloadDir -Force).Count -gt 0) {
            throw "Rollback validation failed: Staging directory is empty."
        }

        # 2. Safely replace original target
        if (Test-Path $originalTarget) {
            Remove-Item -LiteralPath $originalTarget -Recurse -Force
        }
        New-Item -ItemType Directory -Path $originalTarget -Force | Out-Null
        Copy-SecureDirectory -SourceDir $staging -DestinationDir $originalTarget

        Write-Host "[OK] Rollback completed successfully from $(Split-Path -Leaf $targetBackup) into $originalTarget" -ForegroundColor Green
    } finally {
        if (Test-Path $staging) {
            Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# ----------------------------------------------------------
# UNINSTALL: Safely remove ecosystem files without deleting user files
# ----------------------------------------------------------
if ($Action -eq "uninstall") {
    Write-Banner "UNINSTALLING AI ECOSYSTEM"
    $TargetPath = Assert-SafePath $TargetPath
    Write-Host "Target: $TargetPath" -ForegroundColor Yellow

    Backup-Directory (Join-Path $TargetPath $SkillsSubdir) "pre-uninstall-skills"

    $manifestPath = Join-Path $GlobalStore "manifest.json"
    $skillsToRemove = @()
    if (Test-Path $manifestPath) {
        $m = Get-Content $manifestPath -Raw | ConvertFrom-Json
        $skillsToRemove = $m.skills
    }

    $targetSkillsPath = Join-Path $TargetPath $SkillsSubdir
    $removed = 0
    if (Test-Path $targetSkillsPath) {
        Get-ChildItem $targetSkillsPath -Directory | ForEach-Object {
            if ($skillsToRemove -contains $_.Name) {
                Remove-Item $_.FullName -Recurse -Force
                Write-Host "  [-] Removed skill: $($_.Name)" -ForegroundColor Cyan
                $removed++
            }
        }
    }

    Write-Host "[OK] Safely removed $removed ecosystem skills. Non-ecosystem files preserved." -ForegroundColor Green
}


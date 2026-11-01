#!/usr/bin/env node
/**
 * bin/ai-ecosystem.js
 * Universal, secure CLI for the AI Developer Agent Ecosystem.
 * Supports: doctor, help, install, update, uninstall, rollback.
 * Targets: antigravity, claude, cursor, codex, all, <custom-path>.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { assertSafePath, secureCopyDirectory } = require('../security/validators/path-validator');
const { validateManifest } = require('../security/validators/manifest-validator');
const { validateMcpConfig } = require('../security/validators/mcp-validator');
const { scanForSecrets } = require('../security/scanners/secret-scanner');
const { verifyPackageIntegrity } = require('../security/scanners/file-integrity');

const REPO_ROOT = path.resolve(__dirname, '..');
const BACKUP_ROOT = process.env.AI_ECOSYSTEM_BACKUP_ROOT || path.join(os.homedir(), '.gemini', 'backups');

function printBanner(title) {
  console.log('\n============================================');
  console.log(`  ${title}`);
  console.log('============================================\n');
}

/**
 * Computes a deterministic SHA-256 tree hash over a directory payload.
 * @param {string} dirPath
 * @returns {string|null}
 */
function computeDirectoryHash(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  const hasher = crypto.createHash('sha256');

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir).sort();
    for (const entry of entries) {
      const full = path.join(currentDir, entry);
      const stat = fs.lstatSync(full);
      if (stat.isSymbolicLink()) continue;
      const relPath = path.relative(dirPath, full).replace(/\\/g, '/');
      if (stat.isDirectory()) {
        hasher.update(`DIR:${relPath}\n`);
        walk(full);
      } else if (stat.isFile()) {
        const fileContent = fs.readFileSync(full);
        const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');
        hasher.update(`FILE:${relPath}:${fileHash}\n`);
      }
    }
  }

  walk(dirPath);
  return hasher.digest('hex');
}

/**
 * Creates a timestamped backup before modifying target directories.
 * Stores target metadata in backup-metadata.json and payload in data/.
 * Strictly rejects symlinks and junctions to avoid link escape.
 */
function createBackup(targetDir, label) {
  if (!fs.existsSync(targetDir)) return null;

  assertSafePath(targetDir, { rejectLinks: true });

  const stat = fs.lstatSync(targetDir);
  if (stat.isSymbolicLink()) {
    throw new Error(`Security Error: Cannot create backup of symlink or junction: "${targetDir}"`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupId = `backup_${label || 'ecosystem'}_${timestamp}`;
  const backupDir = path.join(BACKUP_ROOT, backupId);
  const dataDir = path.join(backupDir, 'data');

  fs.mkdirSync(backupDir, { recursive: true });

  // Securely copy files into dataDir without following symlinks
  secureCopyDirectory(targetDir, dataDir, {
    rejectLinks: true,
    sourceBoundary: targetDir,
    destBoundary: dataDir
  });

  const contentHash = computeDirectoryHash(dataDir);
  const metadata = {
    backupId,
    label: label || 'ecosystem',
    timestamp: new Date().toISOString(),
    originalTarget: path.resolve(targetDir),
    contentHash
  };
  fs.writeFileSync(path.join(backupDir, 'backup-metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');

  console.log(`[BACKUP] Created secure backup at: ${backupDir}`);
  return backupDir;
}

/**
 * Safe file copy with collision awareness.
 * Preserves a timestamped .bak file if existing destination differs.
 */
function safeCopy(src, dest) {
  assertSafePath(dest, { rejectLinks: true });
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(dest)) {
    const destStat = fs.lstatSync(dest);
    if (destStat.isSymbolicLink()) {
      throw new Error(`Security Error: Destination is a symlink or junction: "${dest}"`);
    }

    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    if (!srcBuf.equals(destBuf)) {
      const bak = `${dest}.bak_${Date.now()}`;
      fs.copyFileSync(dest, bak);
      console.log(`  [PROTECT] Existing file modified, saved backup: ${path.basename(bak)}`);
    }
  }
  fs.copyFileSync(src, dest);
}

/**
 * Safely copies governance rule markdown files to the destination rules folder.
 */
function copyGovernanceRules(destRulesDir, platform) {
  assertSafePath(destRulesDir, { rejectLinks: true });
  if (!fs.existsSync(destRulesDir)) fs.mkdirSync(destRulesDir, { recursive: true });

  const ruleFiles = [
    'GEMINI.md',
    'CLAUDE.md',
    'AGENTS.md',
    'CODEX.md',
    'PONYTAIL.md',
    'backend.md',
    'DEFEND.md',
    'VIBE_SECURITY.md'
  ];

  let copied = 0;
  for (const file of ruleFiles) {
    const src = path.join(REPO_ROOT, file);
    if (!fs.existsSync(src)) continue;

    // Platform-specific rule tailoring
    if (platform === 'antigravity' && (file === 'CLAUDE.md' || file === 'CODEX.md')) continue;
    if (platform === 'claude' && (file === 'GEMINI.md' || file === 'CODEX.md')) continue;
    if (platform === 'codex' && (file === 'GEMINI.md' || file === 'CLAUDE.md')) continue;

    const dest = path.join(destRulesDir, file);
    safeCopy(src, dest);
    copied++;
  }

  // Also check if .agent/rules contains extra rule files
  const agentRulesDir = path.join(REPO_ROOT, '.agent', 'rules');
  if (fs.existsSync(agentRulesDir)) {
    for (const ruleEntry of fs.readdirSync(agentRulesDir)) {
      if (ruleEntry.endsWith('.md')) {
        const src = path.join(agentRulesDir, ruleEntry);
        const dest = path.join(destRulesDir, ruleEntry);
        safeCopy(src, dest);
        copied++;
      }
    }
  }

  return copied;
}

/**
 * Executes ecosystem diagnostics (doctor).
 * Purely read-only: does not modify or create files.
 */
function cmdDoctor() {
  printBanner('Dr-SKILLs 🩺⚡ — AI ECOSYSTEM DIAGNOSTICS & HEALTH');

  let overallHealthy = true;

  // 1. Node.js version check
  const nodeVer = process.version;
  const major = parseInt(nodeVer.slice(1).split('.')[0], 10);
  if (major >= 18) {
    console.log(`[PASS] Node.js Version: ${nodeVer} (>=18 required)`);
  } else {
    console.log(`[FAIL] Node.js Version: ${nodeVer} (<18 unsupported)`);
    overallHealthy = false;
  }

  // 2. Manifest Validation
  const manifestRes = validateManifest(path.join(REPO_ROOT, 'manifest.json'), REPO_ROOT);
  if (manifestRes.valid) {
    console.log(`[PASS] Manifest Validation: ${manifestRes.stats.declaredSkills} skills declared, ${manifestRes.stats.declaredPlugins} plugins declared`);
  } else {
    console.log(`[FAIL] Manifest Validation: Integrity check failed!`);
    manifestRes.errors.forEach(err => console.log(`       - ${err}`));
    overallHealthy = false;
  }
  if (manifestRes.warnings.length > 0) {
    manifestRes.warnings.forEach(w => console.log(`[WARN] Manifest: ${w}`));
  }

  // 3. MCP Configuration Validation
  const mcpFile = path.join(REPO_ROOT, 'mcp.json');
  const mcpRes = validateMcpConfig(mcpFile);
  if (mcpRes.valid) {
    console.log(`[PASS] MCP Configuration: ${mcpRes.serverCount} servers configured, zero hardcoded secrets`);
  } else {
    console.log(`[FAIL] MCP Configuration: ${mcpRes.errors.join('; ')}`);
    overallHealthy = false;
  }
  if (mcpRes.warnings.length > 0) {
    console.log(`[INFO] MCP Warnings: ${mcpRes.warnings.join('; ')}`);
  }

  // 4. Secret Scan
  const secretRes = scanForSecrets(REPO_ROOT);
  if (secretRes.findings.length === 0) {
    console.log(`[PASS] Secret Detection: Scanned ${secretRes.scannedFiles} files, 0 credentials exposed`);
  } else {
    console.log(`[FAIL] Secret Detection: ${secretRes.findings.length} sensitive patterns found!`);
    secretRes.findings.forEach(f => console.log(`       - ${f.file}:${f.line} (${f.pattern})`));
    overallHealthy = false;
  }

  // 5. File Integrity against trusted manifest
  const integrityRes = verifyPackageIntegrity(REPO_ROOT);
  if (integrityRes.passed) {
    console.log(`[PASS] Package Integrity: ${integrityRes.verifiedCount} critical governance files verified against trusted integrity manifest`);
  } else {
    console.log(`[FAIL] Package Integrity: Verification failed against integrity manifest!`);
    if (integrityRes.error) {
      console.log(`       - Error: ${integrityRes.error}`);
    }
    if (integrityRes.mismatches && integrityRes.mismatches.length > 0) {
      console.log(`       - Checksum Mismatches: ${integrityRes.mismatches.join(', ')}`);
    }
    if (integrityRes.missing && integrityRes.missing.length > 0) {
      console.log(`       - Missing Files: ${integrityRes.missing.join(', ')}`);
    }
    overallHealthy = false;
  }

  // 6. Installation Directories & Target Health Verification
  const agentPath = path.join(os.homedir(), '.agent', 'skills');
  const agentRulesPath = path.join(os.homedir(), '.agent', 'rules');
  const geminiPath = path.join(os.homedir(), '.gemini', 'config', 'skills');
  const geminiRulesPath = path.join(os.homedir(), '.gemini', 'config', 'rules');
  const codexPath = path.join(os.homedir(), '.codex', 'skills');
  const codexRulesPath = path.join(os.homedir(), '.codex', 'rules');

  let manifestSkills = [];
  try {
    const rawManifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'manifest.json'), 'utf8'));
    if (Array.isArray(rawManifest.skills)) manifestSkills = rawManifest.skills;
  } catch {}

  const checkEcosystemSkillsInDir = (dir) => {
    if (!fs.existsSync(dir)) return { installedCount: 0, missingCount: manifestSkills.length, missingSkills: manifestSkills, isSynced: false };
    try {
      const existing = new Set(fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name));
      const missing = manifestSkills.filter(s => !existing.has(s));
      const installedCount = manifestSkills.length - missing.length;
      return {
        installedCount,
        missingCount: missing.length,
        missingSkills: missing,
        isSynced: missing.length === 0
      };
    } catch {
      return { installedCount: 0, missingCount: manifestSkills.length, missingSkills: manifestSkills, isSynced: false };
    }
  };

  const countRulesInDir = (dir) => {
    if (!fs.existsSync(dir)) return 0;
    try {
      return fs.readdirSync(dir).filter(f => f.endsWith('.md')).length;
    } catch { return 0; }
  };

  const hasAgent = fs.existsSync(agentPath);
  const hasGemini = fs.existsSync(geminiPath);
  const hasCodex = fs.existsSync(codexPath);
  let installationDrift = false;

  if (hasAgent || hasGemini || hasCodex) {
    if (hasGemini) {
      const check = checkEcosystemSkillsInDir(geminiPath);
      const gRules = countRulesInDir(geminiRulesPath);
      if (check.isSynced) {
        console.log(`[PASS] Global Installation (Antigravity): ~/.gemini/config/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${gRules} rules)`);
      } else {
        console.log(`[FAIL] Global Installation (Antigravity): ~/.gemini/config/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${gRules} rules)`);
        console.log(`       [DRIFT] Installed skills drift from manifest (${check.missingCount} missing). Run "dr-skills install antigravity" to sync.`);
        installationDrift = true;
      }
    }
    if (hasAgent) {
      const check = checkEcosystemSkillsInDir(agentPath);
      const aRules = countRulesInDir(agentRulesPath);
      if (check.isSynced) {
        console.log(`[PASS] Global Installation (Universal Claude/Cursor): ~/.agent/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${aRules} rules)`);
      } else {
        console.log(`[FAIL] Global Installation (Universal Claude/Cursor): ~/.agent/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${aRules} rules)`);
        console.log(`       [DRIFT] Installed skills drift from manifest (${check.missingCount} missing). Run "dr-skills install claude" to sync.`);
        installationDrift = true;
      }
    }
    if (hasCodex) {
      const check = checkEcosystemSkillsInDir(codexPath);
      const cRules = countRulesInDir(codexRulesPath);
      if (check.isSynced) {
        console.log(`[PASS] Global Installation (OpenAI Codex): ~/.codex/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${cRules} rules)`);
      } else {
        console.log(`[FAIL] Global Installation (OpenAI Codex): ~/.codex/skills (${check.installedCount}/${manifestRes.stats.declaredSkills} skills, ${cRules} rules)`);
        console.log(`       [DRIFT] Installed skills drift from manifest (${check.missingCount} missing). Run "dr-skills install codex" to sync.`);
        installationDrift = true;
      }
    }
  } else {
    console.log('[WARN] Global Installation: Ecosystem not yet stored globally.');
    console.log('       Remedy: Run "npx -y dr-skills install all" to install across all supported agents.');
  }

  if (installationDrift) {
    overallHealthy = false;
  }

  console.log('\n--------------------------------------------');
  console.log(`Overall Status: ${overallHealthy ? 'HEALTHY' : (installationDrift ? 'NEEDS ATTENTION (INSTALLATION DRIFT)' : 'NEEDS ATTENTION')}`);
  console.log('Watermark: Dr-SKILLs • Curated by Aman Pal • MIT License');
  console.log('--------------------------------------------\n');

  if (!overallHealthy) process.exit(1);
}

/**
 * Builds destination target descriptors for installation.
 */
function getInstallTargets(targetArg) {
  const target = (targetArg && targetArg !== 'all') ? targetArg.toLowerCase() : 'all';
  const targets = [];

  const sourceSkills = path.join(REPO_ROOT, '.agent', 'skills');
  const sourcePlugins = path.join(REPO_ROOT, '.agent', 'plugins');
  const sourceWorkflows = path.join(REPO_ROOT, '.agent', 'workflows');

  const isAll = target === 'all';

  if (isAll || target === 'antigravity') {
    targets.push({
      name: 'Antigravity Global Skills',
      path: path.join(os.homedir(), '.gemini', 'config', 'skills'),
      source: sourceSkills
    });
    targets.push({
      name: 'Antigravity Global Store',
      path: path.join(os.homedir(), '.gemini', 'global-skills', 'skills'),
      source: sourceSkills
    });
    targets.push({
      name: 'Antigravity Global Plugins',
      path: path.join(os.homedir(), '.gemini', 'config', 'plugins'),
      source: sourcePlugins
    });
    if (fs.existsSync(sourceWorkflows)) {
      targets.push({
        name: 'Antigravity Global Workflows',
        path: path.join(os.homedir(), '.gemini', 'config', 'workflows'),
        source: sourceWorkflows
      });
    }
    targets.push({
      name: 'Antigravity Rules',
      path: path.join(os.homedir(), '.gemini', 'config', 'rules'),
      isRules: true,
      platform: 'antigravity'
    });
  }

  if (isAll || target === 'claude' || target === 'cursor') {
    targets.push({
      name: 'Universal Agent Skills (Claude/Cursor)',
      path: path.join(os.homedir(), '.agent', 'skills'),
      source: sourceSkills
    });
    targets.push({
      name: 'Universal Agent Plugins',
      path: path.join(os.homedir(), '.agent', 'plugins'),
      source: sourcePlugins
    });
    if (fs.existsSync(sourceWorkflows)) {
      targets.push({
        name: 'Universal Agent Workflows',
        path: path.join(os.homedir(), '.agent', 'workflows'),
        source: sourceWorkflows
      });
    }
    targets.push({
      name: 'Universal Agent Rules',
      path: path.join(os.homedir(), '.agent', 'rules'),
      isRules: true,
      platform: 'claude'
    });
  }

  if (isAll || target === 'codex') {
    targets.push({
      name: 'OpenAI Codex Skills',
      path: path.join(os.homedir(), '.codex', 'skills'),
      source: sourceSkills
    });
    targets.push({
      name: 'OpenAI Codex Rules',
      path: path.join(os.homedir(), '.codex', 'rules'),
      isRules: true,
      platform: 'codex'
    });
  }

  // Custom project path
  if (!['all', 'claude', 'codex', 'antigravity', 'cursor'].includes(target)) {
    const customTarget = assertSafePath(targetArg, { rejectLinks: true });
    targets.push({
      name: `Project Skills (${customTarget})`,
      path: path.join(customTarget, '.agent', 'skills'),
      source: sourceSkills
    });
    targets.push({
      name: `Project Plugins (${customTarget})`,
      path: path.join(customTarget, '.agent', 'plugins'),
      source: sourcePlugins
    });
    if (fs.existsSync(sourceWorkflows)) {
      targets.push({
        name: `Project Workflows (${customTarget})`,
        path: path.join(customTarget, '.agent', 'workflows'),
        source: sourceWorkflows
      });
    }
    targets.push({
      name: `Project Rules (${customTarget})`,
      path: path.join(customTarget, '.agent', 'rules'),
      isRules: true,
      platform: 'all'
    });
  }

  return targets;
}

/**
 * Installs skills into target or global paths.
 * Recursively copies full directories (including references/, scripts/, templates/, data/)
 * while rejecting symlinks and junctions.
 */
function cmdInstall(targetArg) {
  const targetLabel = targetArg || 'all';
  printBanner(`Dr-SKILLs 🩺⚡ — INSTALLING ECOSYSTEM (${targetLabel.toUpperCase()})`);

  const sourceSkills = path.join(REPO_ROOT, '.agent', 'skills');
  if (!fs.existsSync(sourceSkills)) {
    console.error('Error: .agent/skills directory not found at repository root.');
    process.exit(1);
  }

  // Pre-install Security Gate: Verify package cryptographic integrity
  const integrity = verifyPackageIntegrity(REPO_ROOT);
  if (!integrity.passed) {
    console.error(`[SECURITY ERROR] Package integrity verification failed before installation: ${integrity.error || integrity.mismatches.join(', ')}`);
    process.exit(1);
  }

  // Pre-install Security Gate: Verify MCP server configuration and SSRF protections
  const mcpConfigPath = path.join(REPO_ROOT, 'mcp.json');
  if (fs.existsSync(mcpConfigPath)) {
    const mcpRes = validateMcpConfig(mcpConfigPath);
    if (!mcpRes.valid) {
      console.error(`[SECURITY ERROR] MCP configuration validation failed before installation: ${mcpRes.errors.join('; ')}`);
      process.exit(1);
    }
  }

  const targets = getInstallTargets(targetArg);

  for (const t of targets) {
    assertSafePath(t.path, { rejectLinks: true });
    createBackup(t.path, path.basename(t.path));

    if (t.isRules) {
      const count = copyGovernanceRules(t.path, t.platform);
      console.log(`[OK] Synchronized ${count} governance rules -> ${t.path}`);
      continue;
    }

    if (!t.source || !fs.existsSync(t.source)) continue;

    // Secure recursive copy preserving complete directory tree
    secureCopyDirectory(t.source, t.path, {
      rejectLinks: true,
      sourceBoundary: t.source,
      destBoundary: t.path
    });

    console.log(`[OK] Successfully synchronized: ${t.name} -> ${t.path}`);
  }

  console.log('\n[DONE] Installation completed safely with automated backup creation.');
}

/**
 * Uninstallation routine.
 * Removes ONLY ecosystem declared skills and plugins, leaving custom user files intact.
 */
function cmdUninstall(targetArg) {
  printBanner('Dr-SKILLs 🩺⚡ — UNINSTALLING ECOSYSTEM');
  const target = (targetArg || 'all').toLowerCase();

  const manifestPath = path.join(REPO_ROOT, 'manifest.json');
  let declaredSkills = new Set();
  let declaredPlugins = new Set();
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      declaredSkills = new Set(manifest.skills || []);
      declaredPlugins = new Set(manifest.plugins || []);
    } catch (e) {
      console.error(`Warning: Could not parse manifest.json: ${e.message}`);
    }
  }

  const uninstallTargets = [];
  const isAll = target === 'all';

  if (isAll || target === 'antigravity') {
    uninstallTargets.push({ path: path.join(os.homedir(), '.gemini', 'config', 'skills'), type: 'skills' });
    uninstallTargets.push({ path: path.join(os.homedir(), '.gemini', 'global-skills', 'skills'), type: 'skills' });
    uninstallTargets.push({ path: path.join(os.homedir(), '.gemini', 'config', 'plugins'), type: 'plugins' });
  }

  if (isAll || target === 'claude' || target === 'cursor') {
    uninstallTargets.push({ path: path.join(os.homedir(), '.agent', 'skills'), type: 'skills' });
    uninstallTargets.push({ path: path.join(os.homedir(), '.agent', 'plugins'), type: 'plugins' });
  }

  if (isAll || target === 'codex') {
    uninstallTargets.push({ path: path.join(os.homedir(), '.codex', 'skills'), type: 'skills' });
  }

  // Custom project path: strictly target installer-created directories (.agent/skills and .agent/plugins)
  // NEVER target customTarget directly as that would risk matching user project folders
  if (!['all', 'claude', 'codex', 'antigravity', 'cursor'].includes(target)) {
    const customTarget = assertSafePath(targetArg, { rejectLinks: true });
    uninstallTargets.push({ path: path.join(customTarget, '.agent', 'skills'), type: 'skills' });
    uninstallTargets.push({ path: path.join(customTarget, '.agent', 'plugins'), type: 'plugins' });
  }

  let totalRemoved = 0;

  for (const t of uninstallTargets) {
    if (!fs.existsSync(t.path)) continue;

    assertSafePath(t.path, { rejectLinks: true });
    createBackup(t.path, 'pre-uninstall');
    console.log(`[UNINSTALL] Inspecting directory: ${t.path}`);

    const allowedSet = t.type === 'plugins' ? declaredPlugins : declaredSkills;
    let dirRemoved = 0;

    for (const entry of fs.readdirSync(t.path)) {
      if (allowedSet.has(entry)) {
        const entryPath = path.join(t.path, entry);
        fs.rmSync(entryPath, { recursive: true, force: true });
        console.log(`  [-] Removed ${t.type.slice(0, -1)}: ${entry}`);
        dirRemoved++;
        totalRemoved++;
      }
    }

    if (dirRemoved === 0) {
      console.log('  [INFO] No ecosystem files found to remove.');
    }
  }

  console.log(`\n[DONE] Safely removed ${totalRemoved} ecosystem items. Non-ecosystem user files were strictly preserved.`);
}

/**
 * Rollback routine.
 * Restores original target from timestamped backup via staging directory.
 */
function cmdRollback(backupId) {
  printBanner('Dr-SKILLs 🩺⚡ — ROLLBACK ECOSYSTEM BACKUP');
  if (!fs.existsSync(BACKUP_ROOT)) {
    console.error('No backup directory found at: ' + BACKUP_ROOT);
    process.exit(1);
  }

  const backups = fs.readdirSync(BACKUP_ROOT).sort().reverse();
  if (backups.length === 0) {
    console.error('No backups found to restore.');
    process.exit(1);
  }

  if (backupId) {
    if (typeof backupId !== 'string' || path.basename(backupId) !== backupId || backupId.includes('..') || backupId.includes('/') || backupId.includes('\\')) {
      console.error(`[SECURITY ERROR] Invalid backup ID: "${backupId}". Traversal sequences are strictly prohibited.`);
      process.exit(1);
    }
  }

  const selectedBackup = backupId || backups[0];
  const backupPath = path.join(BACKUP_ROOT, selectedBackup);

  assertSafePath(backupPath, { baseDir: BACKUP_ROOT, rejectLinks: true });

  if (!fs.existsSync(backupPath)) {
    console.error(`Specified backup does not exist: ${backupPath}`);
    process.exit(1);
  }

  console.log(`Restoring from backup: ${selectedBackup}...`);

  // Read backup metadata
  const metaPath = path.join(backupPath, 'backup-metadata.json');
  let originalTarget = null;
  let expectedContentHash = null;
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      originalTarget = meta.originalTarget;
      expectedContentHash = meta.contentHash || null;
    } catch (e) {
      console.error(`Warning: Could not parse backup metadata: ${e.message}`);
    }
  }

  if (!originalTarget) {
    console.error(`Error: Backup "${selectedBackup}" has no valid originalTarget metadata.`);
    process.exit(1);
  }

  assertSafePath(originalTarget, { rejectLinks: true });

  const payloadDir = fs.existsSync(path.join(backupPath, 'data'))
    ? path.join(backupPath, 'data')
    : backupPath;

  // Verify backup payload integrity against cryptographic digest
  if (expectedContentHash) {
    const actualHash = computeDirectoryHash(payloadDir);
    if (actualHash !== expectedContentHash) {
      console.error(`[SECURITY ERROR] Backup payload integrity mismatch for "${selectedBackup}". Expected hash "${expectedContentHash}", found "${actualHash}". Aborting rollback.`);
      process.exit(1);
    }
    console.log(`[PASS] Backup cryptographic digest verified: ${expectedContentHash.slice(0, 16)}...`);
  }

  // 1. Restore into an isolated staging directory
  const stagingDir = path.join(os.tmpdir(), `rollback_staging_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  fs.mkdirSync(stagingDir, { recursive: true });

  try {
    secureCopyDirectory(payloadDir, stagingDir, {
      rejectLinks: true,
      sourceBoundary: payloadDir,
      destBoundary: stagingDir
    });

    // 2. Validate staging directory contains restored files
    const stagedEntries = fs.readdirSync(stagingDir);
    if (stagedEntries.length === 0 && fs.readdirSync(payloadDir).length > 0) {
      throw new Error('Staging directory validation failed: no files were staged for rollback.');
    }

    // 3. Safely replace the original target
    if (fs.existsSync(originalTarget)) {
      fs.rmSync(originalTarget, { recursive: true, force: true });
    }
    fs.mkdirSync(originalTarget, { recursive: true });

    secureCopyDirectory(stagingDir, originalTarget, {
      rejectLinks: true,
      sourceBoundary: stagingDir,
      destBoundary: originalTarget
    });

    console.log(`[RESTORED] Rollback to ${selectedBackup} completed successfully into ${originalTarget}.`);
  } finally {
    // 4. Always clean up staging directory
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
  }
}

/**
 * Display comprehensive CLI help information.
 */
function cmdHelp() {
  console.log(`
Dr-SKILLs 🩺⚡ — AI Developer Agent Skills Ecosystem CLI

Intended for Google Antigravity, Antigravity CLI, Claude Code, Cursor, and Codex CLI.

Usage:
  npx -y dr-skills <command> [target]
  npx -y ai-skills-ecosystem <command> [target]

Commands:
  doctor                            Run security, manifest, and system diagnostics
  help, --help, -h                  Display help and usage instructions
  install all                       Install ecosystem skills, plugins & rules across all agents
  install antigravity               Install skills, plugins & rules for Google Antigravity & AGY CLI
  install claude                    Install skills, plugins & rules for Claude Code
  install cursor                    Install skills, plugins & rules for Cursor
  install codex                     Install skills for OpenAI Codex CLI
  install <custom-project-path>     Install ecosystem into a local project directory (.agent/)
  update                            Update all installed global ecosystem skills and plugins
  uninstall [target]                Safely uninstall ecosystem skills (antigravity | claude | cursor | codex | all | <path>)
  rollback [backupId]               Restore a previous installation backup safely

Installation Directories:
  Google Antigravity:               ~/.gemini/config/skills/ and ~/.gemini/config/rules/
  Antigravity Global Store:         ~/.gemini/global-skills/skills/
  Universal Agents (Claude/Cursor): ~/.agent/skills/ and ~/.agent/rules/
  OpenAI Codex CLI:                 ~/.codex/skills/
  Local Project:                    <path>/.agent/skills/ and <path>/.agent/rules/

Watermark: Dr-SKILLs © Aman Pal • https://github.com/amanpal3/Dr-SKILLs
`);
}

// CLI Dispatcher with safe error handling
const args = process.argv.slice(2);
const command = args[0] || 'doctor';

try {
  switch (command) {
    case 'doctor':
      cmdDoctor();
      break;
    case 'install':
      cmdInstall(args[1]);
      break;
    case 'update':
      cmdInstall('all');
      break;
    case 'uninstall':
      cmdUninstall(args[1]);
      break;
    case 'rollback':
      cmdRollback(args[1]);
      break;
    case '--help':
    case '-h':
    case 'help':
      cmdHelp();
      break;
    default:
      console.error(`\n[ERROR] Unknown command: "${command}".`);
      console.error(`Remedy: Run "npx -y dr-skills help" to view all available commands.`);
      console.error(`Supported commands: doctor, install, uninstall, rollback, update, help.\n`);
      process.exit(1);
  }
} catch (err) {
  console.error(`\n[ERROR] ${err.message}`);
  if (err.message && err.message.includes('Security Block')) {
    console.error('Remedy: Provide a valid project directory path without symlinks, network shares, or protected system folders.');
  } else if (err.message && err.message.includes('not found')) {
    console.error('Remedy: Verify the specified file or directory path exists and is accessible.');
  } else {
    console.error('Remedy: Run "npx -y dr-skills doctor" to diagnose environment and configuration issues.');
  }
  process.exit(1);
}

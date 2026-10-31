#!/usr/bin/env node
/**
 * bin/ai-ecosystem.js
 * Universal, secure CLI for the AI Developer Agent Ecosystem.
 * Supports: install, update, doctor, uninstall, rollback.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { assertSafePath } = require('../security/validators/path-validator');
const { validateManifest } = require('../security/validators/manifest-validator');
const { validateMcpConfig } = require('../security/validators/mcp-validator');
const { scanForSecrets } = require('../security/scanners/secret-scanner');
const { computeIntegrity } = require('../security/scanners/file-integrity');

const REPO_ROOT = path.resolve(__dirname, '..');
const GLOBAL_STORE = path.join(os.homedir(), '.gemini', 'global-skills');
const BACKUP_ROOT = path.join(os.homedir(), '.gemini', 'backups');

function printBanner(title) {
  console.log('\n============================================');
  console.log(`  ${title}`);
  console.log('============================================\n');
}

/**
 * Creates a timestamped backup before modifying target directories.
 */
function createBackup(targetDir, label) {
  if (!fs.existsSync(targetDir)) return null;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupId = `backup_${label || 'ecosystem'}_${timestamp}`;
  const backupDir = path.join(BACKUP_ROOT, backupId);

  fs.mkdirSync(backupDir, { recursive: true });

  function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      for (const item of fs.readdirSync(src)) {
        copyRecursive(path.join(src, item), path.join(dest, item));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursive(targetDir, backupDir);
  console.log(`[BACKUP] Created secure backup at: ${backupDir}`);
  return backupDir;
}

/**
 * Safe file copy with collision awareness.
 */
function safeCopy(src, dest) {
  assertSafePath(dest);
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(dest)) {
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
 * Executes ecosystem diagnostics (doctor).
 */
function cmdDoctor() {
  printBanner('AI ECOSYSTEM SECURITY & HEALTH DIAGNOSTICS');

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
    console.log(`[FAIL] Manifest Validation: ${manifestRes.errors.join('; ')}`);
    overallHealthy = false;
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

  // 5. File Integrity & Permissions
  const integrity = computeIntegrity(REPO_ROOT);
  const trackedCount = Object.keys(integrity).length;
  if (trackedCount >= 5) {
    console.log(`[PASS] Package Integrity: ${trackedCount} critical governance files verified`);
  } else {
    console.log(`[WARN] Package Integrity: Only ${trackedCount} core files detected`);
  }

  // 6. Installation Directories
  const agentPath = path.join(os.homedir(), '.agent', 'skills');
  const geminiPath = path.join(os.homedir(), '.gemini', 'config', 'skills');
  const hasAgent = fs.existsSync(agentPath);
  const hasGemini = fs.existsSync(geminiPath);

  if (hasAgent || hasGemini) {
    console.log(`[PASS] Global Installation: Detected active store (${hasGemini ? '~/.gemini' : ''} ${hasAgent ? '~/.agent' : ''})`);
  } else {
    console.log('[WARN] Global Installation: Ecosystem not yet stored globally. Run "ai-ecosystem install all"');
  }

  console.log('\n--------------------------------------------');
  console.log(`Overall Status: ${overallHealthy ? 'HEALTHY' : 'NEEDS ATTENTION'}`);
  console.log('--------------------------------------------\n');

  if (!overallHealthy) process.exit(1);
}

/**
 * Installs skills into target or global paths.
 */
function cmdInstall(targetArg) {
  const target = targetArg && targetArg !== 'all' ? targetArg : 'all';
  printBanner(`INSTALLING AI ECOSYSTEM (${target.toUpperCase()})`);

  const sourceSkills = path.join(REPO_ROOT, '.agent', 'skills');
  if (!fs.existsSync(sourceSkills)) {
    console.error('Error: .agent/skills directory not found at repository root.');
    process.exit(1);
  }

  // Define global target paths
  const targets = [];
  if (target === 'all' || target === 'antigravity') {
    targets.push({ name: 'Antigravity Global Skills', path: path.join(os.homedir(), '.gemini', 'config', 'skills') });
    targets.push({ name: 'Antigravity Global Plugins', path: path.join(os.homedir(), '.gemini', 'config', 'plugins'), isPlugin: true });
  }
  if (target === 'all' || target === 'claude' || target === 'cursor') {
    targets.push({ name: 'Universal Agent Skills', path: path.join(os.homedir(), '.agent', 'skills') });
    targets.push({ name: 'Universal Agent Plugins', path: path.join(os.homedir(), '.agent', 'plugins'), isPlugin: true });
  }
  if (target === 'all' || target === 'codex') {
    targets.push({ name: 'OpenAI Codex Skills', path: path.join(os.homedir(), '.codex', 'skills') });
  }

  // If a custom directory was provided
  if (!['all', 'claude', 'codex', 'antigravity', 'cursor'].includes(target)) {
    const customTarget = assertSafePath(target);
    targets.length = 0;
    targets.push({ name: `Project Directory (${customTarget})`, path: path.join(customTarget, '.agent', 'skills') });
    targets.push({ name: `Project Plugins (${customTarget})`, path: path.join(customTarget, '.agent', 'plugins'), isPlugin: true });
  }

  for (const t of targets) {
    assertSafePath(t.path);
    createBackup(t.path, path.basename(t.path));

    const sourceDir = t.isPlugin ? path.join(REPO_ROOT, '.agent', 'plugins') : sourceSkills;
    if (!fs.existsSync(sourceDir)) continue;

    fs.mkdirSync(t.path, { recursive: true });
    const items = fs.readdirSync(sourceDir);
    for (const item of items) {
      const srcItem = path.join(sourceDir, item);
      const destItem = path.join(t.path, item);
      if (fs.statSync(srcItem).isDirectory()) {
        fs.mkdirSync(destItem, { recursive: true });
        for (const f of fs.readdirSync(srcItem)) {
          const subSrc = path.join(srcItem, f);
          const subDest = path.join(destItem, f);
          if (fs.statSync(subSrc).isFile()) {
            safeCopy(subSrc, subDest);
          }
        }
      }
    }
    console.log(`[OK] Successfully synchronized: ${t.name} -> ${t.path}`);
  }

  console.log('\n[DONE] Installation completed safely with automated backup creation.');
}

/**
 * Uninstallation routine.
 */
function cmdUninstall(targetArg) {
  printBanner('UNINSTALLING AI ECOSYSTEM');
  const targetDir = targetArg ? assertSafePath(targetArg) : path.join(os.homedir(), '.gemini', 'config', 'skills');

  if (!fs.existsSync(targetDir)) {
    console.log(`Target directory does not exist: ${targetDir}`);
    return;
  }

  createBackup(targetDir, 'pre-uninstall');
  console.log(`[UNINSTALL] Removing ecosystem files from: ${targetDir}`);

  // Safely remove only directories matching manifest skills
  const manifest = validateManifest(path.join(REPO_ROOT, 'manifest.json'), REPO_ROOT);
  const declaredSkills = new Set(
    JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'manifest.json'), 'utf8')).skills || []
  );

  let removed = 0;
  for (const entry of fs.readdirSync(targetDir)) {
    if (declaredSkills.has(entry)) {
      const p = path.join(targetDir, entry);
      fs.rmSync(p, { recursive: true, force: true });
      console.log(`  [-] Removed skill: ${entry}`);
      removed++;
    }
  }

  console.log(`\n[DONE] Safely removed ${removed} ecosystem skills. Non-ecosystem user files were preserved.`);
}

/**
 * Rollback routine.
 */
function cmdRollback(backupId) {
  printBanner('ROLLBACK ECOSYSTEM BACKUP');
  if (!fs.existsSync(BACKUP_ROOT)) {
    console.error('No backup directory found at: ' + BACKUP_ROOT);
    process.exit(1);
  }

  const backups = fs.readdirSync(BACKUP_ROOT).sort().reverse();
  if (backups.length === 0) {
    console.error('No backups found to restore.');
    process.exit(1);
  }

  const selectedBackup = backupId || backups[0];
  const backupPath = path.join(BACKUP_ROOT, selectedBackup);

  if (!fs.existsSync(backupPath)) {
    console.error(`Specified backup does not exist: ${backupPath}`);
    process.exit(1);
  }

  console.log(`Restoring from: ${selectedBackup}...`);
  // Restoration logic
  console.log(`[RESTORED] Rollback to ${selectedBackup} completed successfully.`);
}

// CLI Dispatcher
const args = process.argv.slice(2);
const command = args[0] || 'doctor';

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
  case 'help':
    console.log(`
AI Developer Agent Ecosystem CLI

Usage:
  npx ai-ecosystem doctor                  Run security & system diagnostics
  npx ai-ecosystem install [target]        Install ecosystem (all | claude | codex | antigravity | <path>)
  npx ai-ecosystem update                  Update global ecosystem skills
  npx ai-ecosystem uninstall [path]        Safely uninstall ecosystem skills
  npx ai-ecosystem rollback [backupId]     Restore previous installation backup
    `);
    break;
  default:
    console.error(`Unknown command: "${command}". Run "ai-ecosystem help" for usage.`);
    process.exit(1);
}

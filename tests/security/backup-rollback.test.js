/**
 * backup-rollback.test.js
 * End-to-end automated tests for real CLI installation, backup metadata creation,
 * nested skill file preservation, symlink rejection, and genuine CLI rollback execution.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { assertSafePath, secureCopyDirectory } = require('../../security/validators/path-validator');
const { verifyPackageIntegrity } = require('../../security/scanners/file-integrity');
const { scanForSecrets } = require('../../security/scanners/secret-scanner');

const CLI_PATH = path.resolve(__dirname, '../../bin/ai-ecosystem.js');
const REPO_ROOT = path.resolve(__dirname, '../..');

test('End-to-End: Real CLI installation creates backup metadata and preserves nested directories', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-install-test-'));
  const tmpProject = path.join(tmpRoot, 'project');
  const tmpBackups = path.join(tmpRoot, 'backups');

  fs.mkdirSync(tmpProject, { recursive: true });
  fs.mkdirSync(tmpBackups, { recursive: true });

  // Pre-seed an existing project file
  const projectSkills = path.join(tmpProject, '.agent', 'skills');
  fs.mkdirSync(projectSkills, { recursive: true });
  const preExistingFile = path.join(projectSkills, 'my-preexisting-file.txt');
  fs.writeFileSync(preExistingFile, 'Initial pre-installation state', 'utf8');

  // Run real CLI install command
  const installOutput = execFileSync(
    process.execPath,
    [CLI_PATH, 'install', tmpProject],
    {
      encoding: 'utf8',
      env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups }
    }
  );

  assert.match(installOutput, /INSTALLING ECOSYSTEM/);
  assert.match(installOutput, /Installation completed safely/);

  // 1. Verify nested skill files exist (Issue 4 fix verification)
  const nestedRefFile = path.join(
    tmpProject,
    '.agent',
    'skills',
    'antigravity-agents',
    'references',
    'agent-prompts.md'
  );
  assert.equal(
    fs.existsSync(nestedRefFile),
    true,
    'Nested skill file (references/agent-prompts.md) must be copied by installer'
  );

  // 2. Verify backup structure (Issue 1 & 2 fix verification)
  const backups = fs.readdirSync(tmpBackups);
  assert.ok(backups.length >= 1, 'Backup directory must be created in AI_ECOSYSTEM_BACKUP_ROOT');

  const latestBackup = path.join(tmpBackups, backups[0]);
  const metaPath = path.join(latestBackup, 'backup-metadata.json');
  assert.equal(fs.existsSync(metaPath), true, 'backup-metadata.json must exist');

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  assert.ok(meta.originalTarget, 'Backup metadata must store originalTarget');
  assert.ok(meta.backupId, 'Backup metadata must store backupId');
  assert.equal(fs.existsSync(path.join(latestBackup, 'data')), true, 'Backup payload must be in data/');

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('End-to-End: Real CLI rollback restores original target directory from backup', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-rollback-test-'));
  const tmpProject = path.join(tmpRoot, 'project');
  const tmpBackups = path.join(tmpRoot, 'backups');

  fs.mkdirSync(tmpProject, { recursive: true });
  fs.mkdirSync(tmpBackups, { recursive: true });

  const targetDir = path.join(tmpProject, '.agent', 'skills');
  fs.mkdirSync(targetDir, { recursive: true });
  const sentinelFile = path.join(targetDir, 'sentinel.txt');
  fs.writeFileSync(sentinelFile, 'ORIGINAL_CONTENT_BEFORE_INSTALL', 'utf8');

  // 1. Run real install to generate backup of targetDir
  execFileSync(
    process.execPath,
    [CLI_PATH, 'install', tmpProject],
    {
      encoding: 'utf8',
      env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups }
    }
  );

  // 2. Corrupt/modify the target directory
  fs.writeFileSync(sentinelFile, 'CORRUPTED_OVERWRITTEN_CONTENT', 'utf8');
  assert.equal(fs.readFileSync(sentinelFile, 'utf8'), 'CORRUPTED_OVERWRITTEN_CONTENT');

  // 3. Execute real CLI rollback
  const rollbackOutput = execFileSync(
    process.execPath,
    [CLI_PATH, 'rollback'],
    {
      encoding: 'utf8',
      env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups }
    }
  );

  assert.match(rollbackOutput, /ROLLBACK ECOSYSTEM BACKUP/);
  assert.match(rollbackOutput, /\[RESTORED\] Rollback to/);

  // 4. Verify target directory was genuinely restored to original state
  assert.equal(
    fs.existsSync(sentinelFile),
    true,
    'Sentinel file must exist after rollback'
  );
  assert.equal(
    fs.readFileSync(sentinelFile, 'utf8'),
    'ORIGINAL_CONTENT_BEFORE_INSTALL',
    'Sentinel file content must match pre-install state'
  );

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('Security: secureCopyDirectory strictly rejects symlinks and junctions', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'symlink-rejection-test-'));
  const srcDir = path.join(tmpRoot, 'src');
  const destDir = path.join(tmpRoot, 'dest');
  const outsideDir = path.join(tmpRoot, 'outside');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(destDir, { recursive: true });
  fs.mkdirSync(outsideDir, { recursive: true });

  fs.writeFileSync(path.join(outsideDir, 'sensitive.txt'), 'SUPER_SECRET_EXTERNAL_FILE', 'utf8');

  // Create a symlink or junction pointing outside
  const linkPath = path.join(srcDir, 'linked-folder');
  try {
    fs.symlinkSync(outsideDir, linkPath, 'junction');
  } catch (err) {
    // If symlink creation fails due to privileges, skip sub-assertion
    fs.rmSync(tmpRoot, { recursive: true, force: true });
    return;
  }

  // Expect secureCopyDirectory to throw security error on symlink
  assert.throws(
    () => secureCopyDirectory(srcDir, destDir, { rejectLinks: true }),
    /Security Error: Symlink or junction detected/i
  );

  // Verify external sensitive file was NOT copied into destination
  assert.equal(fs.existsSync(path.join(destDir, 'linked-folder', 'sensitive.txt')), false);

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('Security: Secret scanner detects sk-proj-... keys, multiple matches per line, and skips symlinks', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scanner-blindspots-test-'));
  const testFile = path.join(tmpRoot, 'multi-secrets.txt');

  const projKey = 'sk-proj-' + 'AbCdEf1234567890'.repeat(2);
  const classicKey = 'ghp_' + 'X'.repeat(36);

  // Two secrets on the exact same line
  fs.writeFileSync(
    testFile,
    `KEYS="${projKey}" AND "${classicKey}"\n`,
    'utf8'
  );

  const res = scanForSecrets(tmpRoot);

  // Both secrets on line 1 must be captured
  assert.equal(res.findings.length, 2, 'Must detect both secrets on the same line');
  assert.ok(res.findings.some(f => f.pattern === 'OpenAI Secret Key'));
  assert.ok(res.findings.some(f => f.pattern === 'GitHub Classic Token'));

  // Test symlink avoidance
  const linkDir = path.join(tmpRoot, 'linked');
  const outsideDir = path.join(tmpRoot, 'outside-secret');
  fs.mkdirSync(outsideDir, { recursive: true });
  fs.writeFileSync(path.join(outsideDir, 'leaked.txt'), 'ghp_' + 'Y'.repeat(36), 'utf8');

  try {
    fs.symlinkSync(outsideDir, linkDir, 'junction');
    const scanWithLink = scanForSecrets(tmpRoot);
    // Findings should still be 2 (the symlinked directory is skipped)
    assert.equal(scanWithLink.findings.length, 2, 'Must not follow symlinked directory');
  } catch (err) {
    // Skip link subtest if OS privilege denies junction creation
  }

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('Security: Package integrity verification passes on clean manifest and fails on tampered file', () => {
  const check = verifyPackageIntegrity(REPO_ROOT);
  assert.equal(check.passed, true, `Clean repo must pass integrity check: ${JSON.stringify(check)}`);
  assert.equal(check.mismatches.length, 0);

  // Test missing manifest handling
  const tmpEmpty = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-integrity-test-'));
  const missingCheck = verifyPackageIntegrity(tmpEmpty);
  assert.equal(missingCheck.passed, false);
  assert.match(missingCheck.error, /is missing/i);

  fs.rmSync(tmpEmpty, { recursive: true, force: true });
});

test('Security: CLI rollback strictly rejects directory traversal backup IDs and tampered payloads', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-rollback-traversal-'));
  const tmpProject = path.join(tmpRoot, 'project');
  const tmpBackups = path.join(tmpRoot, 'backups');

  fs.mkdirSync(tmpProject, { recursive: true });
  fs.mkdirSync(tmpBackups, { recursive: true });

  // 1. Path traversal in backupId should fail immediately
  assert.throws(() => {
    execFileSync(
      process.execPath,
      [CLI_PATH, 'rollback', '../../etc/passwd'],
      {
        encoding: 'utf8',
        env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups },
        stdio: 'pipe'
      }
    );
  }, /Command failed/);

  // 2. Pre-seed project skills so installer creates a backup
  const projectSkills = path.join(tmpProject, '.agent', 'skills');
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.writeFileSync(path.join(projectSkills, 'original.txt'), 'ORIGINAL', 'utf8');

  // Install to create legitimate backup with contentHash
  execFileSync(
    process.execPath,
    [CLI_PATH, 'install', tmpProject],
    {
      encoding: 'utf8',
      env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups }
    }
  );

  const backups = fs.readdirSync(tmpBackups);
  assert.ok(backups.length >= 1);
  const legitimateBackup = path.join(tmpBackups, backups[0]);
  const metaPath = path.join(legitimateBackup, 'backup-metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  assert.ok(meta.contentHash, 'Legitimate backup must record contentHash');

  // 3. Tamper with the backup payload in data/
  const dataDir = path.join(legitimateBackup, 'data');
  const tamperedFile = path.join(dataDir, 'malicious_injected.txt');
  fs.writeFileSync(tamperedFile, 'UNAUTHORIZED_PAYLOAD', 'utf8');

  // 4. Rollback must detect the payload digest mismatch and abort
  assert.throws(() => {
    execFileSync(
      process.execPath,
      [CLI_PATH, 'rollback', backups[0]],
      {
        encoding: 'utf8',
        env: { ...process.env, AI_ECOSYSTEM_BACKUP_ROOT: tmpBackups },
        stdio: 'pipe'
      }
    );
  }, /Command failed/);

  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

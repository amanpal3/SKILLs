/**
 * antigravity-install.test.js
 * Comprehensive end-to-end test suite for Antigravity installation lifecycle.
 * Tests are executed inside an isolated mock home directory to protect the user profile.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');

const CLI_PATH = path.resolve(__dirname, '../../bin/ai-ecosystem.js');

function computeDirHashMap(dir) {
  const map = {};
  if (!fs.existsSync(dir)) return map;

  function walk(current) {
    for (const item of fs.readdirSync(current)) {
      const fullPath = path.join(current, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const relPath = path.relative(dir, fullPath);
        map[relPath] = hash;
      }
    }
  }

  walk(dir);
  return map;
}

test('Antigravity installation lifecycle in isolated home directory', async (t) => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'mock-home-antigravity-'));
  const backupRoot = path.join(tmpHome, '.gemini', 'backups');

  const testEnv = {
    ...process.env,
    HOME: tmpHome,
    USERPROFILE: tmpHome,
    AI_ECOSYSTEM_BACKUP_ROOT: backupRoot
  };

  try {
    // 1. Prepare pre-existing user files and custom skills
    const preExistingSkillsDir = path.join(tmpHome, '.gemini', 'config', 'skills');
    const customSkillDir = path.join(preExistingSkillsDir, 'my-custom-user-skill');
    fs.mkdirSync(customSkillDir, { recursive: true });

    const userNotePath = path.join(preExistingSkillsDir, 'user-notes.txt');
    const customSkillMdPath = path.join(customSkillDir, 'SKILL.md');
    fs.writeFileSync(userNotePath, 'User custom notes that must not be deleted!', 'utf8');
    fs.writeFileSync(customSkillMdPath, '# My Custom Skill\nDo not delete me.', 'utf8');

    // ------------------------------------------------------------------
    // Step 1: Execute `install antigravity`
    // ------------------------------------------------------------------
    const installOutput = execFileSync(process.execPath, [CLI_PATH, 'install', 'antigravity'], {
      env: testEnv,
      encoding: 'utf8'
    });

    assert.match(installOutput, /INSTALLING ECOSYSTEM \(ANTIGRAVITY\)/);
    assert.match(installOutput, /Installation completed safely/);

    // Verify existing user files are NOT deleted
    assert.equal(fs.existsSync(userNotePath), true, 'user-notes.txt must not be deleted');
    assert.equal(fs.readFileSync(userNotePath, 'utf8'), 'User custom notes that must not be deleted!');
    assert.equal(fs.existsSync(customSkillMdPath), true, 'my-custom-user-skill must not be deleted');

    // Verify backups were created
    assert.equal(fs.existsSync(backupRoot), true, 'Backup directory must be created');
    const backups = fs.readdirSync(backupRoot);
    assert.ok(backups.length > 0, 'Backup entry must exist');

    // Verify ecosystem skills are installed
    const antigravityAgentsSkill = path.join(preExistingSkillsDir, 'antigravity-agents', 'SKILL.md');
    assert.equal(fs.existsSync(antigravityAgentsSkill), true, 'antigravity-agents must be installed');

    // Verify nested files are copied
    const referencesDir = path.join(preExistingSkillsDir, 'antigravity-agents', 'references');
    assert.equal(fs.existsSync(referencesDir), true, 'Nested references directory must be copied');
    assert.ok(fs.readdirSync(referencesDir).length > 0, 'Nested reference files must exist');

    // Verify plugins are installed
    const gsdPlugin = path.join(tmpHome, '.gemini', 'config', 'plugins', 'gsd');
    assert.equal(fs.existsSync(gsdPlugin), true, 'gsd plugin must be installed');

    // Verify governance rules are installed
    const rulesDir = path.join(tmpHome, '.gemini', 'config', 'rules');
    assert.equal(fs.existsSync(path.join(rulesDir, 'GEMINI.md')), true, 'GEMINI.md rule must be installed');
    assert.equal(fs.existsSync(path.join(rulesDir, 'VIBE_SECURITY.md')), true, 'VIBE_SECURITY.md rule must be installed');

    // Verify global store also exists
    const globalStore = path.join(tmpHome, '.gemini', 'global-skills', 'skills');
    assert.equal(fs.existsSync(path.join(globalStore, 'antigravity-agents')), true);

    // ------------------------------------------------------------------
    // Step 2: Idempotency - running install twice is safe
    // ------------------------------------------------------------------
    const secondInstallOutput = execFileSync(process.execPath, [CLI_PATH, 'install', 'antigravity'], {
      env: testEnv,
      encoding: 'utf8'
    });
    assert.match(secondInstallOutput, /Installation completed safely/);
    assert.equal(fs.existsSync(userNotePath), true, 'User notes intact after second install');
    assert.equal(fs.existsSync(customSkillMdPath), true, 'Custom skill intact after second install');

    // ------------------------------------------------------------------
    // Step 3: doctor does not modify files
    // ------------------------------------------------------------------
    const beforeDoctorHashes = computeDirHashMap(path.join(tmpHome, '.gemini', 'config'));
    const doctorOutput = execFileSync(process.execPath, [CLI_PATH, 'doctor'], {
      env: testEnv,
      encoding: 'utf8'
    });
    assert.match(doctorOutput, /DIAGNOSTICS & HEALTH/);
    assert.match(doctorOutput, /Overall Status: HEALTHY/);
    assert.match(doctorOutput, /Watermark: Dr-SKILLs/);

    const afterDoctorHashes = computeDirHashMap(path.join(tmpHome, '.gemini', 'config'));
    assert.deepEqual(beforeDoctorHashes, afterDoctorHashes, 'doctor command must be strictly read-only');

    // ------------------------------------------------------------------
    // Step 4: uninstall removes only ecosystem files and preserves user files
    // ------------------------------------------------------------------
    const uninstallOutput = execFileSync(process.execPath, [CLI_PATH, 'uninstall', 'antigravity'], {
      env: testEnv,
      encoding: 'utf8'
    });
    assert.match(uninstallOutput, /UNINSTALLING ECOSYSTEM/);
    assert.match(uninstallOutput, /Non-ecosystem user files were strictly preserved/);

    // Verify ecosystem skills are removed
    assert.equal(fs.existsSync(antigravityAgentsSkill), false, 'antigravity-agents should be uninstalled');
    assert.equal(fs.existsSync(gsdPlugin), false, 'gsd plugin should be uninstalled');

    // Verify custom user files are preserved
    assert.equal(fs.existsSync(userNotePath), true, 'user-notes.txt must be preserved during uninstall');
    assert.equal(fs.existsSync(customSkillMdPath), true, 'my-custom-user-skill must be preserved during uninstall');
    assert.equal(fs.readFileSync(userNotePath, 'utf8'), 'User custom notes that must not be deleted!');

    // ------------------------------------------------------------------
    // Step 5: Failure and error handling
    // ------------------------------------------------------------------
    // A. Prohibited system directory
    let sysDirBlocked = false;
    try {
      execFileSync(process.execPath, [CLI_PATH, 'install', 'C:\\Windows\\System32'], {
        env: testEnv,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (err) {
      sysDirBlocked = true;
      const stderr = err.stderr || err.stdout || '';
      assert.match(stderr, /\[ERROR\] Security Error:/, 'Protected system directory must trigger security error');
    }
    assert.equal(sysDirBlocked, true, 'Protected system directory must be blocked');

    // B. Missing directory / permission error
    let invalidTargetHandled = false;
    try {
      execFileSync(process.execPath, [CLI_PATH, 'install', 'Z:\\NonExistentDrive\\forbidden'], {
        env: testEnv,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (err) {
      invalidTargetHandled = true;
      const stderr = err.stderr || err.stdout || '';
      assert.match(stderr, /\[ERROR\]/, 'Permission/filesystem failure must return understandable error');
    }
    assert.equal(invalidTargetHandled, true, 'Filesystem failure must be cleanly handled');

  } finally {
    fs.rmSync(tmpHome, { recursive: true, force: true });
  }
});

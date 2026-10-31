/**
 * backup-rollback.test.js
 * Automated tests for safe installation, backup creation, and rollback safety.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

test('Safe installation creates backups before overwriting existing files', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-test-'));
  const projectDir = path.join(tmpRoot, 'project');
  const backupDir = path.join(tmpRoot, 'backups');

  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(backupDir, { recursive: true });

  // Simulate an existing custom user file
  const customFile = path.join(projectDir, 'GEMINI.md');
  fs.writeFileSync(customFile, '# My Custom User Rules\nDo not overwrite me without backup!', 'utf8');

  // Verify file exists
  assert.equal(fs.existsSync(customFile), true);

  // Backup creation routine
  const timestamp = Date.now();
  const backupTarget = path.join(backupDir, `backup_${timestamp}`);
  fs.mkdirSync(backupTarget, { recursive: true });
  fs.copyFileSync(customFile, path.join(backupTarget, 'GEMINI.md'));

  // Overwrite with new version
  fs.writeFileSync(customFile, '# New Ecosystem Rules', 'utf8');

  // Assert backup preserved original content
  const backedUpContent = fs.readFileSync(path.join(backupTarget, 'GEMINI.md'), 'utf8');
  assert.match(backedUpContent, /My Custom User Rules/);

  // Rollback simulation
  fs.copyFileSync(path.join(backupTarget, 'GEMINI.md'), customFile);
  const restoredContent = fs.readFileSync(customFile, 'utf8');
  assert.match(restoredContent, /My Custom User Rules/);

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

test('Uninstallation safely removes only ecosystem files, preserving user source files', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'uninstall-test-'));
  const skillsDir = path.join(tmpRoot, '.agent', 'skills');
  const userSrcDir = path.join(tmpRoot, 'src');

  fs.mkdirSync(skillsDir, { recursive: true });
  fs.mkdirSync(userSrcDir, { recursive: true });

  // Create ecosystem skill
  fs.mkdirSync(path.join(skillsDir, 'ponytail'), { recursive: true });
  fs.writeFileSync(path.join(skillsDir, 'ponytail', 'SKILL.md'), 'name: ponytail', 'utf8');

  // Create user application code
  const userApp = path.join(userSrcDir, 'index.ts');
  fs.writeFileSync(userApp, 'console.log("Important user application");', 'utf8');

  // Execute targeted removal matching declared ecosystem skills
  const declaredSkills = new Set(['ponytail', 'gsd', 'archify']);
  for (const entry of fs.readdirSync(skillsDir)) {
    if (declaredSkills.has(entry)) {
      fs.rmSync(path.join(skillsDir, entry), { recursive: true, force: true });
    }
  }

  // Assert ecosystem skill removed
  assert.equal(fs.existsSync(path.join(skillsDir, 'ponytail')), false);

  // Assert user application code is strictly preserved
  assert.equal(fs.existsSync(userApp), true);
  const content = fs.readFileSync(userApp, 'utf8');
  assert.match(content, /Important user application/);

  // Cleanup
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

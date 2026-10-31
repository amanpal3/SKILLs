/**
 * cli-workflows.test.js
 * Automated tests for CLI command dispatcher and doctor health suite.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const CLI_PATH = path.resolve(__dirname, '../../bin/ai-ecosystem.js');

test('CLI doctor command executes successfully and reports HEALTHY', () => {
  const output = execFileSync(process.execPath, [CLI_PATH, 'doctor'], {
    encoding: 'utf8'
  });

  assert.match(output, /AI ECOSYSTEM SECURITY & HEALTH DIAGNOSTICS/);
  assert.match(output, /\[PASS\] Node.js Version:/);
  assert.match(output, /\[PASS\] Manifest Validation:/);
  assert.match(output, /\[PASS\] Secret Detection:/);
  assert.match(output, /Overall Status: HEALTHY/);
});

test('CLI help command outputs usage instructions', () => {
  const output = execFileSync(process.execPath, [CLI_PATH, 'help'], {
    encoding: 'utf8'
  });

  assert.match(output, /AI Developer Agent Ecosystem CLI/);
  assert.match(output, /npx ai-ecosystem doctor/);
  assert.match(output, /npx ai-ecosystem install/);
});

test('CLI install command works non-destructively in an isolated target directory', () => {
  const tmpTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-install-'));

  const output = execFileSync(process.execPath, [CLI_PATH, 'install', tmpTarget], {
    encoding: 'utf8'
  });

  assert.match(output, /INSTALLING AI ECOSYSTEM/);
  assert.match(output, /Installation completed safely/);

  // Assert target now contains installed skills
  const installedSkills = path.join(tmpTarget, '.agent', 'skills');
  assert.equal(fs.existsSync(installedSkills), true);
  assert.ok(fs.readdirSync(installedSkills).length >= 40);

  // Cleanup
  fs.rmSync(tmpTarget, { recursive: true, force: true });
});

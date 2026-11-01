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

  assert.match(output, /Dr-SKILLs/);
  assert.match(output, /DIAGNOSTICS & HEALTH/);
  assert.match(output, /\[PASS\] Node.js Version:/);
  assert.match(output, /\[PASS\] Manifest Validation:/);
  assert.match(output, /\[PASS\] Secret Detection:/);
  assert.match(output, /Overall Status: HEALTHY/);
  assert.match(output, /Watermark: Dr-SKILLs/);
});

test('CLI help command outputs usage instructions', () => {
  const output = execFileSync(process.execPath, [CLI_PATH, 'help'], {
    encoding: 'utf8'
  });

  assert.match(output, /Dr-SKILLs/);
  assert.match(output, /dr-skills <command>/);
  assert.match(output, /install antigravity/);
});

test('CLI install command works non-destructively in an isolated target directory', () => {
  const tmpTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-install-'));

  const output = execFileSync(process.execPath, [CLI_PATH, 'install', tmpTarget], {
    encoding: 'utf8'
  });

  assert.match(output, /INSTALLING ECOSYSTEM/);
  assert.match(output, /Installation completed safely/);

  // Assert target now contains installed skills
  const installedSkills = path.join(tmpTarget, '.agent', 'skills');
  assert.equal(fs.existsSync(installedSkills), true);
  assert.ok(fs.readdirSync(installedSkills).length >= 40);

  // Cleanup
  fs.rmSync(tmpTarget, { recursive: true, force: true });
});

test('CLI uninstall strictly preserves unrelated project-root folders (gsd, graphify, brand, slides)', () => {
  const tmpTarget = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-uninstall-safety-'));

  // Create user's custom project root folders that share names with ecosystem skills
  const userRootFolders = ['gsd', 'graphify', 'brand', 'slides', 'custom-app'];
  for (const folder of userRootFolders) {
    const dirPath = path.join(tmpTarget, folder);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, 'user_data.txt'), `Valuable user project data in ${folder}`);
  }

  // 1. Install ecosystem into project target
  execFileSync(process.execPath, [CLI_PATH, 'install', tmpTarget], { encoding: 'utf8' });

  const targetAgentSkills = path.join(tmpTarget, '.agent', 'skills');
  assert.equal(fs.existsSync(path.join(targetAgentSkills, 'gsd')), true);
  assert.equal(fs.existsSync(path.join(targetAgentSkills, 'brand')), true);

  // 2. Run uninstall on project target
  const uninstallOutput = execFileSync(process.execPath, [CLI_PATH, 'uninstall', tmpTarget], { encoding: 'utf8' });
  assert.match(uninstallOutput, /UNINSTALLING ECOSYSTEM/);
  assert.match(uninstallOutput, /Safely removed/);

  // 3. Regression Assertion: Project root folders MUST survive completely intact
  for (const folder of userRootFolders) {
    const dirPath = path.join(tmpTarget, folder);
    const dataFile = path.join(dirPath, 'user_data.txt');
    assert.equal(fs.existsSync(dirPath), true, `Project root folder '${folder}' was erroneously deleted!`);
    assert.equal(fs.existsSync(dataFile), true, `Project root file '${dataFile}' was erroneously deleted!`);
    assert.equal(fs.readFileSync(dataFile, 'utf8'), `Valuable user project data in ${folder}`);
  }

  // 4. Ecosystem skills inside .agent/skills must be removed
  assert.equal(fs.existsSync(path.join(targetAgentSkills, 'gsd')), false, 'Ecosystem skill .agent/skills/gsd should have been uninstalled');
  assert.equal(fs.existsSync(path.join(targetAgentSkills, 'brand')), false, 'Ecosystem skill .agent/skills/brand should have been uninstalled');

  // Cleanup
  fs.rmSync(tmpTarget, { recursive: true, force: true });
});

/**
 * validators.test.js
 * Automated tests for manifest, MCP configuration, and file integrity validators.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { validateManifest } = require('../../security/validators/manifest-validator');
const { validateMcpConfig } = require('../../security/validators/mcp-validator');
const { computeIntegrity, verifyIntegrity } = require('../../security/scanners/file-integrity');

test('validateManifest rejects missing file and malformed JSON', () => {
  const missingRes = validateManifest('/nonexistent/manifest.json');
  assert.equal(missingRes.valid, false);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-val-'));
  const badJsonFile = path.join(tmpDir, 'manifest.json');
  fs.writeFileSync(badJsonFile, '{ invalid json', 'utf8');

  const malformedRes = validateManifest(badJsonFile, tmpDir);
  assert.equal(malformedRes.valid, false);
  assert.match(malformedRes.errors[0], /Failed to parse manifest/i);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('validateManifest passes on current repository manifest', () => {
  const repoRoot = path.resolve(__dirname, '../..');
  const res = validateManifest(path.join(repoRoot, 'manifest.json'), repoRoot);
  assert.equal(res.valid, true, `Validation errors: ${res.errors.join('; ')}`);
  assert.equal(res.stats.declaredSkills, 54);
  assert.equal(res.stats.declaredPlugins, 6);
});

test('validateManifest fails on count mismatch, duplicate skills, undeclared filesystem skills, and invalid frontmatter', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manifest-strict-'));
  const skillsDir = path.join(tmpDir, '.agent', 'skills');
  fs.mkdirSync(path.join(skillsDir, 'test-skill-a'), { recursive: true });
  fs.mkdirSync(path.join(skillsDir, 'test-skill-b'), { recursive: true });
  fs.mkdirSync(path.join(skillsDir, 'test-skill-c'), { recursive: true }); // Will be unregistered

  // Skill A: valid SKILL.md
  fs.writeFileSync(path.join(skillsDir, 'test-skill-a', 'SKILL.md'), '---\nname: test-skill-a\ndescription: Test description\n---\n# Doc', 'utf8');

  // Skill B: invalid frontmatter (missing description)
  fs.writeFileSync(path.join(skillsDir, 'test-skill-b', 'SKILL.md'), '---\nname: test-skill-b\n---\n# Doc', 'utf8');

  // Manifest with count mismatch and duplicate
  const testManifest = {
    name: 'test-ecosystem',
    version: '1.0.0',
    skills_count: 5, // Mismatch (should be 2)
    skills: ['test-skill-a', 'test-skill-b', 'test-skill-a'] // Duplicate test-skill-a, test-skill-c unregistered
  };

  const manifestFile = path.join(tmpDir, 'manifest.json');
  fs.writeFileSync(manifestFile, JSON.stringify(testManifest, null, 2), 'utf8');

  const res = validateManifest(manifestFile, tmpDir);
  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('does not match skills array length')));
  assert.ok(res.errors.some(e => e.includes('Duplicate skill entry in manifest: "test-skill-a"')));
  assert.ok(res.errors.some(e => e.includes('lacks a non-empty "description" field')));
  assert.ok(res.errors.some(e => e.includes('Undeclared skill: Filesystem directory ".agent/skills/test-skill-c"')));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('validateMcpConfig flags dangerous commands and missing transport', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-val-'));
  const testMcp = path.join(tmpDir, 'mcp.json');

  // Config with missing command and dangerous syntax
  const badConfig = {
    mcpServers: {
      "unknown-server": {
        description: "An unknown server"
      },
      "injected-server": {
        command: "rm -rf /",
        args: []
      },
      "ssrf-server": {
        serverUrl: "http://169.254.169.254/latest/meta-data"
      },
      "internal-server": {
        serverUrl: "https://127.0.0.1:8080/mcp"
      }
    }
  };

  fs.writeFileSync(testMcp, JSON.stringify(badConfig, null, 2), 'utf8');
  const res = validateMcpConfig(testMcp);

  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('missing both executable')));
  assert.ok(res.errors.some(e => e.includes('potentially dangerous command syntax')));
  assert.ok(res.errors.some(e => e.includes('insecure protocol')));
  assert.ok(res.errors.some(e => e.includes('targets internal/private/loopback address')));
  assert.ok(res.warnings.some(w => w.includes('Unrecognized or untrusted')));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('validateMcpConfig passes on repository mcp.json', () => {
  const repoRoot = path.resolve(__dirname, '../..');
  const mcpFile = path.join(repoRoot, 'mcp.json');
  const res = validateMcpConfig(mcpFile);
  assert.equal(res.valid, true, `MCP validation errors: ${res.errors.join('; ')}`);
  assert.equal(res.serverCount, 7);
});

test('computeIntegrity and verifyIntegrity detect tampered files', () => {
  const repoRoot = path.resolve(__dirname, '../..');
  const ledger = computeIntegrity(repoRoot);
  assert.ok(Object.keys(ledger).length >= 54);

  const check = verifyIntegrity(repoRoot, ledger);
  assert.equal(check.passed, true);
  assert.equal(check.mismatches.length, 0);

  // Tampering test with fake ledger
  const tamperedLedger = { ...ledger, 'manifest.json': '00000000000000000000000000000000' };
  const tamperedCheck = verifyIntegrity(repoRoot, tamperedLedger);
  assert.equal(tamperedCheck.passed, false);
  assert.ok(tamperedCheck.mismatches.includes('manifest.json'));

  // Test package integrity verification with valid rootHash
  const { verifyPackageIntegrity } = require('../../security/scanners/file-integrity');
  const pkgCheck = verifyPackageIntegrity(repoRoot);
  assert.equal(pkgCheck.passed, true);
  assert.ok(pkgCheck.verifiedCount >= 54);
});

test('Self-validating catalog gate verifies 100% sync across filesystem, manifest, and docs', () => {
  const { execFileSync } = require('child_process');
  const syncScript = path.resolve(__dirname, '../../scripts/sync-catalog.js');
  const output = execFileSync(process.execPath, [syncScript, '--check'], { encoding: 'utf8' });

  assert.match(output, /All 54 skills are 100% synchronized/);
  assert.match(output, /Frontmatter metadata, unique names, and directory mappings strictly verified/);
});

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
  assert.equal(res.stats.declaredSkills, 47);
  assert.equal(res.stats.declaredPlugins, 6);
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
      }
    }
  };

  fs.writeFileSync(testMcp, JSON.stringify(badConfig, null, 2), 'utf8');
  const res = validateMcpConfig(testMcp);

  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('missing both executable')));
  assert.ok(res.errors.some(e => e.includes('potentially dangerous command syntax')));
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
  assert.ok(Object.keys(ledger).length >= 5);

  const check = verifyIntegrity(repoRoot, ledger);
  assert.equal(check.passed, true);
  assert.equal(check.mismatches.length, 0);

  // Tampering test with fake ledger
  const tamperedLedger = { ...ledger, 'manifest.json': '00000000000000000000000000000000' };
  const tamperedCheck = verifyIntegrity(repoRoot, tamperedLedger);
  assert.equal(tamperedCheck.passed, false);
  assert.ok(tamperedCheck.mismatches.includes('manifest.json'));
});

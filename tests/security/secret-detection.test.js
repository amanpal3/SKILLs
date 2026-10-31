/**
 * secret-detection.test.js
 * Automated tests for secret detection, pattern matching, and masking.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { scanForSecrets } = require('../../security/scanners/secret-scanner');

test('Secret scanner detects simulated credentials and masks them safely', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-test-'));

  const testFile = path.join(tmpDir, 'credentials.txt');
  const dummyGithub = 'ghp_' + 'A'.repeat(36);
  const dummyOpenAI = 'sk-' + 'B'.repeat(30);

  fs.writeFileSync(
    testFile,
    `GITHUB_KEY=${dummyGithub}\nOPENAI_KEY=${dummyOpenAI}\nSAFE_LINE=hello_world\n`,
    'utf8'
  );

  const res = scanForSecrets(tmpDir);
  assert.equal(res.findings.length, 2);

  // Check masking (must not reveal full raw token in report)
  for (const f of res.findings) {
    assert.match(f.preview, /\.\.\./);
    assert.notEqual(f.preview, dummyGithub);
    assert.notEqual(f.preview, dummyOpenAI);
  }

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('Current repository contains zero unmasked secrets or sensitive keys', () => {
  const repoRoot = path.resolve(__dirname, '../..');
  const res = scanForSecrets(repoRoot);
  assert.equal(res.findings.length, 0, `Expected 0 secrets in repo, found: ${JSON.stringify(res.findings)}`);
  assert.ok(res.scannedFiles > 1000, `Expected >1000 scanned files, scanned: ${res.scannedFiles}`);
});

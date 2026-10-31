/**
 * path-traversal.test.js
 * Automated tests for path traversal prevention and sensitive directory shielding.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const os = require('os');
const { assertSafePath } = require('../../security/validators/path-validator');

test('assertSafePath rejects null, empty, or whitespace inputs', () => {
  assert.throws(() => assertSafePath(null), /cannot be null/i);
  assert.throws(() => assertSafePath(''), /cannot be null/i);
  assert.throws(() => assertSafePath('   '), /cannot be null/i);
});

test('assertSafePath rejects UNC network paths', () => {
  assert.throws(() => assertSafePath('\\\\evil-server\\share'), /UNC network paths are blocked/i);
  assert.throws(() => assertSafePath('//evil-server/share'), /UNC network paths are blocked/i);
});

test('assertSafePath rejects protected system directories', () => {
  if (process.platform === 'win32') {
    const sysDrive = process.env.SystemDrive || 'C:';
    assert.throws(() => assertSafePath(`${sysDrive}\\`), /matches protected system directory/i);
    assert.throws(() => assertSafePath(`${sysDrive}\\Windows`), /matches protected system directory/i);
    assert.throws(() => assertSafePath(process.env.ProgramFiles || 'C:\\Program Files'), /matches protected system directory/i);
  } else {
    assert.throws(() => assertSafePath('/'), /matches protected system directory/i);
    assert.throws(() => assertSafePath('/etc'), /matches protected system directory/i);
    assert.throws(() => assertSafePath('/root'), /matches protected system directory/i);
  }
});

test('assertSafePath rejects raw user profile root without project subfolder', () => {
  assert.throws(() => assertSafePath(os.homedir()), /raw user profile root/i);
});

test('assertSafePath blocks sensitive credential and key vaults', () => {
  const home = os.homedir();
  assert.throws(() => assertSafePath(path.join(home, '.ssh')), /Access to sensitive credential directory/i);
  assert.throws(() => assertSafePath(path.join(home, '.aws')), /Access to sensitive credential directory/i);
  assert.throws(() => assertSafePath(path.join(home, '.gnupg')), /Access to sensitive credential directory/i);
  assert.throws(() => assertSafePath(path.join(home, '.azure')), /Access to sensitive credential directory/i);
  assert.throws(() => assertSafePath(path.join(home, '.kube')), /Access to sensitive credential directory/i);
});

test('assertSafePath enforces base directory boundaries and blocks ../ traversal', () => {
  const base = path.join(os.tmpdir(), 'safe-boundary-test');
  const outside = path.join(os.tmpdir(), 'unsafe-outside');

  assert.throws(
    () => assertSafePath(outside, { baseDir: base }),
    /Path traversal detected/i
  );

  const inside = path.join(base, 'subfolder');
  const result = assertSafePath(inside, { baseDir: base });
  assert.equal(result, inside);
});

test('assertSafePath accepts legitimate, safe project paths', () => {
  const safeDir = path.join(os.tmpdir(), 'my-valid-project');
  const resolved = assertSafePath(safeDir);
  assert.equal(resolved, path.resolve(safeDir));
});

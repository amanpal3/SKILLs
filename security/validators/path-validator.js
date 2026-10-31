/**
 * path-validator.js
 * Cross-platform path validation, traversal prevention, and sensitive directory shielding.
 */

const path = require('path');
const os = require('os');

const SENSITIVE_SEGMENTS = new Set([
  '.ssh',
  '.aws',
  '.gnupg',
  '.azure',
  '.kube',
  '.git',
  '.docker',
  'id_rsa',
  'id_ed25519'
]);

/**
 * Validates and normalizes target installation or file paths.
 * @param {string} candidatePath - Path to validate
 * @param {object} options
 * @param {boolean} [options.allowSystemRoot=false] - Whether system directories are allowed (always false in safe mode)
 * @param {string} [options.baseDir] - Optional boundary root the path must remain within
 * @returns {string} Fully resolved, sanitized absolute path
 */
function assertSafePath(candidatePath, options = {}) {
  if (!candidatePath || typeof candidatePath !== 'string' || !candidatePath.trim()) {
    throw new Error('Security Error: Target path cannot be null, empty, or whitespace.');
  }

  const raw = candidatePath.trim();

  // 1. Block UNC network paths
  if (raw.startsWith('\\\\') || raw.startsWith('//')) {
    throw new Error(`Security Error: UNC network paths are blocked for security: "${raw}"`);
  }

  // 2. Resolve to canonical absolute path
  const resolved = path.resolve(raw);

  // 3. Block Windows and Unix System Directories
  const systemPaths = [];
  if (process.platform === 'win32') {
    const sysDrive = process.env.SystemDrive || 'C:';
    systemPaths.push(
      sysDrive + '\\',
      sysDrive,
      process.env.SystemRoot || 'C:\\Windows',
      process.env.ProgramFiles || 'C:\\Program Files',
      process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)',
      process.env.ProgramData || 'C:\\ProgramData'
    );
  } else {
    systemPaths.push('/', '/root', '/etc', '/bin', '/sbin', '/usr', '/var', '/sys', '/proc');
  }

  const cleanResolved = resolved.replace(/[/\\]+$/, '').toLowerCase();
  for (const sysPath of systemPaths) {
    if (sysPath && cleanResolved === path.resolve(sysPath).replace(/[/\\]+$/, '').toLowerCase()) {
      throw new Error(`Security Error: Target path matches protected system directory: "${resolved}"`);
    }
  }

  // 4. Block raw User Home directory root without a subfolder
  const userHome = os.homedir().replace(/[/\\]+$/, '').toLowerCase();
  if (cleanResolved === userHome) {
    throw new Error(`Security Error: Target path cannot be the raw user profile root. Specify a project subfolder: "${resolved}"`);
  }

  // 5. Block sensitive credential and cryptographic vaults
  const segments = resolved.split(/[/\\]/).map(s => s.toLowerCase());
  for (const segment of segments) {
    if (SENSITIVE_SEGMENTS.has(segment)) {
      throw new Error(`Security Error: Access to sensitive credential directory ("${segment}") is prohibited: "${resolved}"`);
    }
  }

  // 6. Enforce base boundary if provided
  if (options.baseDir) {
    const resolvedBase = path.resolve(options.baseDir);
    const relative = path.relative(resolvedBase, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`Security Error: Path traversal detected. Target path "${resolved}" escapes base directory "${resolvedBase}"`);
    }
  }

  return resolved;
}

module.exports = {
  assertSafePath,
  SENSITIVE_SEGMENTS
};

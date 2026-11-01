/**
 * path-validator.js
 * Cross-platform path validation, traversal prevention, sensitive directory shielding,
 * and secure recursive directory copying with symlink/junction rejection.
 */

const fs = require('fs');
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
 * Builds the list of system directories for the current OS.
 */
function getSystemPaths() {
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
  return systemPaths;
}

/**
 * Validates and normalizes target installation or file paths.
 * Enforces lexical checks AND resolves real paths across existing filesystem components,
 * rejecting symlinks and junctions when rejectLinks is true.
 *
 * @param {string} candidatePath - Path to validate
 * @param {object} options
 * @param {boolean} [options.rejectLinks=true] - Reject symlinks/reparse points across all existing path components
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

  // 3. Block Windows and Unix System Directories (lexical check)
  const systemPaths = getSystemPaths();
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

  // 5. Block sensitive credential and cryptographic vaults (lexical check)
  const segments = resolved.split(/[/\\]/).map(s => s.toLowerCase());
  for (const segment of segments) {
    if (SENSITIVE_SEGMENTS.has(segment)) {
      throw new Error(`Security Error: Access to sensitive credential directory ("${segment}") is prohibited: "${resolved}"`);
    }
  }

  // 6. Enforce base boundary if provided (lexical check)
  if (options.baseDir) {
    const resolvedBase = path.resolve(options.baseDir);
    const relative = path.relative(resolvedBase, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`Security Error: Path traversal detected. Target path "${resolved}" escapes base directory "${resolvedBase}"`);
    }
  }

  // 7. Filesystem-safe real path resolution across all existing path components
  const rejectLinks = options.rejectLinks !== false;
  const parsed = path.parse(resolved);
  let current = parsed.root;
  const relativeParts = resolved.slice(parsed.root.length).split(path.sep).filter(Boolean);

  for (const part of relativeParts) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) {
      break; // Stop when encountering leaf path components that do not exist yet
    }

    const stat = fs.lstatSync(current);
    if (rejectLinks && stat.isSymbolicLink()) {
      throw new Error(`Security Error: Symlink or junction detected in path component "${current}". Links are prohibited in installation targets.`);
    }

    const real = fs.realpathSync(current);
    const cleanReal = real.replace(/[/\\]+$/, '').toLowerCase();

    for (const sysPath of systemPaths) {
      if (sysPath && cleanReal === path.resolve(sysPath).replace(/[/\\]+$/, '').toLowerCase()) {
        throw new Error(`Security Error: Resolved real path matches protected system directory: "${real}"`);
      }
    }

    const realSegments = real.split(/[/\\]/).map(s => s.toLowerCase());
    for (const seg of realSegments) {
      if (SENSITIVE_SEGMENTS.has(seg)) {
        throw new Error(`Security Error: Resolved real path accesses sensitive directory ("${seg}"): "${real}"`);
      }
    }
  }

  // Verify full realpath boundary if path exists and baseDir is provided
  if (options.baseDir && fs.existsSync(resolved) && fs.existsSync(options.baseDir)) {
    const realBase = fs.realpathSync(options.baseDir);
    const realTarget = fs.realpathSync(resolved);
    const relFromBase = path.relative(realBase, realTarget);
    if (relFromBase.startsWith('..') || path.isAbsolute(relFromBase)) {
      throw new Error(`Security Error: Path traversal detected. Resolved real path "${realTarget}" escapes base directory "${realBase}"`);
    }
  }

  return resolved;
}

/**
 * Secure recursive directory copy that preserves full directory hierarchy
 * (including nested references/, scripts/, templates/, data/) and strictly
 * rejects symlinks and junctions.
 *
 * @param {string} srcDir - Source directory to copy
 * @param {string} destDir - Destination directory
 * @param {object} [options]
 * @param {boolean} [options.rejectLinks=true] - Reject symlinks/reparse points
 * @param {string} [options.sourceBoundary] - Source directory boundary root
 * @param {string} [options.destBoundary] - Destination directory boundary root
 * @param {function} [options.onCollision] - Optional collision handler for modified files
 * @returns {{ copiedFiles: number, copiedDirs: number }}
 */
function secureCopyDirectory(srcDir, destDir, options = {}) {
  const rejectLinks = options.rejectLinks !== false;
  const resolvedSrc = path.resolve(srcDir);
  const resolvedDest = path.resolve(destDir);
  const sourceBoundary = path.resolve(options.sourceBoundary || resolvedSrc);
  const destBoundary = path.resolve(options.destBoundary || resolvedDest);

  if (!fs.existsSync(resolvedSrc)) {
    throw new Error(`Source directory does not exist: "${resolvedSrc}"`);
  }

  // Validate destination path
  assertSafePath(resolvedDest, { rejectLinks, baseDir: options.destBoundary });

  const rootStat = fs.lstatSync(resolvedSrc);
  if (rejectLinks && rootStat.isSymbolicLink()) {
    throw new Error(`Security Error: Symlink or junction detected at source root: "${resolvedSrc}".`);
  }

  if (!fs.existsSync(resolvedDest)) {
    fs.mkdirSync(resolvedDest, { recursive: true });
  }

  let copiedFiles = 0;
  let copiedDirs = 0;

  function copyRecursiveItem(currentSrc, currentDest) {
    let stat;
    try {
      stat = fs.lstatSync(currentSrc);
    } catch {
      // Inaccessible daemon sockets, named pipes, or locked runtime handles are safely skipped
      return;
    }

    if (rejectLinks && stat.isSymbolicLink()) {
      throw new Error(`Security Error: Symlink or junction detected at: "${currentSrc}". Links are prohibited during secure copy.`);
    }

    if (!stat.isDirectory() && !stat.isFile()) {
      // Skip sockets, FIFOs, character/block devices
      return;
    }

    const realSrc = fs.realpathSync(currentSrc);
    const relToSourceBoundary = path.relative(sourceBoundary, realSrc);
    if (relToSourceBoundary.startsWith('..') || path.isAbsolute(relToSourceBoundary)) {
      throw new Error(`Security Error: Source path "${currentSrc}" resolves to "${realSrc}" which escapes boundary "${sourceBoundary}".`);
    }

    if (stat.isDirectory()) {
      if (!fs.existsSync(currentDest)) {
        fs.mkdirSync(currentDest, { recursive: true });
        copiedDirs++;
      }
      const entries = fs.readdirSync(currentSrc);
      for (const entry of entries) {
        copyRecursiveItem(path.join(currentSrc, entry), path.join(currentDest, entry));
      }
    } else if (stat.isFile()) {
      const parentDir = path.dirname(currentDest);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
        copiedDirs++;
      }

      if (typeof options.onCollision === 'function' && fs.existsSync(currentDest)) {
        options.onCollision(currentSrc, currentDest);
      }

      fs.copyFileSync(currentSrc, currentDest);
      copiedFiles++;
    }
  }

  const entries = fs.readdirSync(resolvedSrc);
  for (const entry of entries) {
    copyRecursiveItem(path.join(resolvedSrc, entry), path.join(resolvedDest, entry));
  }

  return { copiedFiles, copiedDirs };
}

module.exports = {
  assertSafePath,
  secureCopyDirectory,
  SENSITIVE_SEGMENTS,
  getSystemPaths
};

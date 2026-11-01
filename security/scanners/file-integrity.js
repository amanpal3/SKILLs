/**
 * file-integrity.js
 * Generates and verifies SHA-256 integrity checksums for core governance and config files
 * against a trusted versioned integrity manifest (integrity.json).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CRITICAL_FILES = [
  'manifest.json',
  'mcp.json',
  'GEMINI.md',
  'AGENTS.md',
  'CLAUDE.md',
  'DEFEND.md',
  'PONYTAIL.md',
  'backend.md',
  'CODEX.md'
];

/**
 * Calculates SHA-256 hash of a file.
 * @param {string} filePath
 * @returns {string|null} Hex digest
 */
function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes a deterministic root hash over the file integrity map.
 * @param {Record<string, string>} files
 * @returns {string} SHA-256 root digest
 */
function computeRootHash(files) {
  const sortedKeys = Object.keys(files).sort();
  const hasher = crypto.createHash('sha256');
  for (const k of sortedKeys) {
    hasher.update(`${k}:${files[k]}\n`);
  }
  return hasher.digest('hex');
}

/**
 * Computes an integrity ledger for all critical files in a repository.
 * Covers root governance files, all skill definitions, plugin manifests, and security rules.
 * @param {string} repoRoot
 * @returns {Record<string, string>}
 */
function computeIntegrity(repoRoot) {
  const ledger = {};

  // 1. Root governance and config files
  for (const relPath of CRITICAL_FILES) {
    const full = path.join(repoRoot, relPath);
    if (fs.existsSync(full)) {
      ledger[relPath] = hashFile(full);
    }
  }

  // 2. All ecosystem skill definitions (.agent/skills/*/SKILL.md)
  const skillsDir = path.join(repoRoot, '.agent', 'skills');
  if (fs.existsSync(skillsDir)) {
    const entries = fs.readdirSync(skillsDir).sort();
    for (const entry of entries) {
      const skillMd = path.join('.agent', 'skills', entry, 'SKILL.md');
      const full = path.join(repoRoot, skillMd);
      if (fs.existsSync(full)) {
        ledger[skillMd.replace(/\\/g, '/')] = hashFile(full);
      }
    }
  }

  // 3. All ecosystem plugin manifests and rule files (.agent/plugins/*)
  const pluginsDir = path.join(repoRoot, '.agent', 'plugins');
  if (fs.existsSync(pluginsDir)) {
    const pluginEntries = fs.readdirSync(pluginsDir).sort();
    for (const p of pluginEntries) {
      const candidateFiles = [
        path.join('.agent', 'plugins', p, 'package.json'),
        path.join('.agent', 'plugins', p, 'plugin.json'),
        path.join('.agent', 'plugins', p, 'rules', 'AGENTS.md')
      ];
      for (const cf of candidateFiles) {
        const full = path.join(repoRoot, cf);
        if (fs.existsSync(full)) {
          ledger[cf.replace(/\\/g, '/')] = hashFile(full);
        }
      }
    }
  }

  // 4. Governance rules (.agent/rules/*.md)
  const rulesDir = path.join(repoRoot, '.agent', 'rules');
  if (fs.existsSync(rulesDir)) {
    for (const r of fs.readdirSync(rulesDir).sort()) {
      if (r.endsWith('.md')) {
        const rel = path.join('.agent', 'rules', r).replace(/\\/g, '/');
        const full = path.join(repoRoot, rel);
        if (fs.existsSync(full)) {
          ledger[rel] = hashFile(full);
        }
      }
    }
  }

  return ledger;
}

/**
 * Validates files against an expected integrity ledger.
 * @param {string} repoRoot
 * @param {Record<string, string>} expectedLedger
 * @returns {{ passed: boolean, mismatches: string[], missing: string[] }}
 */
function verifyIntegrity(repoRoot, expectedLedger) {
  const mismatches = [];
  const missing = [];

  for (const [relPath, expectedHash] of Object.entries(expectedLedger)) {
    const full = path.join(repoRoot, relPath);
    if (!fs.existsSync(full)) {
      missing.push(relPath);
    } else {
      const currentHash = hashFile(full);
      if (currentHash !== expectedHash) {
        mismatches.push(relPath);
      }
    }
  }

  return {
    passed: mismatches.length === 0 && missing.length === 0,
    mismatches,
    missing
  };
}

/**
 * Validates the repository against the shipped trusted integrity.json manifest.
 * @param {string} repoRoot
 * @param {string} [manifestName='integrity.json']
 * @returns {{ passed: boolean, mismatches: string[], missing: string[], verifiedCount: number, error?: string }}
 */
function verifyPackageIntegrity(repoRoot, manifestName = 'integrity.json') {
  const manifestPath = path.join(repoRoot, manifestName);
  if (!fs.existsSync(manifestPath)) {
    return {
      passed: false,
      mismatches: [],
      missing: [manifestName],
      verifiedCount: 0,
      error: `Integrity manifest "${manifestName}" is missing.`
    };
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const expected = manifest.files || {};
    const res = verifyIntegrity(repoRoot, expected);

    // Verify aggregate root hash if present in manifest
    if (manifest.rootHash) {
      const calculatedRoot = computeRootHash(expected);
      if (calculatedRoot !== manifest.rootHash) {
        return {
          passed: false,
          mismatches: [...res.mismatches, 'integrity.json:rootHash'],
          missing: res.missing,
          verifiedCount: Object.keys(expected).length,
          error: 'Integrity manifest rootHash does not match calculated ledger digest.'
        };
      }
    }

    return {
      ...res,
      verifiedCount: Object.keys(expected).length
    };
  } catch (err) {
    return {
      passed: false,
      mismatches: [],
      missing: [],
      verifiedCount: 0,
      error: `Failed to parse integrity manifest: ${err.message}`
    };
  }
}

module.exports = {
  hashFile,
  computeIntegrity,
  computeRootHash,
  verifyIntegrity,
  verifyPackageIntegrity,
  CRITICAL_FILES
};

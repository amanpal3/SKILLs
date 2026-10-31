/**
 * file-integrity.js
 * Generates and verifies SHA-256 integrity checksums for core governance and config files.
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
  'PONYTAIL.md'
];

/**
 * Calculates SHA-256 hash of a file.
 * @param {string} filePath
 * @returns {string} Hex digest
 */
function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes an integrity ledger for all critical files in a repository.
 * @param {string} repoRoot
 * @returns {Record<string, string>}
 */
function computeIntegrity(repoRoot) {
  const ledger = {};
  for (const relPath of CRITICAL_FILES) {
    const full = path.join(repoRoot, relPath);
    if (fs.existsSync(full)) {
      ledger[relPath] = hashFile(full);
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

module.exports = {
  hashFile,
  computeIntegrity,
  verifyIntegrity,
  CRITICAL_FILES
};

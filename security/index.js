/**
 * security/index.js
 * Central export for all ecosystem security scanners, validators, and policies.
 */

const { assertSafePath, secureCopyDirectory, SENSITIVE_SEGMENTS } = require('./validators/path-validator');
const { validateManifest } = require('./validators/manifest-validator');
const { validateMcpConfig, KNOWN_MCP_SERVERS, isPrivateOrInternalHost } = require('./validators/mcp-validator');
const { scanForSecrets, SECRET_PATTERNS } = require('./scanners/secret-scanner');
const { hashFile, computeIntegrity, verifyIntegrity, verifyPackageIntegrity, CRITICAL_FILES } = require('./scanners/file-integrity');
const permissionsPolicy = require('./policies/permissions.json');

module.exports = {
  assertSafePath,
  secureCopyDirectory,
  SENSITIVE_SEGMENTS,
  validateManifest,
  validateMcpConfig,
  KNOWN_MCP_SERVERS,
  isPrivateOrInternalHost,
  scanForSecrets,
  SECRET_PATTERNS,
  hashFile,
  computeIntegrity,
  verifyIntegrity,
  verifyPackageIntegrity,
  CRITICAL_FILES,
  permissionsPolicy
};

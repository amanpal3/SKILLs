/**
 * secret-scanner.js
 * Comprehensive static secret and credential detection scanner.
 * Scans directories safely without following symlinks, supports multiple tokens per line,
 * and detects modern OpenAI and API credentials.
 */

const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  { name: 'GitHub Classic Token', re: /\bghp_[a-zA-Z0-9]{30,}\b/g },
  { name: 'GitHub Fine-grained PAT', re: /\bgithub_pat_[a-zA-Z0-9_]{30,}\b/g },
  { name: 'OpenAI Secret Key', re: /\b(?:sk-proj-[a-zA-Z0-9_\-]{20,}|sk-[a-zA-Z0-9]{20,})\b/g },
  { name: 'Anthropic Secret Key', re: /\bsk-ant-api[0-9a-zA-Z_\-]{20,}\b/g },
  { name: 'Context7 Secret Key', re: /\bctx7sk-[a-zA-Z0-9_-]{20,}\b/g },
  { name: '21st Secret Key', re: /\b21st_sk_[a-zA-Z0-9_]{20,}\b/g },
  { name: 'Google Cloud API Key', re: /\bAIza[0-9A-Za-z-_]{35}\b/g },
  { name: 'AWS Access Key ID', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'Private Key Header', re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'Slack Bot Token', re: /\bxoxb-[0-9]{10,}-[a-zA-Z0-9]+\b/g }
];

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.tmp',
  'coverage',
  '.pytest_cache'
]);

/**
 * Scans a target directory or file for credentials.
 * Does NOT follow symlinks or junctions to prevent directory escape.
 *
 * @param {string} targetPath - Root directory or file to scan
 * @returns {{ findings: Array<{ file: string, line: number, pattern: string, preview: string }>, scannedFiles: number }}
 */
function scanForSecrets(targetPath) {
  const root = path.resolve(targetPath);
  const findings = [];
  let scannedFiles = 0;

  function traverse(itemPath) {
    if (!fs.existsSync(itemPath)) return;

    // Use lstatSync to detect symlinks and junctions before following
    const stat = fs.lstatSync(itemPath);

    if (stat.isSymbolicLink()) {
      // Security guard: strictly skip symlinks and junctions to avoid following outside links
      return;
    }

    // Verify realpath remains within root boundary
    const realPath = fs.realpathSync(itemPath);
    const relToRoot = path.relative(root, realPath);
    if (relToRoot.startsWith('..') || (path.isAbsolute(relToRoot) && relToRoot !== root)) {
      return;
    }

    if (stat.isDirectory()) {
      const dirName = path.basename(itemPath);
      if (IGNORED_DIRS.has(dirName) || dirName.startsWith('.bak_')) return;

      const entries = fs.readdirSync(itemPath);
      for (const entry of entries) {
        traverse(path.join(itemPath, entry));
      }
    } else if (stat.isFile()) {
      // Exclude binary files
      const ext = path.extname(itemPath).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.pdf', '.zip', '.tar', '.gz', '.db', '.sqlite'].includes(ext)) {
        return;
      }

      scannedFiles++;
      try {
        const content = fs.readFileSync(itemPath, 'utf8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const lineText = lines[i];
          for (const pattern of SECRET_PATTERNS) {
            pattern.re.lastIndex = 0;
            let match;
            // Capture ALL matches per line (not just the first one)
            while ((match = pattern.re.exec(lineText)) !== null) {
              const matchedStr = match[0];
              const masked = matchedStr.length > 8
                ? matchedStr.slice(0, 4) + '...' + matchedStr.slice(-4)
                : '****';
              findings.push({
                file: path.relative(root, itemPath),
                line: i + 1,
                pattern: pattern.name,
                preview: masked
              });
            }
          }
        }
      } catch (err) {
        // Skip unreadable files safely
      }
    }
  }

  traverse(root);

  return {
    findings,
    scannedFiles
  };
}

module.exports = {
  scanForSecrets,
  SECRET_PATTERNS
};

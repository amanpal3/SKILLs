/**
 * mcp-validator.js
 * Validates MCP server definitions against schema, flags unauthenticated/unknown servers,
 * detects accidental hardcoded secrets, and enforces strict HTTPS and SSRF protection for remote MCP servers.
 */

const fs = require('fs');
const path = require('path');

const KNOWN_MCP_SERVERS = new Set([
  'shadcn',
  '21st',
  'context7',
  'StitchMCP',
  'chrome-devtools-mcp',
  'playwright',
  'github',
  'github-mcp-server',
  'gmp-code-assist',
  'firebase-mcp-server'
]);

const SECRET_REGEX = /(?:ghp_[a-zA-Z0-9]{30,}|sk-[a-zA-Z0-9]{20,}|ctx7sk-[a-zA-Z0-9_-]{20,}|21st_sk_[a-zA-Z0-9_]{20,}|AIza[0-9A-Za-z-_]{35}|-----BEGIN [A-Z ]+ PRIVATE KEY-----)/;

/**
 * Checks whether a hostname corresponds to an internal, private, loopback, or metadata network target (SSRF prevention).
 * @param {string} hostname
 * @returns {boolean}
 */
function isPrivateOrInternalHost(hostname) {
  if (!hostname || typeof hostname !== 'string') return true;
  const host = hostname.replace(/^\[|\]$/g, '').trim().toLowerCase();

  // Localhost aliases
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1') {
    return true;
  }

  // IPv4 Loopback (127.0.0.0/8)
  if (/^127\./.test(host)) return true;

  // IPv4 Private Networks (RFC 1918)
  if (/^10\./.test(host)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;

  // Link-Local / Cloud Metadata (169.254.0.0/16)
  if (/^169\.254\./.test(host)) return true;

  // Carrier-Grade NAT (RFC 6598: 100.64.0.0/10)
  if (/^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./.test(host)) return true;

  // IPv6 Unique Local Address (ULA) & Link-Local
  if (/^(fc|fd|fe80)/i.test(host)) return true;

  return false;
}

/**
 * Validates an MCP configuration file.
 * @param {string} configPath - Absolute path to mcp.json or mcp_config.json
 * @returns {{ valid: boolean, errors: string[], warnings: string[], serverCount: number }}
 */
function validateMcpConfig(configPath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(configPath)) {
    return {
      valid: false,
      errors: [`MCP configuration file does not exist: "${configPath}"`],
      warnings,
      serverCount: 0
    };
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    return {
      valid: false,
      errors: [`Malformed JSON in MCP configuration "${configPath}": ${err.message}`],
      warnings,
      serverCount: 0
    };
  }

  const servers = data.mcpServers || {};
  const serverNames = Object.keys(servers);

  if (serverNames.length === 0) {
    warnings.push('MCP configuration contains 0 servers in mcpServers.');
  }

  for (const name of serverNames) {
    const s = servers[name];
    if (!s || typeof s !== 'object') {
      errors.push(`Server "${name}" definition is invalid or not an object.`);
      continue;
    }

    // 1. Unknown server warning
    if (!KNOWN_MCP_SERVERS.has(name)) {
      warnings.push(`Unrecognized or untrusted third-party MCP server detected: "${name}". Verify its integrity before running.`);
    }

    // 2. Transport check (either command/args or serverUrl)
    const hasCommand = typeof s.command === 'string' && s.command.trim().length > 0;
    const rawUrl = s.serverUrl || s.url;
    const hasUrl = typeof rawUrl === 'string' && rawUrl.trim().length > 0;

    if (!hasCommand && !hasUrl) {
      errors.push(`Server "${name}" is missing both executable "command" and remote "serverUrl".`);
    }

    // 3. Strict Remote URL Validation & SSRF Prevention
    if (hasUrl) {
      try {
        const parsed = new URL(rawUrl);
        if (parsed.protocol !== 'https:') {
          errors.push(`Server "${name}" remote URL "${rawUrl}" uses insecure protocol "${parsed.protocol}". Only HTTPS is allowed for remote MCP servers.`);
        } else if (isPrivateOrInternalHost(parsed.hostname)) {
          errors.push(`Server "${name}" remote URL "${rawUrl}" targets internal/private/loopback address "${parsed.hostname}". Remote MCP servers must target public HTTPS endpoints.`);
        }
      } catch (urlErr) {
        errors.push(`Server "${name}" remote URL "${rawUrl}" is not a valid URL: ${urlErr.message}`);
      }
    }

    // 4. Command injection safeguards
    if (hasCommand) {
      const fullCmd = [s.command, ...(Array.isArray(s.args) ? s.args : [])].join(' ');
      if (/[;&|`$]/.test(s.command) || fullCmd.includes('rm -rf') || (fullCmd.includes('curl ') && fullCmd.includes('sh'))) {
        errors.push(`Server "${name}" contains potentially dangerous command syntax: "${fullCmd}"`);
      }

      // Check args for remote URLs with SSRF / insecure protocols
      if (Array.isArray(s.args)) {
        for (const arg of s.args) {
          if (typeof arg === 'string' && /^https?:\/\//i.test(arg)) {
            try {
              const parsedArgUrl = new URL(arg);
              if (parsedArgUrl.protocol !== 'https:') {
                errors.push(`Server "${name}" argument URL "${arg}" must use HTTPS.`);
              } else if (isPrivateOrInternalHost(parsedArgUrl.hostname)) {
                errors.push(`Server "${name}" argument URL "${arg}" targets prohibited internal/private host "${parsedArgUrl.hostname}".`);
              }
            } catch {
              // Ignore argument parsing errors if not standard URL
            }
          }
        }
      }
    }

    // 5. Secret leak check in config
    const serialized = JSON.stringify(s);
    if (SECRET_REGEX.test(serialized)) {
      errors.push(`Server "${name}" configuration appears to contain a hardcoded plaintext credential or private key.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    serverCount: serverNames.length
  };
}

module.exports = {
  validateMcpConfig,
  isPrivateOrInternalHost,
  KNOWN_MCP_SERVERS
};

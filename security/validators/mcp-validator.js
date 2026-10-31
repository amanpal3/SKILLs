/**
 * mcp-validator.js
 * Validates MCP server definitions against schema, flags unauthenticated/unknown servers,
 * and detects accidental hardcoded secrets in configurations.
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
    const hasUrl = typeof s.serverUrl === 'url' || typeof s.serverUrl === 'string' || typeof s.url === 'string';

    if (!hasCommand && !hasUrl) {
      errors.push(`Server "${name}" is missing both executable "command" and remote "serverUrl".`);
    }

    // 3. Command injection safeguards
    if (hasCommand) {
      const fullCmd = [s.command, ...(Array.isArray(s.args) ? s.args : [])].join(' ');
      if (/[;&|`$]/.test(s.command) || fullCmd.includes('rm -rf') || fullCmd.includes('curl ') && fullCmd.includes('sh')) {
        errors.push(`Server "${name}" contains potentially dangerous command syntax: "${fullCmd}"`);
      }
    }

    // 4. Secret leak check in config
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
  KNOWN_MCP_SERVERS
};

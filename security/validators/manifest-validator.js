/**
 * manifest-validator.js
 * Validates manifest.json integrity, skill catalog sync, and plugin specifications.
 */

const fs = require('fs');
const path = require('path');

/**
 * Validates manifest.json against the repository filesystem.
 * @param {string} [manifestPath] - Path to manifest.json
 * @param {string} [repoRoot] - Path to root repository
 * @returns {{ valid: boolean, errors: string[], warnings: string[], stats: object }}
 */
function validateManifest(manifestPath, repoRoot) {
  const root = repoRoot ? path.resolve(repoRoot) : path.resolve(__dirname, '../..');
  const file = manifestPath ? path.resolve(manifestPath) : path.join(root, 'manifest.json');

  const errors = [];
  const warnings = [];

  if (!fs.existsSync(file)) {
    return {
      valid: false,
      errors: [`manifest.json not found at: ${file}`],
      warnings,
      stats: {}
    };
  }

  let data;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    return {
      valid: false,
      errors: [`Failed to parse manifest.json: ${err.message}`],
      warnings,
      stats: {}
    };
  }

  // 1. Schema fields
  if (!data.name || typeof data.name !== 'string') errors.push('manifest.json: "name" must be a non-empty string.');
  if (!data.version || typeof data.version !== 'string') errors.push('manifest.json: "version" must be a non-empty string.');
  if (!Array.isArray(data.skills)) errors.push('manifest.json: "skills" must be an array.');

  // 2. Skill directory verification
  const skillsDir = path.join(root, '.agent', 'skills');
  const detectedSkills = fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : [];

  if (Array.isArray(data.skills)) {
    const skillSet = new Set();
    for (const skill of data.skills) {
      if (skillSet.has(skill)) {
        errors.push(`Duplicate skill entry in manifest: "${skill}"`);
      }
      skillSet.add(skill);

      const skillPath = path.join(skillsDir, skill);
      if (!fs.existsSync(skillPath)) {
        errors.push(`Manifest references missing skill directory: ".agent/skills/${skill}"`);
      } else {
        const skillDoc = path.join(skillPath, 'SKILL.md');
        if (!fs.existsSync(skillDoc)) {
          warnings.push(`Skill "${skill}" lacks a SKILL.md instruction file.`);
        }
      }
    }

    // Check for orphaned skill directories not in manifest
    for (const dirName of detectedSkills) {
      if (!skillSet.has(dirName)) {
        warnings.push(`Filesystem directory ".agent/skills/${dirName}" is not registered in manifest.json`);
      }
    }
  }

  // 3. Plugins verification
  const pluginsDir = path.join(root, '.agent', 'plugins');
  if (Array.isArray(data.plugins)) {
    for (const plugin of data.plugins) {
      const pluginPath = path.join(pluginsDir, plugin);
      if (!fs.existsSync(pluginPath)) {
        errors.push(`Manifest references missing plugin directory: ".agent/plugins/${plugin}"`);
      }
    }
  }

  // 4. MCP Servers verification
  if (data.mcp_servers && typeof data.mcp_servers === 'object') {
    for (const [serverName, config] of Object.entries(data.mcp_servers)) {
      if (!config.description) {
        warnings.push(`MCP Server "${serverName}" in manifest lacks a description.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      declaredSkills: data.skills ? data.skills.length : 0,
      detectedSkills: detectedSkills.length,
      declaredPlugins: data.plugins ? data.plugins.length : 0,
      declaredMcpServers: data.mcp_servers ? Object.keys(data.mcp_servers).length : 0
    }
  };
}

module.exports = {
  validateManifest
};

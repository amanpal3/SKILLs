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

  // Check declared count sync if provided
  if (data.skills_count !== undefined && Array.isArray(data.skills)) {
    if (data.skills_count !== data.skills.length) {
      errors.push(`manifest.json: "skills_count" (${data.skills_count}) does not match skills array length (${data.skills.length}).`);
    }
  }

  // 2. Skill directory and metadata verification
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
          errors.push(`Skill "${skill}" lacks a required SKILL.md instruction file.`);
        } else {
          // Validate YAML frontmatter
          try {
            const docContent = fs.readFileSync(skillDoc, 'utf8');
            const fmMatch = docContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (!fmMatch) {
              errors.push(`Skill "${skill}" SKILL.md is missing valid YAML frontmatter (--- ... ---).`);
            } else {
              const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
              const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
              if (!nameMatch || !nameMatch[1].trim()) {
                errors.push(`Skill "${skill}" SKILL.md frontmatter lacks a valid "name" field.`);
              } else {
                const parsedName = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
                if (parsedName !== skill) {
                  errors.push(`Skill "${skill}" directory name does not match frontmatter name "${parsedName}".`);
                }
              }
              if (!descMatch || !descMatch[1].trim()) {
                errors.push(`Skill "${skill}" SKILL.md frontmatter lacks a non-empty "description" field.`);
              }
            }
          } catch (readErr) {
            errors.push(`Failed to read SKILL.md for skill "${skill}": ${readErr.message}`);
          }
        }
      }
    }

    // Fail CI when filesystem contains skills not registered in manifest.json
    for (const dirName of detectedSkills) {
      if (!skillSet.has(dirName)) {
        errors.push(`Undeclared skill: Filesystem directory ".agent/skills/${dirName}" is not registered in manifest.json`);
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

#!/usr/bin/env node
/**
 * scripts/sync-catalog.js
 * Automated synchronization and self-validation gate for the skill catalog.
 *
 * Enforces:
 * 1. Every directory in .agent/skills has a valid SKILL.md with frontmatter (name, description).
 * 2. Frontmatter name strictly matches directory name.
 * 3. manifest.json skills array and skills_count are perfectly in sync with filesystem.
 * 4. README.md skill catalog table contains all declared skills.
 * 5. ECOSYSTEM.md details all declared skills.
 *
 * Usage:
 *   node scripts/sync-catalog.js --check   (CI validation gate - exits 1 on drift)
 *   node scripts/sync-catalog.js           (Syncs manifest.json and reports status)
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(REPO_ROOT, '.agent', 'skills');
const MANIFEST_PATH = path.join(REPO_ROOT, 'manifest.json');
const README_PATH = path.join(REPO_ROOT, 'README.md');
const ECOSYSTEM_PATH = path.join(REPO_ROOT, 'ECOSYSTEM.md');

const isCheckOnly = process.argv.includes('--check');

function run() {
  console.log(`\n[CATALOG SYNC] Validating Dr-SKILLs catalog integrity...`);
  const errors = [];
  const warnings = [];

  // 1. Scan filesystem skills
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`[ERROR] Skills directory not found at: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const detectedSkills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  console.log(`[INFO] Detected ${detectedSkills.length} skills in .agent/skills/`);

  // 2. Validate metadata for each skill
  for (const skill of detectedSkills) {
    const docPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
    if (!fs.existsSync(docPath)) {
      errors.push(`Skill "${skill}" is missing required SKILL.md instruction file.`);
      continue;
    }

    try {
      const content = fs.readFileSync(docPath, 'utf8');
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fmMatch) {
        errors.push(`Skill "${skill}" SKILL.md is missing valid YAML frontmatter (--- ... ---).`);
        continue;
      }

      const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
      const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);

      if (!nameMatch || !nameMatch[1].trim()) {
        errors.push(`Skill "${skill}" frontmatter lacks a valid "name" field.`);
      } else {
        const parsedName = nameMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (parsedName !== skill) {
          errors.push(`Skill directory "${skill}" does not match frontmatter name "${parsedName}".`);
        }
      }

      if (!descMatch || !descMatch[1].trim()) {
        errors.push(`Skill "${skill}" frontmatter lacks a non-empty "description" field.`);
      }
    } catch (err) {
      errors.push(`Error reading SKILL.md for "${skill}": ${err.message}`);
    }
  }

  // 3. Validate / Sync manifest.json
  if (!fs.existsSync(MANIFEST_PATH)) {
    errors.push(`manifest.json not found at: ${MANIFEST_PATH}`);
  } else {
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (err) {
      errors.push(`Failed to parse manifest.json: ${err.message}`);
    }

    if (manifest) {
      const manifestSkills = manifest.skills || [];
      const manifestSet = new Set(manifestSkills);

      // Check for missing or undeclared skills
      const missingInManifest = detectedSkills.filter(s => !manifestSet.has(s));
      const missingOnFs = manifestSkills.filter(s => !detectedSkills.includes(s));

      if (missingInManifest.length > 0) {
        errors.push(`Skills missing from manifest.json: ${missingInManifest.join(', ')}`);
      }
      if (missingOnFs.length > 0) {
        errors.push(`Manifest references nonexistent skills on filesystem: ${missingOnFs.join(', ')}`);
      }

      if (manifest.skills_count !== undefined && manifest.skills_count !== detectedSkills.length) {
        errors.push(`manifest.json skills_count (${manifest.skills_count}) !== actual count (${detectedSkills.length})`);
      }

      // If not check-only, automatically synchronize manifest.json
      if (!isCheckOnly && (missingInManifest.length > 0 || manifest.skills_count !== detectedSkills.length)) {
        manifest.skills = detectedSkills;
        manifest.skills_count = detectedSkills.length;
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
        console.log(`[SYNC] manifest.json successfully synchronized (${detectedSkills.length} skills).`);
      }
    }
  }

  // 4. Validate README.md documentation sync
  if (fs.existsSync(README_PATH)) {
    const readmeContent = fs.readFileSync(README_PATH, 'utf8');
    const tableMatches = [...readmeContent.matchAll(/\|\s*\*\*`([^`]+)`\*\*\s*\|/g)].map(m => m[1]);
    const readmeSet = new Set(tableMatches);
    const missingInReadme = detectedSkills.filter(s => !readmeSet.has(s));

    if (missingInReadme.length > 0) {
      errors.push(`Skills missing from README.md catalog tables: ${missingInReadme.join(', ')}`);
    }

    const countHeaderMatch = readmeContent.match(/## 🧩 Skill Catalog \((\d+) Skills\)/);
    if (countHeaderMatch) {
      const readmeCount = parseInt(countHeaderMatch[1], 10);
      if (readmeCount !== detectedSkills.length) {
        errors.push(`README.md header states ${readmeCount} skills, expected ${detectedSkills.length}.`);
      }
    }
  } else {
    warnings.push('README.md not found for documentation check.');
  }

  // 5. Validate ECOSYSTEM.md documentation sync
  if (fs.existsSync(ECOSYSTEM_PATH)) {
    const ecoContent = fs.readFileSync(ECOSYSTEM_PATH, 'utf8');
    const ecoMatches = [...ecoContent.matchAll(/#### \d+\.\s*`([^`]+)`/g)].map(m => m[1]);
    const ecoSet = new Set(ecoMatches);
    const missingInEco = detectedSkills.filter(s => !ecoSet.has(s));

    if (missingInEco.length > 0) {
      errors.push(`Skills missing detailed specifications in ECOSYSTEM.md: ${missingInEco.join(', ')}`);
    }
  } else {
    warnings.push('ECOSYSTEM.md not found for documentation check.');
  }

  // Print results
  if (warnings.length > 0) {
    warnings.forEach(w => console.warn(`  [WARN] ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\n[FAIL] Catalog verification found ${errors.length} issue(s):`);
    errors.forEach(e => console.error(`  [-] ${e}`));
    process.exit(1);
  }

  console.log(`\n[PASS] All ${detectedSkills.length} skills are 100% synchronized across filesystem, manifest.json, README.md, and ECOSYSTEM.md.`);
  console.log(`[PASS] Frontmatter metadata, unique names, and directory mappings strictly verified.\n`);
}

run();

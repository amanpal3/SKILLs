#!/bin/bash
# init_project.sh — Antigravity Agents Project Bootstrap
# Run this once at the start of every new project.
# Usage: bash init_project.sh <project-name>

set -e

PROJECT_NAME=${1:-"my-project"}
SKILL_ROOT="$(dirname "$0")/.."

echo ""
echo "⚡ ANTIGRAVITY AGENTS — Project Initializer"
echo "============================================"
echo "Project: $PROJECT_NAME"
echo ""

# Create project directory structure
echo "🧠 Tony Stark: Scaffolding project structure..."
mkdir -p "$PROJECT_NAME/src/api"
mkdir -p "$PROJECT_NAME/src/services"
mkdir -p "$PROJECT_NAME/src/repositories"
mkdir -p "$PROJECT_NAME/src/middleware"
mkdir -p "$PROJECT_NAME/src/models"
mkdir -p "$PROJECT_NAME/src/utils"
mkdir -p "$PROJECT_NAME/src/config"
mkdir -p "$PROJECT_NAME/src/types"
mkdir -p "$PROJECT_NAME/tests/unit"
mkdir -p "$PROJECT_NAME/tests/integration"
mkdir -p "$PROJECT_NAME/scripts"
mkdir -p "$PROJECT_NAME/docs"

echo "  ✅ Directory structure created"

# Copy mission templates
echo "👑 Nick Fury: Copying mission templates..."
cp "$SKILL_ROOT/templates/MISSION_LOG.md" "$PROJECT_NAME/docs/MISSION_LOG.md"
cp "$SKILL_ROOT/templates/ARCHITECTURE.md" "$PROJECT_NAME/docs/ARCHITECTURE.md"
cp "$SKILL_ROOT/templates/BRAND_GUIDE.md" "$PROJECT_NAME/docs/BRAND_GUIDE.md"
cp "$SKILL_ROOT/templates/SPRINT_PLAN.md" "$PROJECT_NAME/docs/SPRINT_PLAN.md"

# Replace placeholder project name in docs
sed -i "s/\[Project Name\]/$PROJECT_NAME/g" "$PROJECT_NAME/docs/MISSION_LOG.md" 2>/dev/null || true
sed -i "s/\[Project Name\]/$PROJECT_NAME/g" "$PROJECT_NAME/docs/ARCHITECTURE.md" 2>/dev/null || true

echo "  ✅ Mission templates copied to docs/"

# Create .env.example
echo "🔒 Black Widow: Creating secrets template..."
cat > "$PROJECT_NAME/.env.example" << 'EOF'
# ============================================
# Environment Variables — DO NOT COMMIT .env
# Copy this to .env and fill in real values
# ============================================

# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Auth
JWT_SECRET=change-this-to-64-random-characters-minimum
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=change-this-to-another-64-random-chars
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379

# External APIs (add as needed)
# STRIPE_SECRET_KEY=
# SENDGRID_API_KEY=
# SENTRY_DSN=
EOF

echo "  ✅ .env.example created"

# Create .gitignore
echo "🛠️ War Machine: Creating .gitignore..."
cat > "$PROJECT_NAME/.gitignore" << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc

# Environment
.env
.env.local
.env.production
.env.staging

# Build outputs
dist/
build/
.next/
out/

# Secrets & keys
*.pem
*.key
*.cert
secrets/

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Test coverage
coverage/
.nyc_output/
EOF

echo "  ✅ .gitignore created"

# Create health check endpoint stub
echo "🔥 Thor: Creating health check stub..."
mkdir -p "$PROJECT_NAME/src/api"
cat > "$PROJECT_NAME/src/api/health.js" << 'EOF'
/**
 * Health check endpoint
 * GET /api/health
 * No auth required — used by load balancers and monitoring
 */
async function healthCheck(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: process.env.npm_package_version || '0.0.1',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    },
    message: 'Service is running',
    timestamp: new Date().toISOString(),
    requestId: req.id || 'health-check'
  });
}

module.exports = { healthCheck };
EOF

echo "  ✅ Health check endpoint created"

# Create README
echo "📋 Creating README..."
cat > "$PROJECT_NAME/README.md" << EOF
# $PROJECT_NAME

> Built with ⚡ Antigravity Agents

## Quick Start
\`\`\`bash
cp .env.example .env
# Fill in .env values
npm install
npm run dev
\`\`\`

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Brand Guide](docs/BRAND_GUIDE.md)
- [Mission Log](docs/MISSION_LOG.md)
- [Sprint Plan](docs/SPRINT_PLAN.md)

## Health Check
\`GET /api/health\` — Returns service status (no auth required)
EOF

echo "  ✅ README.md created"

echo ""
echo "============================================"
echo "✅ PROJECT INITIALIZED: $PROJECT_NAME"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_NAME"
echo "  2. cp .env.example .env && fill in values"
echo "  3. Open docs/ARCHITECTURE.md — Tony Stark needs input"
echo "  4. Open docs/SPRINT_PLAN.md — Nick Fury is waiting"
echo ""
echo "⚡ Antigravity Agents — Standing by."
echo ""

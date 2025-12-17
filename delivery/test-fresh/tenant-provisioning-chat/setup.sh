#!/bin/bash

# =============================================================================
# TenantProvisioningChat - One-Click Setup Script
# =============================================================================
#
# This script sets up everything needed to run the component.
# Just run: ./setup.sh
#
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  TenantProvisioningChat - One-Click Setup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Get script directory (where the package was unzipped)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PACKAGE_NAME="tenant-provisioning-chat"

# Check if we're in the right place
if [ ! -f "$SCRIPT_DIR/TenantProvisioningChat.tsx" ]; then
    echo -e "${RED}Error: TenantProvisioningChat.tsx not found.${NC}"
    echo "Please run this script from the package directory."
    exit 1
fi

# Detect package manager
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm add"
    DEV_INSTALL_CMD="pnpm add -D"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
    INSTALL_CMD="yarn add"
    DEV_INSTALL_CMD="yarn add -D"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
    DEV_INSTALL_CMD="npm install --save-dev"
else
    echo -e "${RED}Error: No package manager found (npm, yarn, or pnpm required)${NC}"
    exit 1
fi

echo -e "${GREEN}Using package manager: $PKG_MANAGER${NC}"
echo ""

# =============================================================================
# Step 1: Initialize project if needed
# =============================================================================
echo -e "${YELLOW}Step 1: Checking project setup...${NC}"

# Go to parent directory (where consumer's project should be)
cd "$SCRIPT_DIR/.."

if [ ! -f "package.json" ]; then
    echo "  Creating package.json..."
    if [ "$PKG_MANAGER" = "pnpm" ]; then
        pnpm init
    elif [ "$PKG_MANAGER" = "yarn" ]; then
        yarn init -y
    else
        npm init -y
    fi
fi

# =============================================================================
# Step 1.5: Configure pnpm to allow esbuild builds (CRITICAL for pnpm)
# =============================================================================
if [ "$PKG_MANAGER" = "pnpm" ]; then
    echo "  Configuring pnpm build permissions..."
    if command -v jq &> /dev/null; then
        # Use jq to add pnpm.onlyBuiltDependencies
        TEMP_FILE=$(mktemp)
        jq '.pnpm.onlyBuiltDependencies = ["esbuild"]' package.json > "$TEMP_FILE" 2>/dev/null || \
        jq '. + {"pnpm": {"onlyBuiltDependencies": ["esbuild"]}}' package.json > "$TEMP_FILE"
        mv "$TEMP_FILE" package.json
        echo "  Added esbuild to pnpm.onlyBuiltDependencies"
    else
        # Fallback: use sed to add the config
        if ! grep -q '"pnpm"' package.json; then
            # Add pnpm config before the last closing brace
            sed -i.bak 's/}$/,"pnpm":{"onlyBuiltDependencies":["esbuild"]}}/' package.json
            rm -f package.json.bak
            echo "  Added esbuild to pnpm.onlyBuiltDependencies (sed)"
        fi
    fi
fi

# =============================================================================
# Step 2: Install dependencies
# =============================================================================
echo ""
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
echo ""

# Runtime dependencies
echo "  Installing runtime dependencies..."
$INSTALL_CMD \
    react \
    react-dom \
    @radix-ui/react-dialog \
    @radix-ui/react-label \
    @radix-ui/react-select \
    @radix-ui/react-slot \
    class-variance-authority \
    clsx \
    tailwind-merge \
    lucide-react \
    framer-motion

# Dev dependencies
echo ""
echo "  Installing dev dependencies..."
$DEV_INSTALL_CMD \
    vite \
    @vitejs/plugin-react \
    tailwindcss \
    @tailwindcss/vite \
    typescript \
    @types/react \
    @types/react-dom

echo ""
echo -e "${GREEN}  Dependencies installed successfully!${NC}"

# =============================================================================
# Step 3: Copy template files
# =============================================================================
echo ""
echo -e "${YELLOW}Step 3: Setting up project files...${NC}"

TEMPLATES_DIR="$SCRIPT_DIR/templates"

# Copy vite.config.ts if not exists
if [ ! -f "vite.config.ts" ]; then
    echo "  Creating vite.config.ts (with React dedupe fix)..."
    cp "$TEMPLATES_DIR/vite.config.ts" ./vite.config.ts
else
    echo "  vite.config.ts exists, skipping..."
fi

# Copy tsconfig.json if not exists
if [ ! -f "tsconfig.json" ]; then
    echo "  Creating tsconfig.json..."
    cp "$TEMPLATES_DIR/tsconfig.json" ./tsconfig.json
else
    echo "  tsconfig.json exists, skipping..."
fi

# Copy index.html if not exists
if [ ! -f "index.html" ]; then
    echo "  Creating index.html..."
    cp "$TEMPLATES_DIR/index.html" ./index.html
else
    echo "  index.html exists, skipping..."
fi

# Create src directory and files
mkdir -p src

if [ ! -f "src/main.tsx" ]; then
    echo "  Creating src/main.tsx..."
    cp "$TEMPLATES_DIR/src/main.tsx" ./src/main.tsx
else
    echo "  src/main.tsx exists, skipping..."
fi

if [ ! -f "src/App.tsx" ]; then
    echo "  Creating src/App.tsx..."
    cp "$TEMPLATES_DIR/src/App.tsx" ./src/App.tsx
else
    echo "  src/App.tsx exists, skipping..."
fi

if [ ! -f "src/index.css" ]; then
    echo "  Creating src/index.css..."
    cp "$TEMPLATES_DIR/src/index.css" ./src/index.css
else
    echo "  src/index.css exists, skipping..."
fi

echo ""
echo -e "${GREEN}  Project files created!${NC}"

# =============================================================================
# Step 4: Add scripts to package.json
# =============================================================================
echo ""
echo -e "${YELLOW}Step 4: Updating package.json scripts...${NC}"

# Check if jq is available for JSON manipulation
if command -v jq &> /dev/null; then
    # Use jq to add scripts
    TEMP_FILE=$(mktemp)
    jq '.scripts.dev = "vite" | .scripts.build = "vite build" | .scripts.preview = "vite preview"' package.json > "$TEMP_FILE"
    mv "$TEMP_FILE" package.json
    echo "  Scripts added to package.json"
else
    echo "  Note: Install 'jq' for automatic script updates, or manually add:"
    echo '    "scripts": {'
    echo '      "dev": "vite",'
    echo '      "build": "vite build",'
    echo '      "preview": "vite preview"'
    echo '    }'
fi

# =============================================================================
# Step 5: Clear any cached dependencies
# =============================================================================
echo ""
echo -e "${YELLOW}Step 5: Clearing dependency cache...${NC}"
rm -rf node_modules/.vite 2>/dev/null || true
echo "  Cache cleared!"

# =============================================================================
# Complete!
# =============================================================================
echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "To start the dev server, run:"
echo ""
echo -e "  ${BLUE}cd $(pwd)${NC}"
echo -e "  ${BLUE}$PKG_MANAGER run dev${NC}"
echo ""
echo -e "Then open ${BLUE}http://localhost:5173${NC} in your browser."
echo ""
echo -e "${YELLOW}Troubleshooting:${NC}"
echo "  - If you see 'Invalid hook call' errors, ensure vite.config.ts has React dedupe"
echo "  - Check LESSONS-LEARNED.md for common issues and solutions"
echo ""

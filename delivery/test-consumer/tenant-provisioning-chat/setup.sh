#!/bin/bash

# =============================================================================
# TenantProvisioningChat Setup Script
# =============================================================================
# This script helps you set up the TenantProvisioningChat component in your
# React/Next.js project.
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# =============================================================================

set -e

echo "================================================"
echo "  TenantProvisioningChat Setup"
echo "================================================"
echo ""

# Check if npm or yarn is available
if command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
    INSTALL_CMD="yarn add"
elif command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm add"
else
    echo "Error: No package manager found (npm, yarn, or pnpm required)"
    exit 1
fi

echo "Using package manager: $PKG_MANAGER"
echo ""

# =============================================================================
# Step 1: Install peer dependencies
# =============================================================================
echo "Step 1: Installing peer dependencies..."
echo ""

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

echo ""
echo "Peer dependencies installed successfully."
echo ""

# =============================================================================
# Step 2: Install dev dependencies (if needed)
# =============================================================================
echo "Step 2: Installing dev dependencies..."
echo ""

if [ "$PKG_MANAGER" = "npm" ]; then
    npm install --save-dev tailwindcss @tailwindcss/postcss postcss
elif [ "$PKG_MANAGER" = "yarn" ]; then
    yarn add --dev tailwindcss @tailwindcss/postcss postcss
else
    pnpm add --save-dev tailwindcss @tailwindcss/postcss postcss
fi

echo ""
echo "Dev dependencies installed successfully."
echo ""

# =============================================================================
# Step 3: Setup instructions
# =============================================================================
echo "================================================"
echo "  Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Copy the component files to your project:"
echo "   cp -r ./* your-project/src/components/tenant-provisioning-chat/"
echo ""
echo "2. Import the tokens in your main CSS file:"
echo "   @import './components/tenant-provisioning-chat/tokens.css';"
echo ""
echo "3. Import and use the component:"
echo "   import { TenantProvisioningChat } from './components/tenant-provisioning-chat';"
echo ""
echo "4. If using Next.js/Vercel font optimization, load Fixel font:"
echo "   import localFont from 'next/font/local';"
echo "   const fixel = localFont({ src: './fonts/Fixel-Variable.woff2' });"
echo ""
echo "See README.md for detailed usage instructions."
echo ""

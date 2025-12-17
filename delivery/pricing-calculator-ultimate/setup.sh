#!/bin/bash
# Pricing Calculator - Zero-config setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="${1:-pricing-demo}"

# Detect package manager
if command -v pnpm &> /dev/null; then
    PM="pnpm"
    PMX="pnpm dlx"
elif command -v yarn &> /dev/null; then
    PM="yarn"
    PMX="yarn dlx"
else
    PM="npm"
    PMX="npx"
fi

echo "🚀 Creating $PROJECT with $PM..."

# Create Vite project
$PMX create-vite@latest "$PROJECT" --template react-ts 2>/dev/null || \
$PMX create-vite "$PROJECT" --template react-ts

cd "$PROJECT"

# CRITICAL: Configure pnpm BEFORE install (v8+ blocks esbuild)
if [ "$PM" = "pnpm" ]; then
    echo "  Configuring pnpm for esbuild..."
    if command -v jq &> /dev/null; then
        jq '. + {"pnpm": {"onlyBuiltDependencies": ["esbuild"]}}' package.json > tmp.json && mv tmp.json package.json
    else
        # Fallback: append before final }
        sed -i.bak 's/}$/,"pnpm":{"onlyBuiltDependencies":["esbuild"]}}/' package.json
        rm -f package.json.bak
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
$PM install

DEPS="tailwindcss @tailwindcss/vite @radix-ui/react-label @radix-ui/react-select \
@radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-tooltip \
class-variance-authority clsx tailwind-merge lucide-react"

if [ "$PM" = "pnpm" ]; then
    pnpm add $DEPS
elif [ "$PM" = "yarn" ]; then
    yarn add $DEPS
else
    npm install $DEPS
fi

# Copy component
echo "📋 Setting up component..."
mkdir -p src/pricing-calculator-ultimate
cp -r "$SCRIPT_DIR"/PricingCalculator.tsx "$SCRIPT_DIR"/tokens.css \
      "$SCRIPT_DIR"/lib "$SCRIPT_DIR"/ui src/pricing-calculator-ultimate/

# Configure Vite
cat > vite.config.ts << 'VITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
VITE

# Setup CSS
cat > src/index.css << 'CSS'
@import "tailwindcss";
@import "./pricing-calculator-ultimate/tokens.css";

body { margin: 0; min-height: 100vh; }
#root { min-height: 100vh; }
CSS

# Setup App
cat > src/App.tsx << 'APP'
import { PricingCalculator } from './pricing-calculator-ultimate/PricingCalculator'

export default function App() {
  return (
    <div className="min-h-screen bg-page p-8">
      <div className="max-w-6xl mx-auto">
        <PricingCalculator
          commissionPercentage={15}
          onGenerateQuote={(_, b) => alert(`Total: $${b.total.toLocaleString()}/yr`)}
        />
      </div>
    </div>
  )
}
APP

rm -f src/App.css

echo ""
echo "✅ Done! Run:"
echo "   cd $PROJECT && $PM run dev"

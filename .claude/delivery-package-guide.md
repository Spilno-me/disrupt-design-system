# DDS Component Delivery Package Guide

**Purpose:** How to extract and package standalone DDS components for external delivery.

---

## Quick Reference

```bash
# Create delivery package
1. Extract component + dependencies to delivery/[package-name]/
2. Create tokens.css with @theme block (CRITICAL)
3. Add setup.sh script (with pnpm/yarn/npm support)
4. Run token audit: grep -rh "muted-foreground\|popover\|destructive" ui/
5. Test with fresh project simulation (test ALL package managers)
6. zip -r [package-name].zip [package-name] -x "*.DS_Store"
```

## Decision Tree: What Does Your Component Need?

| Component Uses | Required in Package |
|----------------|---------------------|
| Basic UI (Button, Input, Card) | Standard setup.sh |
| framer-motion | `templates/` folder with React dedupe vite.config |
| shadcn tokens | Token compatibility layer OR rewrite components |
| Icons as props | Use `LucideIcon` type, not `React.ElementType` |

---

## Critical Requirement: Tailwind v4 `@theme` Block

**The #1 mistake:** Copying CSS variables without the `@theme` block.

### Wrong (Tailwind v3 style - BROKEN)
```css
:root {
  --color-primary: #2D3142;
  --color-page: #FBFBF3;
}
```
This creates CSS variables but **Tailwind won't generate utility classes**.

### Correct (Tailwind v4)
```css
@theme {
  --color-primary: #2D3142;
  --color-page: #FBFBF3;
  --color-surface: #FFFFFF;
  /* ... all colors that components use */
}
```
This tells Tailwind to generate `bg-primary`, `text-page`, `bg-surface`, etc.

### Why This Matters
- Components use classes like `bg-page`, `text-primary`, `border-subtle`
- Without `@theme`, these classes don't exist → components render unstyled
- Consumer sees broken layout with no colors

---

## Package Structure

```
[package-name]/
├── setup.sh                 # Zero-config setup script
├── [MainComponent].tsx      # Main exported component
├── tokens.css               # Design tokens WITH @theme block
├── README.md                # Usage documentation
├── dependencies.md          # Dependency reference
├── example-usage.tsx        # Code example
├── lib/
│   └── utils.ts             # cn() utility (required)
└── ui/                      # Extracted UI components
    ├── button.tsx
    ├── input.tsx
    └── [other deps].tsx
```

---

## Setup Script Template

```bash
#!/bin/bash
# [Package Name] - Zero-config setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="${1:-[default-project-name]}"

# Detect package manager
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm add"
    DEV_INSTALL_CMD="pnpm add -D"
elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
    INSTALL_CMD="yarn add"
    DEV_INSTALL_CMD="yarn add -D"
else
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
    DEV_INSTALL_CMD="npm install --save-dev"
fi

echo "🚀 Creating $PROJECT with $PKG_MANAGER..."

# Initialize project
mkdir -p "$PROJECT" && cd "$PROJECT"
$PKG_MANAGER init -y 2>/dev/null || npm init -y

# CRITICAL: Configure pnpm BEFORE installing (pnpm v8+ blocks esbuild)
if [ "$PKG_MANAGER" = "pnpm" ]; then
    if command -v jq &> /dev/null; then
        jq '.pnpm.onlyBuiltDependencies = ["esbuild"]' package.json > tmp.json && mv tmp.json package.json
    else
        # sed fallback
        sed -i.bak 's/}$/,"pnpm":{"onlyBuiltDependencies":["esbuild"]}}/' package.json && rm -f package.json.bak
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
$INSTALL_CMD tailwindcss @tailwindcss/vite \
  [list all @radix-ui/* packages] \
  class-variance-authority clsx tailwind-merge lucide-react

# Copy component
echo "📋 Setting up component..."
mkdir -p src/[package-name]
cp -r "$SCRIPT_DIR"/[MainComponent].tsx "$SCRIPT_DIR"/tokens.css \
      "$SCRIPT_DIR"/lib "$SCRIPT_DIR"/ui src/[package-name]/

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
@import "./[package-name]/tokens.css";

body { margin: 0; min-height: 100vh; }
#root { min-height: 100vh; }
CSS

# Setup App.tsx
cat > src/App.tsx << 'APP'
import { [MainComponent] } from './[package-name]/[MainComponent]'

export default function App() {
  return (
    <div className="min-h-screen bg-page p-8">
      <[MainComponent] />
    </div>
  )
}
APP

rm -f src/App.css

echo ""
echo "✅ Done! Run:"
echo "   cd $PROJECT && npm run dev"
```

**Important:** Make executable with `chmod +x setup.sh`

---

## tokens.css Template

```css
/**
 * [Package Name] - Design Tokens
 * Compatible with Tailwind CSS v4
 */

/* ============================================================ */
/* TAILWIND V4 THEME - Maps colors to utility classes           */
/* CRITICAL: Without this, bg-*, text-*, border-* won't work!   */
/* ============================================================ */

@theme {
  /* Fonts */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  /* --- SEMANTIC TEXT COLORS --- */
  --color-primary: #2D3142;
  --color-secondary: #5E4F7E;
  --color-muted: #5E4F7E;
  --color-inverse: #FFFFFF;

  /* --- BACKGROUND COLORS --- */
  --color-surface: #FFFFFF;
  --color-page: #FBFBF3;
  --color-muted-bg: #EFEDF3;
  --color-inverse-bg: #2D3142;
  --color-accent-bg: #E6F7FA;
  --color-accent-strong: #08A4BD;

  /* --- BORDER COLORS --- */
  --color-default: #CBD5E1;
  --color-subtle: #D1D3D7;
  --color-strong: #757B87;
  --color-accent: #08A4BD;
  --color-border: #CBD5E1;

  /* --- STATUS COLORS --- */
  --color-error: #F70D1A;
  --color-success: #22C55E;
  --color-warning: #EAB308;

  /* --- SHADCN/RADIX COMPATIBILITY --- */
  --color-background: #FFFFFF;
  --color-foreground: #2D3142;
  --color-card: #FFFFFF;
  --color-card-foreground: #2D3142;
  --color-popover: #FFFFFF;
  --color-popover-foreground: #2D3142;
  --color-ring: #08A4BD;

  /* --- BORDER RADIUS --- */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* --- SHADOWS --- */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ============================================================ */
/* ROOT CSS VARIABLES - For direct var() access                 */
/* ============================================================ */

:root {
  --radius: 0.625rem;
  --background: #FFFFFF;
  --foreground: #2D3142;
  --border: #CBD5E1;
  --ring: #08A4BD;
  /* Add other vars components use directly */
}

/* ============================================================ */
/* SAFELIST UTILITIES - For dynamic CVA classes                 */
/* ============================================================ */

@layer utilities {
  .bg-inverse-bg { background-color: #2D3142; }
  .bg-muted-bg { background-color: #EFEDF3; }
  .bg-accent-strong { background-color: #08A4BD; }
  .text-inverse { color: #FFFFFF; }
  .text-accent { color: #08A4BD; }

  .hover\:bg-accent-strong\/90:hover {
    background-color: rgba(8, 164, 189, 0.9);
  }
}

@layer base {
  * { border-color: var(--border); }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

---

## Dependency Identification

### How to Find Required Dependencies

1. **Scan imports in main component:**
   ```bash
   grep -h "from '@radix-ui" src/components/[Component].tsx | sort -u
   grep -h "from 'lucide-react" src/components/[Component].tsx
   ```

2. **Check UI component imports:**
   ```bash
   grep -rh "from '@radix-ui" src/components/ui/*.tsx | sort -u
   ```

3. **Standard dependencies (always include):**
   - `tailwindcss` + `@tailwindcss/vite`
   - `class-variance-authority`
   - `clsx`
   - `tailwind-merge`
   - `lucide-react`

4. **Per-component Radix deps:**
   | UI Component | Radix Package |
   |--------------|---------------|
   | Button | `@radix-ui/react-slot` |
   | Select | `@radix-ui/react-select` |
   | Slider | `@radix-ui/react-slider` |
   | Tooltip | `@radix-ui/react-tooltip` |
   | Dialog | `@radix-ui/react-dialog` |
   | Label | `@radix-ui/react-label` |

---

## Testing Checklist

### Before Packaging
- [ ] All `@theme` colors that components use are defined
- [ ] `@layer utilities` includes dynamic hover/focus classes
- [ ] `lib/utils.ts` with `cn()` function included
- [ ] All UI component dependencies extracted
- [ ] setup.sh is executable (`chmod +x`)
- [ ] setup.sh handles pnpm `onlyBuiltDependencies` BEFORE install
- [ ] setup.sh tested with npm, yarn, AND pnpm

### Consumer Simulation Test
```bash
# Create fresh test environment
mkdir /tmp/consumer-test && cd /tmp/consumer-test

# Copy and extract
cp /path/to/package.zip .
unzip package.zip
cd [package-name]

# Run setup
./setup.sh

# Start and verify
npm run dev  # or pnpm/yarn run dev
# Open browser - verify styling matches Storybook
```

### Multi-Package-Manager Test (IMPORTANT)
```bash
# Test with npm
rm -rf /tmp/test-npm && mkdir /tmp/test-npm && cd /tmp/test-npm
unzip /path/to/package.zip && cd [package-name]
PATH="/usr/local/bin:$PATH" npm_config_user_agent="npm" ./setup.sh

# Test with pnpm (most strict)
rm -rf /tmp/test-pnpm && mkdir /tmp/test-pnpm && cd /tmp/test-pnpm
unzip /path/to/package.zip && cd [package-name]
./setup.sh
pnpm run dev  # Verify no "esbuild binary not found" error

# Test with yarn
rm -rf /tmp/test-yarn && mkdir /tmp/test-yarn && cd /tmp/test-yarn
unzip /path/to/package.zip && cd [package-name]
PATH_WITHOUT_PNPM="..." ./setup.sh  # Ensure yarn is detected
```

### What to Check in Browser
- [ ] Background colors render (not white/transparent)
- [ ] Text colors visible (not black default)
- [ ] Buttons have correct variants
- [ ] Border colors appear
- [ ] Interactive states work (hover, focus)

---

## Common Pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| No colors, unstyled | Missing `@theme` block | Add all colors inside `@theme { }` |
| Default Vite page shows | App.tsx not replaced | Check setup.sh `cat > src/App.tsx` |
| "Module not found" | Missing UI component | Extract all imported ui/* files |
| Hover states broken | Dynamic classes purged | Add to `@layer utilities` safelist |
| Setup script prompts | npm create needs flags | Use `--yes` flag |
| **"Invalid hook call"** | Multiple React copies (framer-motion) | Add `resolve.dedupe` to vite.config |
| **shadcn tokens missing** | Components use shadcn tokens | Add compatibility tokens or rewrite |
| **Import path errors** | Wrong relative paths | Fix `../../lib` → `../lib` |
| **pnpm "Ignored build scripts"** | pnpm blocks esbuild postinstall | Add `pnpm.onlyBuiltDependencies` BEFORE install |
| **"esbuild binary not found"** | pnpm blocked esbuild download | See pnpm section below |
| **Icon props typed as `never`** | `React.ElementType` loses Lucide types | Use `LucideIcon` from lucide-react |

---

## CRITICAL: React Dedupe for Framer-Motion (NEW)

**If your component uses `framer-motion`, the consumer WILL get this error:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
Cannot read properties of null (reading 'useContext')
```

**Cause:** framer-motion bundles its own React, causing multiple React copies.

**REQUIRED vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'framer-motion'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
```

**Always include a `/templates` folder with this pre-configured vite.config.ts!**

---

## CRITICAL: pnpm Build Script Permissions (NEW)

**If consumer uses pnpm v8+, they WILL see this warning:**
```
╭ Warning ─────────────────────────────────────────────────────────────────────╮
│   Ignored build scripts: esbuild.                                            │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
╰──────────────────────────────────────────────────────────────────────────────╯
```

**Then when starting dev server:**
```
Error: esbuild binary not found
```

**Cause:** pnpm v8+ blocks postinstall scripts by default for security. `esbuild` (Vite's bundler) needs to run a postinstall to download its platform-specific binary.

**Problem:** `pnpm approve-builds` is **interactive** (requires manual selection), breaking automated setup scripts.

**Solution:** Add `pnpm.onlyBuiltDependencies` to `package.json` **BEFORE** `pnpm install`:

```json
{
  "name": "my-project",
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

**REQUIRED in setup.sh:**
```bash
# =============================================================================
# Configure pnpm to allow esbuild builds (CRITICAL for pnpm users)
# =============================================================================
if [ "$PKG_MANAGER" = "pnpm" ]; then
    echo "  Configuring pnpm build permissions..."
    if command -v jq &> /dev/null; then
        TEMP_FILE=$(mktemp)
        jq '.pnpm.onlyBuiltDependencies = ["esbuild"]' package.json > "$TEMP_FILE" 2>/dev/null || \
        jq '. + {"pnpm": {"onlyBuiltDependencies": ["esbuild"]}}' package.json > "$TEMP_FILE"
        mv "$TEMP_FILE" package.json
    else
        # Fallback without jq
        if ! grep -q '"pnpm"' package.json; then
            sed -i.bak 's/}$/,\n  "pnpm": {\n    "onlyBuiltDependencies": ["esbuild"]\n  }\n}/' package.json
            rm -f package.json.bak
        fi
    fi
fi
```

**Key Points:**
- This MUST happen BEFORE `pnpm install`
- npm and yarn don't have this issue (only pnpm)
- Always test setup scripts with pnpm specifically
- The `jq` command is preferred but provide sed fallback

---

## CRITICAL: Token Extraction from UI Components (NEW)

**Problem:** UI components copied from shadcn/ui use DIFFERENT tokens than DDS.

### shadcn vs DDS Token Mapping

| shadcn Token | DDS Equivalent | Used In |
|--------------|----------------|---------|
| `border-input` | `border-default` | Select, Input |
| `text-muted-foreground` | `text-tertiary` / `text-muted` | Select, Input |
| `bg-popover` | `bg-surface` | Select dropdown |
| `text-popover-foreground` | `text-primary` | Select dropdown |
| `focus:ring-ring` | `focus:ring-accent` | Input, Select |
| `destructive` | `error` | Button, Input |
| `h-input` | `h-10` (explicit) | Select, Input |

### Solutions (choose one):

**Option A: Add shadcn compatibility tokens (quick fix)**
```css
@theme {
  /* ... DDS tokens ... */

  /* SHADCN COMPATIBILITY */
  --color-input: var(--color-slate-200);
  --color-muted-foreground: var(--color-slate-500);
  --color-popover: var(--color-white);
  --color-popover-foreground: var(--color-abyss-500);
  --color-destructive: var(--color-error);
  --spacing-input: 2.5rem;
}
```

**Option B: Rewrite UI components with DDS tokens (recommended)**
- Replace `border-input` → `border-default`
- Replace `text-muted-foreground` → `text-tertiary`
- Replace `bg-popover` → `bg-surface`
- Etc.

### Token Audit Before Packaging

**Always run this check:**
```bash
# Find non-DDS tokens in UI components
grep -rh "muted-foreground\|popover\|destructive\|border-input\|ring-ring" ui/
```

---

## CRITICAL: Lucide Icon Typing (NEW)

**Problem:** Using `React.ElementType` for Lucide icons causes TypeScript errors.

**Symptom:**
```
Type 'string' is not assignable to type 'never'.
  <Icon className="w-5 h-5" />
        ~~~~~~~~~
```

**Cause:** `React.ElementType` is too generic and loses Lucide's prop types.

**Solution:**
```typescript
// ❌ Wrong - loses prop types
import { Shield } from 'lucide-react'
interface Feature {
  icon: React.ElementType  // className becomes 'never'
}

// ✅ Correct - preserves prop types
import { Shield, type LucideIcon } from 'lucide-react'
interface Feature {
  icon: LucideIcon  // className, strokeWidth, size typed correctly
}
```

**Key Points:**
- Always use `LucideIcon` type for icon props in interfaces
- Import as `type LucideIcon` to avoid runtime overhead
- This affects any component that passes icons as props

---

## Recommended Package Structure (Updated)

```
[package-name]/
├── setup.sh                     # One-click setup (ENHANCED)
├── [MainComponent].tsx          # Main component
├── tokens.css                   # Design tokens
├── README.md                    # Usage + troubleshooting
├── LESSONS-LEARNED.md           # Known issues (NEW)
├── example-usage.tsx            # Code examples
├── lib/
│   └── utils.ts                 # cn() utility
├── ui/                          # UI sub-components (TOKEN-AUDITED)
│   └── *.tsx
└── templates/                   # Project scaffolding (NEW - CRITICAL)
    ├── vite.config.ts           # WITH React dedupe!
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        └── index.css
```

---

## Extracting from DDS

### Step-by-Step Process

1. **Identify main component location:**
   ```
   src/components/[ComponentName].tsx
   ```

2. **Find UI dependencies:**
   ```bash
   grep "from './ui" src/components/[ComponentName].tsx
   grep "from '../ui" src/components/[ComponentName].tsx
   ```

3. **Copy to delivery folder:**
   ```bash
   mkdir -p delivery/[package-name]/{ui,lib}
   cp src/components/[Component].tsx delivery/[package-name]/
   cp src/components/ui/{dep1,dep2}.tsx delivery/[package-name]/ui/
   cp src/lib/utils.ts delivery/[package-name]/lib/
   ```

4. **Fix import paths in copied files:**
   - `from '@/components/ui/button'` → `from './ui/button'`
   - `from '@/lib/utils'` → `from './lib/utils'`

5. **Create tokens.css from src/styles.css:**
   - Copy `@theme { }` block
   - Copy relevant `:root` vars
   - Copy `@layer utilities` safelist
   - Copy `@layer base` rules

6. **Write setup.sh, README.md, dependencies.md**

7. **Test with consumer simulation**

8. **Package:**
   ```bash
   zip -r [package-name].zip [package-name] -x "*.DS_Store"
   ```

---

## Reference: DDS Source Locations

| Asset | Location |
|-------|----------|
| Main styles + @theme | `src/styles.css` |
| UI components | `src/components/ui/` |
| Composite components | `src/components/` |
| Utils (cn function) | `src/lib/utils.ts` |
| Design tokens (generated) | `src/styles/tokens.css` |

---

*Last updated: 2025-12-17*
*Based on: PricingCalculator & TenantProvisioningChat delivery package learnings*
*Added: pnpm v8+ onlyBuiltDependencies requirement for esbuild*
*Added: LucideIcon typing for icon props*

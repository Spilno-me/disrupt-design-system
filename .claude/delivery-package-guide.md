# Component Delivery Package

## Quick Steps

```bash
1. Extract to delivery/[package-name]/
2. Create tokens.css with @theme block
3. Add setup.sh (pnpm/yarn/npm)
4. Audit: grep -rh "muted-foreground\|popover\|destructive" ui/
5. Test all package managers
6. zip -r [package-name].zip [package-name] -x "*.DS_Store"
```

## Decision Table

| Component Uses | Required |
|----------------|----------|
| Basic UI | Standard setup.sh |
| framer-motion | `templates/` with React dedupe vite.config |
| shadcn tokens | Compatibility layer OR rewrite |
| Icons as props | `LucideIcon` type, not `React.ElementType` |

## Package Structure

```
[package-name]/
├── setup.sh
├── [MainComponent].tsx
├── tokens.css          # WITH @theme block
├── README.md
├── example-usage.tsx
├── lib/utils.ts        # cn()
├── ui/*.tsx
└── templates/          # If framer-motion
    └── vite.config.ts
```

## tokens.css (CRITICAL)

```css
// ❌ BROKEN - no utility classes generated
:root { --color-primary: #2D3142; }

// ✅ CORRECT - generates bg-primary, text-primary
@theme { --color-primary: #2D3142; }
```

**Minimum @theme:**
```css
@theme {
  --font-sans: system-ui, sans-serif;
  --color-primary: #2D3142;
  --color-secondary: #5E4F7E;
  --color-surface: #FFFFFF;
  --color-page: #FBFBF3;
  --color-muted-bg: #EFEDF3;
  --color-accent-strong: #08A4BD;
  --color-default: #CBD5E1;
  --color-error: #F70D1A;
  --color-success: #22C55E;
  --radius-sm: 8px;
  --radius-md: 12px;
}

@layer utilities {
  .bg-muted-bg { background-color: #EFEDF3; }
  .bg-accent-strong { background-color: #08A4BD; }
  .text-inverse { color: #FFFFFF; }
}
```

## setup.sh Template

```bash
#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="${1:-my-project}"

# Detect package manager
if command -v pnpm &> /dev/null; then
    PKG="pnpm"; INSTALL="pnpm add"
elif command -v yarn &> /dev/null; then
    PKG="yarn"; INSTALL="yarn add"
else
    PKG="npm"; INSTALL="npm install"
fi

mkdir -p "$PROJECT" && cd "$PROJECT"
$PKG init -y 2>/dev/null || npm init -y

# CRITICAL: pnpm esbuild fix BEFORE install
if [ "$PKG" = "pnpm" ]; then
    jq '.pnpm.onlyBuiltDependencies = ["esbuild"]' package.json > tmp.json && mv tmp.json package.json
fi

$INSTALL tailwindcss @tailwindcss/vite class-variance-authority clsx tailwind-merge lucide-react [radix-deps]

mkdir -p src/[package]
cp -r "$SCRIPT_DIR"/{*.tsx,tokens.css,lib,ui} src/[package]/

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
EOF

cat > src/index.css << 'EOF'
@import "tailwindcss";
@import "./[package]/tokens.css";
EOF

chmod +x setup.sh
```

## Dependency Lookup

**Find deps:**
```bash
grep -h "from '@radix-ui" src/components/[Component].tsx | sort -u
```

**Always include:**
`tailwindcss`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`

| UI Component | Radix Package |
|--------------|---------------|
| Button | `@radix-ui/react-slot` |
| Select | `@radix-ui/react-select` |
| Slider | `@radix-ui/react-slider` |
| Tooltip | `@radix-ui/react-tooltip` |
| Dialog | `@radix-ui/react-dialog` |
| Label | `@radix-ui/react-label` |

## Validation

| Check | Command/Action |
|-------|----------------|
| @theme colors defined | All component classes in `@theme {}` |
| Dynamic classes | Added to `@layer utilities` |
| cn() included | `lib/utils.ts` present |
| UI deps extracted | All `ui/*` imports copied |
| setup.sh executable | `chmod +x setup.sh` |
| pnpm esbuild | `onlyBuiltDependencies` BEFORE install |
| All pkg managers | Test npm, yarn, pnpm |

**Browser check:** Colors render | Text visible | Variants work | Hover states work

## Pitfalls

| Error | Fix |
|-------|-----|
| No colors/unstyled | Add `@theme {}` block |
| Default Vite page | Check `cat > src/App.tsx` |
| Module not found | Extract missing ui/* |
| Hover broken | Add to `@layer utilities` |
| "Invalid hook call" | Add `resolve.dedupe` for framer-motion |
| shadcn tokens missing | Add compatibility or rewrite |
| pnpm "esbuild not found" | `pnpm.onlyBuiltDependencies` before install |
| Icon typed as `never` | Use `LucideIcon` not `React.ElementType` |

## framer-motion vite.config

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
  optimizeDeps: { include: ['react', 'react-dom', 'framer-motion'] },
})
```

## shadcn Token Map

| shadcn | DDS |
|--------|-----|
| `border-input` | `border-default` |
| `text-muted-foreground` | `text-muted` |
| `bg-popover` | `bg-surface` |
| `text-popover-foreground` | `text-primary` |
| `focus:ring-ring` | `focus:ring-accent` |
| `destructive` | `error` |

**Audit:** `grep -rh "muted-foreground\|popover\|destructive\|border-input" ui/`

## Extraction Steps

```bash
# 1. Find deps
grep "from './ui" src/components/[Component].tsx

# 2. Copy
mkdir -p delivery/[pkg]/{ui,lib}
cp src/components/[Component].tsx delivery/[pkg]/
cp src/components/ui/{dep1,dep2}.tsx delivery/[pkg]/ui/
cp src/lib/utils.ts delivery/[pkg]/lib/

# 3. Fix paths
# @/components/ui/button → ./ui/button
# @/lib/utils → ./lib/utils

# 4. Create tokens.css from src/styles.css
# Copy @theme, :root, @layer utilities, @layer base

# 5. Package
zip -r [pkg].zip [pkg] -x "*.DS_Store"
```

## Source Locations

| Asset | Path |
|-------|------|
| Styles + @theme | `src/styles.css` |
| UI components | `src/components/ui/` |
| Composite | `src/components/` |
| Utils | `src/lib/utils.ts` |

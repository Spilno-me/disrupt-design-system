# Delivery Package Lessons Learned

## Issues Encountered During Consumer Testing

### 0. pnpm Build Script Permissions (CRITICAL - pnpm only)

**Symptom:**
```
╭ Warning ─────────────────────────────────────────────────────────────────────╮
│   Ignored build scripts: esbuild.                                            │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
╰──────────────────────────────────────────────────────────────────────────────╯
```

Then when running `pnpm run dev`:
```
Error: esbuild binary not found
```

**Cause:**
pnpm v8+ has a security feature that blocks postinstall scripts by default. `esbuild` (required by Vite) needs to run a postinstall script to download its platform-specific binary. Without this, Vite cannot start.

The `pnpm approve-builds` command is **interactive** (requires user input), making it unusable in automated setup scripts.

**Solution:**
Add `pnpm.onlyBuiltDependencies` to `package.json` **BEFORE** running `pnpm install`:

```json
{
  "name": "my-project",
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild"]
  }
}
```

**In setup.sh:**
```bash
if [ "$PKG_MANAGER" = "pnpm" ]; then
    # Add BEFORE pnpm install
    jq '.pnpm.onlyBuiltDependencies = ["esbuild"]' package.json > tmp.json && mv tmp.json package.json
fi
```

**Prevention:**
- Always configure `pnpm.onlyBuiltDependencies` before installing deps
- Test setup scripts with pnpm specifically (npm/yarn don't have this issue)
- Document this in README troubleshooting section

---

### 1. React Multiple Copies Error (CRITICAL)

**Symptom:**
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
Cannot read properties of null (reading 'useContext')
```

**Cause:**
Framer-motion (and other packages) can bundle their own React copy, causing hook conflicts.

**Solution:**
Vite config must include React deduplication:

```typescript
// vite.config.ts
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

**Prevention:**
Always include vite.config.ts in delivery packages that use framer-motion.

---

### 2. Token Extraction Inconsistencies (HIGH)

**Symptom:**
Select dropdowns, inputs, and other UI components have broken/missing styles.

**Cause:**
UI components copied from shadcn/ui use their default tokens which differ from DDS semantic tokens:

| shadcn Token | DDS Equivalent |
|--------------|----------------|
| `border-input` | `border-default` |
| `text-muted-foreground` | `text-muted` or `text-tertiary` |
| `bg-popover` | `bg-surface` |
| `text-popover-foreground` | `text-primary` |
| `focus:ring-ring` | `focus:ring-accent` |
| `destructive` | `error` |
| `h-input` | `h-10` (explicit) |

**Solution:**
1. Either add shadcn compatibility tokens to tokens.css
2. Or rewrite component classes to use DDS semantic tokens (preferred)

**Prevention:**
- **ALWAYS audit UI components for non-DDS tokens before packaging**
- Create a token audit checklist
- Use grep to find shadcn tokens: `grep -r "muted-foreground\|popover\|destructive\|border-input" ui/`

---

### 3. Missing Project Scaffolding

**Symptom:**
Consumer has to manually create vite.config.ts, tsconfig.json, index.html, etc.

**Cause:**
Setup script only installed dependencies, didn't create project structure.

**Solution:**
Include complete project scaffolding in setup script or provide template files.

**Prevention:**
Always include a `/templates` folder with:
- vite.config.ts
- tsconfig.json
- index.html
- src/main.tsx (entry point)
- src/index.css (with token import)

---

### 4. Import Path Issues

**Symptom:**
```
Cannot find module '../../lib/utils'
```

**Cause:**
UI components were copied with their original import paths from the main project.

**Solution:**
Update all imports to use relative paths within the delivery package:
- `../../lib/utils` → `../lib/utils`

**Prevention:**
- Always verify import paths after copying files
- Use a script to auto-fix paths

---

## Token Extraction Best Practices

### DO:
1. **Audit all CSS classes** - Search for non-DDS tokens before packaging
2. **Test in isolation** - Always test the package in a fresh project
3. **Use semantic tokens** - Prefer `border-default` over `border-slate-200`
4. **Document token dependencies** - List all required tokens in README

### DON'T:
1. **Don't copy shadcn components verbatim** - They use different tokens
2. **Don't assume tokens exist** - Verify each token is in tokens.css
3. **Don't skip testing** - Consumer experience reveals issues

### Token Audit Checklist:
```bash
# Run in delivery package folder
grep -rh "class=" ui/ | grep -oE '[a-z]+-[a-z-]+' | sort | uniq > used-classes.txt
# Review for non-DDS tokens
```

---

## Recommended Delivery Package Structure

```
component-name/
├── ComponentName.tsx          # Main component
├── tokens.css                  # Design tokens (@theme block)
├── lib/
│   └── utils.ts               # Utilities (cn function)
├── ui/                        # UI sub-components
│   └── *.tsx
├── templates/                 # Project scaffolding
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       └── index.css
├── setup.sh                   # Automated setup
├── README.md                  # Documentation
├── LESSONS-LEARNED.md         # This file
└── example-usage.tsx          # Usage examples
```

---

### 5. Lucide Icon TypeScript Errors (MEDIUM)

**Symptom:**
```
Type 'string' is not assignable to type 'never'.
  <Icon className="w-5 h-5" />
        ~~~~~~~~~
```

**Cause:**
Using `React.ElementType` for Lucide icon props loses type information. The `className`, `strokeWidth`, `size` props resolve to `never`.

**Solution:**
Use the proper `LucideIcon` type from lucide-react:

```typescript
// ❌ Wrong - loses prop types
import { Shield } from 'lucide-react'
interface Feature {
  icon: React.ElementType  // className becomes 'never'
}

// ✅ Correct - preserves prop types
import { Shield, type LucideIcon } from 'lucide-react'
interface Feature {
  icon: LucideIcon  // className, strokeWidth, size all typed correctly
}
```

**Prevention:**
- Always use `LucideIcon` type for icon props in interfaces
- Import as `type LucideIcon` to avoid runtime overhead

---

## Future Improvements

1. **Automated token validation** - Script to verify all tokens exist
2. **Pre-packaged Vite config** - Include in every delivery
3. **Test harness** - Automated consumer testing before release
4. **Token migration tool** - Auto-convert shadcn → DDS tokens
5. **Multi-package-manager testing** - Test setup.sh with npm, yarn, AND pnpm
6. **pnpm workspace support** - Handle monorepo scenarios

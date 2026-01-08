# Create Delivery Package



**Category:** delivery | **Tags:** delivery, package, standalone
**Variables:** `{COMPONENT}`
**Read first:** `.claude/delivery-package-guide.md`

---

Create delivery package for {COMPONENT}.

READ FIRST: `.claude/delivery-package-guide.md`

Package Structure:
```
[package-name]/
├── setup.sh
├── [Component].tsx
├── tokens.css          # WITH @theme block
├── README.md
├── example-usage.tsx
├── lib/utils.ts        # cn()
└── ui/*.tsx            # dependencies
```

Steps:
1. Find deps: `grep "from './ui" src/components/{COMPONENT}.tsx`
2. Copy component + ui deps + lib/utils.ts
3. Fix import paths: `@/components/ui/x` → `./ui/x`
4. Create tokens.css with @theme block (CRITICAL)
5. Create setup.sh supporting npm/yarn/pnpm
6. Test all package managers

CRITICAL - tokens.css:
```css
// ❌ BROKEN - no utilities generated
:root { --color-primary: oklch(0.26 0.028 265); }

// ✅ CORRECT - generates bg-primary, text-primary
@theme { --color-primary: oklch(0.26 0.028 265); }
```

Validation:
- Colors render
- Hover states work
- All package managers work
- No missing imports

OUTPUT: Complete delivery package ready to zip.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*

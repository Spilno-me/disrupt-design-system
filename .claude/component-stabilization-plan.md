# Component Stabilization Plan

**Status:** Active
**Goal:** Stabilize components for v2.4.0 without breaking the production app
**Date:** 2025-12-13

---

## 🎯 Situation Overview

### Current State
- **Design system version:** 2.4.0 (pre-release, in active development)
- **Production status:** Components already used in app shown to investors
- **Quality level:** Built quickly for testing, not production-ready
- **Risk:** Changes could break the live app

### Challenge
1. Components need stabilization (better code quality, props, patterns)
2. App is already consuming these components (shown to investors)
3. Website uses same components and must remain stable
4. No breaking changes allowed until v3.0.0

---

## 📊 Component Categorization

### Category 1: Website-Only (FROZEN - Do Not Touch)
**Location:** `src/components/sections/`
**Status:** ✅ STABLE - Website is production-ready
**Rule:** NO CHANGES until website migration strategy is decided

**Components (32 total):**
- AIPlatformSection, AboutHeroSection, AboutProofSection
- ContactInfo, ContactSection, FeatureCard
- FeaturesGridSection, FutureCapabilitiesSection
- HeroSection, IndustryCarouselSection
- OurMissionSection, OurStorySection, OurValuesSection, OurVisionSection
- PartnersSection, PricingCardsSection, ProductHeroSection
- ProofSection, ReadyToAchieveSection, StrategicAdvisorySection
- WhatDisruptDoesSection, WhoWeHelpSection, WhyDifferentSection
- FAQSection, CTASection, FeaturesSection
- ROICalculatorSection
- Footer, PageLayout

**Heavy dependencies:**
- GridBlobCanvas (used in 10 sections)
- Button (all sections)
- Section layout components

---

### Category 2: App-Only (CAN STABILIZE CAREFULLY)
**Location:** `src/components/partners/`, `src/components/leads/`, `src/components/provisioning/`
**Status:** ⚠️ IN USE - Shown to investors but can evolve carefully
**Rule:** SAFE CHANGES ONLY (add optional props, fix bugs, improve internals)

**Components (40+ total):**

**Partners domain:**
- PartnersPage, EditPartnerDialog, DeletePartnerDialog
- PartnerLoginAccountsPage, ResetPasswordDialog
- CreateLoginAccountDialog, DeleteLoginAccountDialog
- HelpPage, PricingCalculator
- InvoicesPage, InvoiceCard, EditInvoiceDialog

**Leads domain:**
- LeadsPage, LeadCard, LeadsDataTable
- StatsCard, CreateLeadDialog, EditLeadDialog
- AssignLeadDialog, StatusUpdateDialog, DeleteLeadDialog

**Provisioning domain:**
- TenantProvisioningWizard, TenantProvisioningChat
- ProvisioningMethodSelector
- ApproveRequestDialog, RejectRequestDialog, DeleteTenantRequestDialog

**Stabilization allowed:**
- ✅ Add optional props with defaults
- ✅ Fix bugs (no API change)
- ✅ Improve internal code quality
- ✅ Add TypeScript improvements
- ✅ Improve accessibility
- ❌ Rename/remove props
- ❌ Change prop types (breaking)
- ❌ Change default values

---

### Category 3: Shared Primitives (STABILIZE WITH EXTREME CARE)
**Location:** `src/components/ui/`
**Status:** 🔥 CRITICAL - Used by BOTH website and app
**Rule:** ADD ONLY, NEVER CHANGE (until v3.0.0)

**High-risk components (used everywhere):**
- Button ⚠️ (website + app + all sections)
- GridBlobCanvas ⚠️ (10 website sections)
- Input, Textarea, Checkbox ⚠️ (all forms)
- Dialog, Sheet ⚠️ (all modals)
- Card ⚠️ (everywhere)
- DataTable ⚠️ (app pages)
- Select, Label, Form ⚠️ (all forms)

**Medium-risk components:**
- AppHeader, AppSidebar, AppFooter (app layout)
- Header, MobileMenu (website layout)
- Tooltip, Badge, Separator (utility)
- Accordion, Skeleton, Slider (UI)

**Stabilization rules:**
1. **NEVER change existing props** (rename, remove, change type)
2. **NEVER change default values**
3. **CAN add new optional props** (with safe defaults)
4. **CAN add new variants** (to existing variant lists)
5. **CAN fix bugs** (if no API surface change)
6. **CAN improve internals** (ref handling, accessibility)

---

## ✅ Safe Stabilization Patterns

### Pattern 1: Add Optional Props (SAFE)
```typescript
// BEFORE (v2.3.1)
interface ButtonProps {
  variant?: 'default' | 'outline'
  children: ReactNode
}

// AFTER (v2.4.0) - SAFE
interface ButtonProps {
  variant?: 'default' | 'outline'
  children: ReactNode
  loading?: boolean  // ✅ NEW optional prop with default false
  icon?: ReactNode   // ✅ NEW optional prop
  'aria-label'?: string  // ✅ Accessibility improvement
}
```

### Pattern 2: Add New Variants (SAFE)
```typescript
// BEFORE
const buttonVariants = cva({
  variants: {
    variant: {
      default: "...",
      outline: "...",
    }
  }
})

// AFTER - SAFE
const buttonVariants = cva({
  variants: {
    variant: {
      default: "...",
      outline: "...",
      accent: "...",    // ✅ NEW variant
      ghost: "...",     // ✅ NEW variant
    }
  }
})
```

### Pattern 3: Fix Bugs (SAFE)
```typescript
// BEFORE - Bug: ref not forwarded
const Button = ({ children, ...props }: ButtonProps) => {
  return <button {...props}>{children}</button>
}

// AFTER - SAFE
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>
  }
)
```

### Pattern 4: Improve Internals (SAFE)
```typescript
// BEFORE - No loading state handling
const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>
}

// AFTER - SAFE (internal improvement, same API)
const Button = ({ children, onClick, loading }: ButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (loading) return  // Prevent clicks while loading
    onClick?.(e)
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? <Spinner /> : children}
    </button>
  )
}
```

---

## ❌ Dangerous Patterns (BREAKING - Wait for v3.0.0)

### Anti-Pattern 1: Rename Props (BREAKING)
```typescript
// ❌ BREAKING CHANGE
// BEFORE: variant="default"
// AFTER:  colorScheme="primary"  // App will break!
```

### Anti-Pattern 2: Remove Props (BREAKING)
```typescript
// ❌ BREAKING CHANGE
interface ButtonProps {
  variant?: string
  // onPress?: () => void  // Removed - App will break if it uses this!
}
```

### Anti-Pattern 3: Change Prop Types (BREAKING)
```typescript
// ❌ BREAKING CHANGE
// BEFORE: size?: 'sm' | 'md' | 'lg'
// AFTER:  size?: number  // Type change breaks consumers!
```

### Anti-Pattern 4: Change Defaults (BREAKING)
```typescript
// ❌ BREAKING CHANGE
const buttonVariants = cva({
  defaultVariants: {
    // variant: "default",  // BEFORE
    variant: "accent",      // AFTER - Visual breaking change!
  }
})
```

---

## 📋 Component Review Checklist

Use this checklist when reviewing each component:

### Pre-Review
- [ ] Identify component category (Website-Only, App-Only, Shared)
- [ ] Check if component is exported in `src/index.ts`
- [ ] Search for usage in app codebase (if available)
- [ ] Review current props API

### Code Quality Review
- [ ] TypeScript types are correct and exported
- [ ] Component uses design tokens (no raw colors)
- [ ] Accessibility: ARIA labels, keyboard navigation, focus states
- [ ] Testing: Component type identified (ATOM/MOLECULE/PAGE), data-testid implemented correctly
- [ ] Variants: Minimal and functional (not aesthetic), follow reduction philosophy
- [ ] Props have JSDoc comments with component type and testId examples
- [ ] React display name added
- [ ] Component is properly documented (Storybook story exists)

### API Stability Review
- [ ] All changes are backwards compatible
- [ ] New props are optional with safe defaults
- [ ] No props renamed or removed
- [ ] No prop types changed (breaking)
- [ ] No default values changed
- [ ] Existing variants still work identically

### Internal Code Review
- [ ] Refs are properly forwarded
- [ ] Loading/disabled states handled correctly
- [ ] Error boundaries in place (if needed)
- [ ] No console.log or debug code
- [ ] No hardcoded strings (use constants)
- [ ] Clean code (no TODO comments for v2.x)

### Testing & Documentation
- [ ] Storybook story updated (if API changed)
- [ ] TypeScript compiles without errors
- [ ] Linting passes
- [ ] CHANGELOG.md updated
- [ ] Component registry updated (if new)

---

## 🚀 Stabilization Workflow

### Step 1: Choose Component
1. Select from **Category 2 (App-Only)** or **Category 3 (Shared)** lists
2. **NEVER** touch Category 1 (Website-Only) components
3. Start with low-risk components (single-purpose, few dependencies)

### Step 2: Review
1. Read component code thoroughly
2. Identify current API surface (all props, exports)
3. List potential improvements
4. Classify each change: SAFE vs BREAKING

### Step 3: Plan Changes
1. **Discard all BREAKING changes** (save for v3.0.0)
2. Keep only SAFE changes:
   - Add optional props
   - Fix bugs
   - Improve internals
   - Add new variants
3. Update CHANGELOG.md with planned changes

### Step 4: Implement
1. Make changes following safe patterns
2. Run typecheck: `npm run typecheck`
3. Run lint: `npm run lint`
4. Test in Storybook: `npm run storybook`

### Step 5: Verify
1. Check exports in `src/index.ts`
2. Verify backwards compatibility
3. Update component registry if needed
4. Commit with conventional format: `feat: stabilize Button component`

---

## 🎨 Website Component Isolation Strategy

### Current Problem
Website components (sections) share primitives (Button, Grid) with app components. Changes to primitives could break website.

### Solution Options

#### Option A: Version Lock (RECOMMENDED for v2.x)
**Status:** ✅ IMPLEMENT NOW
**Approach:** Freeze shared primitives until website migration

```
1. Mark Button, GridBlobCanvas, Card as FROZEN
2. Only add new optional props (backwards compatible)
3. NO changes to variants, styles, or behavior
4. Website remains stable
5. App can still use new optional features
```

**Pros:**
- ✅ Zero risk to website
- ✅ Simple to implement
- ✅ Clear communication

**Cons:**
- ⚠️ Slows primitive evolution
- ⚠️ May accumulate tech debt

---

#### Option B: Website Namespace (FUTURE - v3.0.0)
**Status:** 📅 PLAN FOR v3.0.0
**Approach:** Create separate `@dds/website` package

```
// Website imports from frozen package
import { Button, Grid } from '@dds/website'

// App imports from evolving package
import { Button, Grid } from '@dds/core'
```

**Pros:**
- ✅ Complete isolation
- ✅ Independent evolution
- ✅ Clear ownership

**Cons:**
- ⚠️ Requires monorepo setup
- ⚠️ Duplicate components
- ⚠️ Migration effort

---

#### Option C: Deprecated Namespace (FUTURE - v3.0.0)
**Status:** 📅 PLAN FOR v3.0.0
**Approach:** Keep old versions under `@dds/deprecated`

```typescript
// Website uses deprecated (frozen) versions
import { Button as ButtonV2 } from '@dds/deprecated'

// App uses latest
import { Button } from '@dds/core'
```

**Pros:**
- ✅ Clear separation
- ✅ Allows app evolution

**Cons:**
- ⚠️ Maintenance burden
- ⚠️ Confusing for users

---

### Recommendation for NOW (v2.x)

**Use Option A: Version Lock**

1. **Mark as FROZEN in docs:**
   - Button
   - GridBlobCanvas / BlobSection
   - Card
   - All section layout components

2. **Allowed changes:**
   - ✅ Add optional props (backwards compatible)
   - ✅ Fix critical bugs
   - ✅ Add new variants (don't change existing)

3. **Forbidden changes:**
   - ❌ Change styles of existing variants
   - ❌ Rename props
   - ❌ Change defaults
   - ❌ Remove features

4. **Document in CLAUDE.md:**
   ```markdown
   ## Frozen Components (Website Stability)
   These components power the production website and are FROZEN:
   - Button (all variants)
   - GridBlobCanvas
   - Card
   - Section layouts

   Changes: Add optional props only. NO style/behavior changes.
   ```

---

## 📊 Prioritized Review Order

### Phase 1: Low-Risk App Components (Start Here)
Safe to stabilize, low impact if issues arise:

1. ✅ StatsCard (simple display)
2. ✅ SeverityIndicator (utility)
3. ✅ ExecutingAnimation (animation utility)
4. ✅ Badge (small primitive)
5. ✅ Skeleton (loading state)

### Phase 2: Form Components
Used in dialogs, medium risk:

1. ⚠️ Input, Textarea, Checkbox (forms everywhere)
2. ⚠️ Label, Form components
3. ⚠️ Select (complex Radix wrapper)

### Phase 3: Layout Components
App-specific, can evolve:

1. ⚠️ AppHeader, AppSidebar, AppFooter
2. ⚠️ AppLayoutShell
3. ⚠️ MobileNav, BottomNav

### Phase 4: Complex Components
High risk, review last:

1. 🔥 DataTable (complex, many features)
2. 🔥 Dialog, Sheet (modals everywhere)
3. 🔥 SearchFilter (complex state)

### Phase 5: FROZEN (Do Not Review)
Website components - hands off:

1. ⛔ All section components
2. ⛔ Button (frozen for website)
3. ⛔ GridBlobCanvas (frozen for website)
4. ⛔ Footer, Header (website layout)

---

## 🎯 Success Criteria

### For v2.4.0 Release
- ✅ 20+ components reviewed and stabilized
- ✅ Zero breaking changes
- ✅ All HIGH priority components exported
- ✅ TypeScript strict mode enabled
- ✅ Storybook stories updated
- ✅ CHANGELOG.md complete

### Production Safety
- ✅ Website still works (no visual changes)
- ✅ App still works (backwards compatible)
- ✅ All exports work: `import { X } from '@dds'`
- ✅ TypeScript types correct

---

## 📝 Notes

### Remember
1. **NO BREAKING CHANGES** until v3.0.0
2. Website is FROZEN - do not touch
3. App components can evolve CAREFULLY
4. When in doubt, ADD don't CHANGE

### v3.0.0 Breaking Changes Backlog
Document breaking changes you WANT to make but can't yet:

```markdown
## Planned for v3.0.0
- Button: Rename `variant="default"` → `variant="primary"`
- DataTable: Simplify column definition API
- Dialog: Merge DialogHeader/Footer into DialogContent
- [Add your wishlist here]
```

---

**Last Updated:** 2025-12-13
**Status:** Active - Use this as the source of truth for stabilization work

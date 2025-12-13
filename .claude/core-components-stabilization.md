# Core Components Stabilization Plan

**Date:** 2025-12-13
**Focus:** UI Primitives (Atoms) Only
**Goal:** Stabilize foundational building blocks before domain-specific components

---

## 🎯 Scope: Core Components ONLY

**What are "Core Components"?**
- UI primitives in `src/components/ui/`
- Reusable atoms (building blocks)
- NOT domain-specific (Partners, Leads, Provisioning)
- NOT website sections (Hero, Features, Pricing)

**Why Core First?**
- Foundation for all other components
- Used everywhere (high impact)
- Stability ensures everything built on top is stable
- Domain components depend on these

---

## 📋 Core Components List (48 total)

### Category 1: Form Controls (11 components) - PRIORITY HIGH
**Why:** Used in every form, dialog, and page

1. ✅ **Badge** - STABILIZED
2. ⬜ **Button** - TODO
3. ⬜ **Input** - TODO
4. ⬜ **Textarea** - TODO
5. ⬜ **Checkbox** - TODO
6. ⬜ **Select** + sub-components (SelectTrigger, SelectContent, SelectItem, SelectValue) - TODO
7. ⬜ **Label** - TODO
8. ⬜ **Form** + sub-components (FormField, FormItem, FormLabel, FormControl, FormMessage) - TODO
9. ⬜ **Slider** - TODO

---

### Category 2: Overlays & Feedback (8 components) - PRIORITY HIGH
**Why:** Critical for user interactions

1. ⬜ **Dialog** + sub-components (DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter) - TODO
2. ⬜ **Sheet** + sub-components (SheetTrigger, SheetContent, SheetHeader, SheetTitle) - TODO
3. ⬜ **Tooltip** + sub-components (TooltipProvider, TooltipTrigger, TooltipContent) - TODO
4. ⬜ **ErrorBoundary** - TODO
5. ⬜ **ErrorState** - TODO

---

### Category 3: Layout & Structure (5 components) - PRIORITY MEDIUM
**Why:** Foundation for pages and sections

1. ⬜ **Card** + sub-components (CardHeader, CardTitle, CardDescription, CardContent, CardFooter) - TODO
2. ⬜ **Separator** - TODO
3. ⬜ **Accordion** - TODO
4. ⬜ **SectionWrapper**, **SectionHeading** - TODO

---

### Category 4: Data Display (5 components) - PRIORITY MEDIUM
**Why:** Complex but essential

1. ⬜ **DataTable** - TODO (Complex - do last)
2. ⬜ **Pagination** - TODO
3. ✅ **Skeleton** - STABILIZED (+ SkeletonImage, SkeletonText)
4. ✅ **SeverityIndicator** - STABILIZED

---

### Category 5: Utility Components (6 components) - PRIORITY LOW
**Why:** Simple, low risk

1. ⬜ **AnimatedLogo** - TODO
2. ⬜ **MadeWithLove** - TODO
3. ⬜ **FeatureCard** - TODO
4. ⬜ **CheckListItem** - TODO
5. ⬜ **BlurImage**, **OptimizedImage**, **ParallaxImage** - TODO
6. ⬜ **ScrollableTableWrapper** - TODO

---

### Category 6: Navigation Components (7 components) - PRIORITY LOW
**Why:** App-specific, can stabilize after core primitives

1. ⬜ **AppHeader** - TODO (Complex)
2. ⬜ **AppSidebar** - TODO
3. ⬜ **AppFooter** - TODO
4. ⬜ **MobileNav** - TODO
5. ⬜ **BottomNav** - TODO
6. ⬜ **MobileMenu** - TODO
7. ⬜ **Header** - FROZEN (Website)

---

### ⛔ EXCLUDED (Not Core)

**Website Components (32 total) - FROZEN**
- All section components (HeroSection, FeaturesSection, etc.)
- Footer, PageLayout
- GridBlobCanvas (used by website)

**Domain Components (40+ total) - LATER**
- Partners domain (PartnersPage, dialogs, invoices, etc.)
- Leads domain (LeadsPage, LeadCard, dialogs, etc.)
- Provisioning domain (wizards, chat, dialogs)
- Auth domain (LoginPage, LoginForm, etc.)

**Reason:** These depend on core components. Stabilize foundation first.

---

## 🚀 Recommended Stabilization Order

### Phase 1: Critical Form Controls (Week 1)
**Must have for any app:**

1. ⛔ **Button** - SKIP (FROZEN - website dependency, brand color redesign needed for v3.0.0)
2. ⬜ **Input** (forms, filters, search)
3. ⬜ **Label** (accessibility)
4. ⬜ **Checkbox** (selections, forms)
5. ⬜ **Select** (dropdowns, filters)
6. ⬜ **Textarea** (moved from Phase 3 - essential form control)

**Estimated:** 1 week (5 components, Button skipped)

---

### Phase 2: Overlays (Week 2)
**Critical for interactions:**

1. ⬜ **Dialog** (modals, confirmations)
2. ⬜ **Sheet** (side panels, drawers)
3. ⬜ **Tooltip** (help text)

**Estimated:** 1 week

---

### Phase 3: Layout & Data (Week 3)
**Structure and information:**

1. ⬜ **Card** (containers everywhere)
2. ⬜ **Separator** (visual division)
3. ⬜ **Textarea** (long text input)
4. ⬜ **Form** components (form structure)

**Estimated:** 1 week

---

### Phase 4: Data Display (Week 4)
**Complex components:**

1. ⬜ **Pagination** (lists, tables)
2. ⬜ **Accordion** (expandable sections)
3. ⬜ **DataTable** (complex - do last)

**Estimated:** 1 week

---

### Phase 5: Utilities (Week 5)
**Nice to have:**

1. ⬜ **Image components** (BlurImage, OptimizedImage, ParallaxImage)
2. ⬜ **FeatureCard**, **CheckListItem**
3. ⬜ **AnimatedLogo**, **MadeWithLove**
4. ⬜ **ScrollableTableWrapper**

**Estimated:** 1 week

---

## ✅ Stabilization Checklist (Per Component)

### Pre-Stabilization
- [ ] Identify component type: ATOM | MOLECULE
- [ ] Check usage (grep for occurrences)
- [ ] Verify not in FROZEN website components
- [ ] Read existing component code

### Code Quality
- [ ] Extend props: `React.HTMLAttributes<HTMLElement>`
- [ ] Add props spread: `{...props}`
- [ ] Add display name: `Component.displayName = "Component"`
- [ ] Use design tokens only (ALIAS or semantic Tailwind)
- [ ] No raw hex colors
- [ ] No PRIMITIVES imports (unless documented exception)

### Testing (data-testid)
- [ ] Identify: ATOM or MOLECULE
- [ ] ATOM: Accepts data-testid via props spread
- [ ] MOLECULE: Auto-generates testId from props
- [ ] JSDoc includes component type (ATOM/MOLECULE)
- [ ] JSDoc includes testId examples

### Variant Reduction
- [ ] Audit all variants
- [ ] Count variants (>5 = too many)
- [ ] Categorize: Functional vs aesthetic
- [ ] Remove/deprecate aesthetic variants
- [ ] Keep only essential functional variants (≤5)
- [ ] Update Storybook (remove deprecated variant stories)

### Documentation
- [ ] JSDoc complete with examples
- [ ] Storybook story exists
- [ ] Storybook shows essential variants only
- [ ] Component exported from `src/index.ts`
- [ ] Types exported

### Verification
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint`
- [ ] Update CHANGELOG.md
- [ ] Create review document: `.claude/reviews/{component}-review.md`
- [ ] Mark as stabilized in tracking

---

## 📊 Progress Tracking

### ✅ Completed (3/48 core components)
1. **Badge** - ATOM, variants reviewed (7→5 recommended for v3.0.0)
2. **SeverityIndicator** - ATOM, token violation documented
3. **Skeleton** - ATOM, variant deprecated (3→1)

### 🔄 In Progress (0/48)
None

### ⬜ To Do (45/48)

**Priority HIGH (14):**
- Button, Input, Textarea, Checkbox, Select, Label, Form, Slider
- Dialog, Sheet, Tooltip
- ErrorBoundary, ErrorState
- Card

**Priority MEDIUM (10):**
- Separator, Accordion
- Pagination, DataTable
- Image components (3)
- FeatureCard, CheckListItem, ScrollableTableWrapper

**Priority LOW (21):**
- Navigation components (7)
- Utility components (14)

---

## 🎯 Focus Strategy

### Current Phase: Phase 1 (Critical Form Controls)

**Next 5 components to stabilize:**
1. ⬜ **Button** - Highest usage, everywhere
2. ⬜ **Input** - Forms, filters, search
3. ⬜ **Label** - Accessibility for forms
4. ⬜ **Checkbox** - Selections, forms
5. ⬜ **Select** - Dropdowns, filters

**After Phase 1 completes → Move to Phase 2 (Overlays)**

---

## ⛔ What We're NOT Stabilizing Now

### Domain-Specific Components (Later)
- Partners domain (40+ components)
- Leads domain (20+ components)
- Provisioning domain (10+ components)
- Auth domain (7 components)
- Forms domain (3 components)

**Reason:** Depend on core components. Stabilize foundation first.

---

### Website Components (Never - FROZEN)
- All 32 section components
- Footer, PageLayout, Header
- GridBlobCanvas

**Reason:** Production website is stable, DO NOT TOUCH.

---

## 📝 Notes

### Why Core Components Matter
1. **Foundation** - Everything else builds on these
2. **High usage** - Used in 100+ places
3. **Stability critical** - Breaking these breaks everything
4. **Standardization** - Set the pattern for all other components

### After Core Components Are Stable
1. Domain components will be easier (follow core patterns)
2. Consistent testId implementation
3. Consistent variant approach
4. Proven stabilization workflow

---

## 🔗 Related Documents

- **Overall Strategy:** `.claude/component-stabilization-plan.md`
- **testId Strategy:** `.claude/testing-quick-ref.md`
- **Variant Philosophy:** `.claude/variant-reduction-strategy.md`
- **v3.0.0 Tracking:** `.claude/v3-breaking-changes.md`

---

**Last Updated:** 2025-12-13
**Status:** Active - Focus on core primitives only
**Next Component:** Button (Phase 1, Critical)

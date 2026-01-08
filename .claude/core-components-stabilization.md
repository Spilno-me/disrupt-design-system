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

---

## 🔧 Utility Systems (Infrastructure - NOT Core Components)

**What are these?**
- Infrastructure that helps compose core components
- NOT standalone UI primitives
- Provide context, validation, or composition helpers

1. **Form** + sub-components (FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription)
   - Status: ✅ Documentation complete with links to core atoms
   - Purpose: react-hook-form wrapper utilities
   - Note: The actual atoms are Input, Label, Checkbox (listed below in core components)
   - AllStates: Not needed - states are demonstrated in the wrapped atoms

---

### Category 1: Form Controls (10 components) - PRIORITY HIGH
**Why:** Used in every form, dialog, and page

1. ✅ **Badge** - STABILIZED
2. ✅ **Button** - STABILIZED (Clean Code A+)
3. ✅ **Input** - STABILIZED
4. ✅ **Textarea** - STABILIZED
5. ✅ **Checkbox** - STABILIZED
6. ✅ **Select** + sub-components (SelectTrigger, SelectContent, SelectItem, SelectValue) - STABILIZED
7. ✅ **Label** - STABILIZED
8. ✅ **Slider** - STABILIZED
9. ~~**Form**~~ - MOVED TO UTILITY SYSTEMS (infrastructure, not a UI component)

---

### Category 2: Overlays & Feedback (8 components) - PRIORITY HIGH
**Why:** Critical for user interactions

1. ✅ **Dialog** + sub-components (DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter) - STABILIZED
2. ✅ **Sheet** + sub-components (SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription, SheetClose) - STABILIZED
3. ✅ **Tooltip** + sub-components (TooltipProvider, TooltipTrigger, TooltipContent) - STABILIZED
4. ✅ **ErrorBoundary** + variants (CanvasErrorBoundary, SectionErrorBoundary) - STABILIZED
5. ✅ **ErrorState** - STABILIZED

---

### Category 3: Layout & Structure (5 components) - PRIORITY MEDIUM
**Why:** Foundation for pages and sections

1. ✅ **Card** - FROZEN (website pricing only) + **AppCard** - STABILIZED (app use)
2. ✅ **Separator** - STABILIZED
3. ✅ **Accordion** - STABILIZED (Clean Code A+)
4. ✅ **SectionWrapper**, **SectionHeading** - STABILIZED (Clean Code A+)

---

### Category 4: Data Display (4 components) - PRIORITY MEDIUM
**Why:** Complex but essential

1. ✅ **DataTable** - STABILIZED (Clean Code A+) + family components
2. ✅ **Pagination** - STABILIZED (Clean Code A+)
3. ✅ **Skeleton** - STABILIZED (+ SkeletonImage, SkeletonText)
4. ~~**SeverityIndicator**~~ - MOVED TO LEADS DOMAIN (not a core UI primitive)

---

### Category 5: Utility Components (6 components) - PRIORITY LOW
**Why:** Simple, low risk

1. ✅ **AnimatedLogo** - STABILIZED (Clean Code A+)
2. ✅ **MadeWithLove** - STABILIZED (Clean Code A+)
3. ✅ **FeatureCard** - STABILIZED (Clean Code A+)
4. ✅ **CheckListItem** - STABILIZED (Clean Code A+)
5. ✅ **BlurImage**, **OptimizedImage**, **ParallaxImage** - STABILIZED (Clean Code A+)
6. ✅ **ScrollableTableWrapper** - STABILIZED (Clean Code A+)

---

### Category 6: Navigation Components (7 components) - PRIORITY LOW
**Why:** App-specific, can stabilize after core primitives

1. ✅ **AppHeader** - STABILIZED (Clean Code A+, SSR guard included)
2. ✅ **AppSidebar** - STABILIZED (Clean Code A+)
3. ✅ **AppFooter** - STABILIZED (Clean Code A+)
4. ✅ **MobileNav** - STABILIZED (Clean Code A+)
5. ✅ **BottomNav** - STABILIZED (Clean Code A+)
6. ✅ **MobileMenu** - STABILIZED (Clean Code A+)
7. ✅ **Header** - STABILIZED (Clean Code A+)

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
- [ ] **CRITICAL:** Storybook has AllStates story (visual matrix showing all variants/sizes/states + focus behavior)
- [ ] AllStates story follows standardized pattern (see agent-context.json → storybook.allStatesStory)
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

### ✅ Completed (48/48 core components) - ALL CLEAN CODE A+

**All core components stabilized including Header (website).**

**Batch upgrade 2025-12-30:** All components upgraded to Uncle Bob A+ standard with section headers, named constants, and DDS semantic tokens.

**Batch 2 (2025-12-30):** DataTable family, table utilities, navigation components stabilized via LEGION delegation.

**Batch 3 (2025-12-30):** Final 9 components stabilized - SectionWrapper, SectionHeading, OptimizedImage, ParallaxImage, ScrollableTableWrapper, AppSidebar, AppFooter, MobileNav, MobileMenu.

1. **Badge** - ATOM, clean code A+, shadcn tokens→DDS semantic (text-inverse, bg-inverse-bg)
2. **Button** - ATOM, clean code A+ (B→A+), extracted useGlassAnimation hook + GlassEffect/BeaconEffect sub-components
   - Constants: ANIMATION_DURATION_SECONDS, BORDER_RADIUS, GLASS_MASK, SKIP_EFFECT_VARIANTS
   - Main function reduced: 95→40 lines
3. **Skeleton** - ATOM, clean code A+, extracted ROUNDED_CLASSES + ASPECT_CLASSES constants
4. **Input** - ATOM, clean code A+, section headers added
5. **Textarea** - ATOM, clean code A+, section headers added
6. **Label** - ATOM, clean code A+, section headers added
7. **Checkbox** - ATOM, clean code A+, text-white→text-on-status
8. **Select** - ATOM (compound), clean code A+, shadcn tokens→DDS semantic (text-muted, bg-surface)
9. **Slider** - ATOM, clean code A+, extracted THUMB_OFFSET_PX, added displayName
10. **Separator** - ATOM, clean code A+, section headers added
11. **Card/AppCard** - FROZEN (Card for website pricing) + NEW (AppCard for app use)
    - Card: FROZEN to website-only (pricing, pricingHighlight variants)
    - AppCard: New MOLECULE for app use (default, elevated, flat variants)
    - Elevated variant: ALIAS.gradient.subtle (vertical teal→cream matching AppHeader)
    - New "elevated" shadow: Natural light from above (combines 2 shadows)
    - All app code migrated (StatsCard, tenant-requests)
    - Clean separation: website vs app cards
12. **Dialog** - MOLECULE (compound), clean code A+, extracted MODAL_Z_INDEX constant
    - Section headers: CONSTANTS, COMPONENTS
    - All 10 sub-components have displayName
13. **Sheet** - MOLECULE (compound), clean code A+, extracted SHEET_Z_INDEX constant
    - Section headers: CONSTANTS, CONTEXT, COMPONENT
    - All 9 sub-components have displayName
14. **Tooltip** - MOLECULE (compound), clean code A+, shadcn tokens→DDS semantic
    - Extracted TOOLTIP_Z_INDEX, bg-primary→bg-inverse-bg, text-primary-foreground→text-inverse
    - Section headers: CONSTANTS, COMPONENTS
15. **ErrorBoundary** - ATOM (class component), comprehensive JSDoc with usage examples
    - displayName added
    - Includes CanvasErrorBoundary and SectionErrorBoundary variants
16. **ErrorState** - ATOM, stories simplified (18→3), comprehensive JSDoc
    - displayName added, data-slot="error-state" and role="alert"
17. **ActionTile** - ATOM, clean code A+ (A-→A+), semantic tokens
    - Extracted ACTIVE_STATES constant, section headers added
18. **Accordion** - MOLECULE, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, COMPONENTS, PRIMITIVE EXPORTS
    - Constants: ICON_SIZE_CLASS, CHEVRON_ROTATION_DURATION_MS
    - Helper function: getItemValue() extracted from inline
    - Semantic tokens: bg-accent/5→bg-accent-bg, kept text-primary/text-secondary
    - All 6 sub-components have displayName
    - JSDoc with @component MOLECULE tag
19. **CheckListItem** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, COMPONENTS
    - Constants: ICON_SIZE_CLASS, ICON_TEXT_GAP, TEXT_SIZE_CLASS, TEXT_COLOR_VARIANTS
    - Props extend React.HTMLAttributes for {...props} spread
    - data-slot attributes for testing: checklist-item, checklist-icon, checklist-text, checklist-label
    - displayName added
    - Comprehensive JSDoc with @component ATOM tag
20. **FeatureCard** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, HOOKS, TYPES, COMPONENT
    - Constants: OUTER_RING_RADIUS, DASH_GAP_SIZE, SPIN_VELOCITY_DEG_PER_SEC, SPRING_CONFIG,
      SEQUENCE_ANIMATION_DURATION_MS, DESCRIPTION_MAX_HEIGHT_PX, DESCRIPTION_SLIDE_OFFSET_PX,
      DESCRIPTION_ANIMATION_DURATION_SEC, DESCRIPTION_EASING, TABLET_MIN_WIDTH_PX, TABLET_MAX_WIDTH_PX,
      ICON_ACTIVE_SCALE, ICON_SCALE_DURATION_SEC
    - Props extend React.HTMLAttributes for {...props} spread
    - data-slot="feature-card" for testing
    - displayName added
    - Comprehensive JSDoc with @component ATOM tag and examples
21. **MadeWithLove** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, SUB-COMPONENTS, MAIN COMPONENT
    - Constants: DISRUPT_URL, HEARTBEAT_DURATION_SECONDS, HEARTBEAT_REPEAT_DELAY_SECONDS,
      HEART_SIZE_CLASSES, HEARTBEAT_KEYFRAME_TIMES, HEARTBEAT_SCALE_VALUES
    - Sub-components: DisruptFullLogo, BeatingHeart (both with displayName)
    - data-slot="made-with-love" for testing
    - aria-hidden on decorative SVG/icons for accessibility
    - displayName added to all components
    - Comprehensive JSDoc with @component ATOM tag and examples
22. **AnimatedLogo** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES & INTERFACES, PIXEL CONFIGURATIONS, ANIMATED PIXEL COMPONENT, MAIN COMPONENT
    - Constants: CLICK_ANIMATION_LOCK_MS, BURST_ANIMATION_DURATION_SECONDS, HOLD_DURATION_MS,
      SPRING_CONFIG, BURST_EASING
    - Props extend React.HTMLAttributes with Omit<..., 'onClick'> for custom onClick handler
    - data-slot="animated-logo" for testing
    - aria-hidden="true" on SVG, role="img" with aria-label on container
    - displayName added to both AnimatedLogo and AnimatedPixel components
    - Comprehensive JSDoc with @component ATOM tag and examples

**--- Batch 2: DataTable Family & Table Utilities (2025-12-30) ---**

23. **DataTable** - MOLECULE (compound), clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, DATA_SLOTS, HELPER FUNCTIONS, SUB-COMPONENTS, MAIN COMPONENT
    - 9 sub-components with displayName: SortIndicator, TableHeaderCell, PriorityBorderOverlay,
      TableBodyCell, SelectionCheckboxCell, TableBodyRow, LoadingState, EmptyState, DataTable
    - Constants: MIN_COLUMN_WIDTH, PRIORITY_BORDER_WIDTH_PX, SKELETON_CHECKBOX_SIZE, etc.
    - Comprehensive JSDoc with @component MOLECULE tag
24. **DataTableActions** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPERS, COMPONENTS
    - Constants: DEFAULT_MAX_VISIBLE, ICON_SIZE_CLASS, MENU_ICON_SIZE_CLASS, DATA_SLOT
    - Permission-based visibility, overflow menu pattern
25. **DataTableBadge** - ATOM, clean code A+ (2025-12-30)
26. **DataTableStatusDot** - ATOM, clean code A+ (2025-12-30)
27. **DataTableSeverity** - ATOM, clean code A+ (2025-12-30)
28. **DataTableMobileCard** - MOLECULE, clean code A+ (2025-12-30)
29. **CopyableId** - ATOM, clean code A+ (2025-12-30)
    - 3-state visual feedback: idle/copied/error
    - Constants: COPY_FEEDBACK_DURATION_MS, ICON_SIZE_CLASS, DATA_SLOT
30. **StatusBadge** - ATOM, clean code A+ (2025-12-30) - Exemplary minimal focused component
31. **ScoreBadge** - ATOM, clean code A+ (2025-12-30)
32. **EmailLink** - ATOM, clean code A+ (2025-12-30)
33. **TruncatedText** - ATOM, clean code A+ (2025-12-30)
34. **IncidentStatusBadge** - ATOM, clean code A+ (2025-12-30)
35. **IncidentManagementTable** - MOLECULE, clean code A+ (2025-12-30)

**--- Batch 2: Navigation & Image Components (2025-12-30) ---**

36. **AppHeader** - MOLECULE, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, SUB-COMPONENTS, MAIN COMPONENT
    - SSR guard: `if (typeof document === 'undefined') return false`
    - Dark mode observer pattern with cleanup
37. **BottomNav** - MOLECULE, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, SUB-COMPONENTS
    - displayName on all sub-components: MoreTab, SheetNavItem, SheetNavGroup
38. **BlurImage** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, COMPONENTS
    - Constants: PLACEHOLDER_BLUR_PX, PLACEHOLDER_SCALE, FADE_DURATION_S, BREAKPOINT_*
    - onLoad + onError handlers for graceful degradation

**--- Batch 3: Final Components (2025-12-30) ---**

39. **SectionWrapper** - ATOM, clean code A+ (2025-12-30)
    - Located in SectionLayout.tsx
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, COMPONENT
    - data-slot="section-wrapper" for testing
40. **SectionHeading** - ATOM, clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, COMPONENTS
    - displayName added
41. **OptimizedImage** - MOLECULE, clean code A+ (2025-12-30)
    - 3 sub-components with displayName: ImageErrorFallback, OptimizedImage, SimpleOptimizedImage
42. **ParallaxImage** - ATOM, clean code A+ (2025-12-30)
    - displayName added
43. **ScrollableTableWrapper** - MOLECULE, clean code A+ (2025-12-30)
    - 3 sub-components with displayName: ScrollHintOverlay, ScrollHintButton, ScrollableTableWrapper
44. **AppSidebar** - MOLECULE, clean code A+ (2025-12-30)
    - 4 sub-components with displayName: NavItemButton, NavGroup, HelpItem, AppSidebar
45. **AppFooter** - MOLECULE, clean code A+ (2025-12-30)
    - 7 sub-components with displayName: WaveKeyframes, WaveGlassBackground, WaveLayer, WavePattern, FooterBorder, CopyrightText, AppFooter
46. **MobileNav** - MOLECULE, clean code A+ (2025-12-30)
    - 4 sub-components with displayName: MobileNavItemButton, MobileNavGroup, MobileHelpItem, MobileNav
47. **MobileMenu** - MOLECULE, clean code A+ (2025-12-30)
    - 4 sub-components with displayName: AnimatedBurger, MobileMenuBackdrop, MobileMenuPanel, MobileMenu
48. **Header** - MOLECULE (website), clean code A+ (2025-12-30)
    - Section headers: CONSTANTS, TYPES, HELPER FUNCTIONS, SUB-COMPONENTS, MAIN COMPONENT
    - Constants: SCROLL_THRESHOLD_PX, NAV_HEIGHT_PX, LOGO_SIZE_CLASSES, DATA_SLOT
    - data-slot attributes: header, header-nav, header-logo
    - displayName added
    - Stabilized from FROZEN status via LEGION Bobby delegation

### 🔧 Utility Systems (Infrastructure - Not Core Components)
- **Form** - Composition helpers (FormItem, FormLabel, FormControl, FormMessage, FormDescription)
  - Note: No AllStates story needed (states are shown in Input, Label, Checkbox atoms)
  - Documentation added with links to core atoms

### 🔄 In Progress (0/48)
None

### ⬜ To Do (0/48) - COMPLETE! 🎉

All core components are now Clean Code A+.

**Excluded (0):**
None - all components stabilized including Header (website).

---

## 🎯 Focus Strategy

### Current Phase: ✅ COMPLETE

**All 48 core components are now Clean Code A+!**

**Next Steps (Optional):**
1. Domain component stabilization (Partners, Leads, Provisioning)
2. Story/Storybook updates for new components
3. Component documentation review

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

### Website Components (FROZEN - except stabilized core)
- All 32 section components (HeroSection, FeaturesSection, etc.)
- Footer, PageLayout
- GridBlobCanvas

**Note:** Header was stabilized as a core component (used app-wide).
**Reason:** Production website sections are stable, DO NOT TOUCH.

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

**Last Updated:** 2025-12-30
**Status:** ✅ COMPLETE - 48/48 core components stabilized (100%)
**Excluded:** None
**Progress:** All batches complete via LEGION delegation. Core component stabilization finished!

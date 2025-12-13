# v3.0.0 Breaking Changes Tracker

**Status:** Planning Phase
**Last Updated:** 2025-12-13
**Purpose:** Track all breaking changes and technical debt for v3.0.0 major release

---

## 🎯 Overview

This file tracks breaking changes that cannot be implemented in v2.x but are needed for v3.0.0.

**v2.x Policy:** NO BREAKING CHANGES until v3.0.0
- Rename props ❌
- Remove props ❌
- Change prop types ❌
- Change defaults ❌
- Remove exports ❌

---

## 📋 Tracked Items

### 1. SeverityIndicator - Design Token Architecture Refactor

**Component:** `src/components/ui/SeverityIndicator.tsx`
**Priority:** HIGH
**Category:** Design Token Architecture Violation
**Date Added:** 2025-12-13
**Review Doc:** `.claude/reviews/severity-indicator-review.md`

#### Problem
Component violates 3-tier token architecture:
- ❌ Imports PRIMITIVES directly (CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT)
- ❌ Uses hardcoded hex colors (#FFFFFF, #67E8F9, #A5F3FC, #06B6D4)
- ❌ Should use ALIAS tokens instead

#### Current Code (v2.x)
```typescript
// Line 4: Direct PRIMITIVES import
import { CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT } from '../../constants/designTokens'

// Lines 35-80: Hardcoded colors
const severityConfig = {
  critical: {
    fill: CORAL[600],      // ❌ Direct PRIMITIVES
    textColor: '#FFFFFF',  // ❌ Hardcoded hex
  },
  // ... more violations
}

// Lines 78-80: Override with hardcoded hex
severityConfig.none.fill = '#67E8F9'
severityConfig.none.stroke = '#A5F3FC'
severityConfig.none.textColor = '#06B6D4'
```

#### Required Changes (v3.0.0)

**Step 1:** Create ALIAS.severity tokens in `src/constants/designTokens.ts`
```typescript
export const ALIAS = {
  // ... existing tokens
  severity: {
    critical: {
      fill: CORAL[600],
      stroke: CORAL[200],
      text: PRIMITIVES.white,
    },
    high: {
      fill: ORANGE[500],
      stroke: ORANGE[200],
      text: PRIMITIVES.white,
    },
    medium: {
      fill: SUNRISE[500],
      stroke: ORANGE[200],
      text: PRIMITIVES.white,
    },
    low: {
      fill: HARBOR[500],
      stroke: HARBOR[200],
      text: PRIMITIVES.white,
    },
    none: {
      fill: '#67E8F9',      // Cyan-300 (not in our palette)
      stroke: '#A5F3FC',    // Cyan-200 (not in our palette)
      text: '#06B6D4',      // Cyan-500 (not in our palette)
    },
  },
}
```

**Step 2:** Refactor SeverityIndicator component
```typescript
// Import ALIAS instead of PRIMITIVES
import { ALIAS } from '../../constants/designTokens'

const severityConfig: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    fill: ALIAS.severity.critical.fill,
    stroke: ALIAS.severity.critical.stroke,
    textColor: ALIAS.severity.critical.text,
    showFlame: true,
    label: 'Critical',
  },
  high: {
    fill: ALIAS.severity.high.fill,
    stroke: ALIAS.severity.high.stroke,
    textColor: ALIAS.severity.high.text,
    text: '!!!',
    showFlame: false,
    label: 'High',
  },
  // ... rest of levels
}

// Remove lines 78-80 (no more hardcoded overrides)
```

#### Why It's Breaking
- **Design token system change** - affects token architecture
- **Risk of visual regression** - color values must match exactly
- **Used in production** - LeadCard, LeadsDataTable in Leads module
- **ESLint enforcement** - Currently shows 18 errors (expected)

#### Impact Assessment
- **Files affected:** 1 component file, 1 token file
- **Components using:** 2 (LeadCard, LeadsDataTable)
- **Visual testing required:** All 5 severity levels (critical, high, medium, low, none)
- **Risk level:** MEDIUM (visual change risk)

#### Migration Guide (for v3.0.0)
```typescript
// No API changes - purely internal refactor
// Components using SeverityIndicator continue to work as-is
<SeverityIndicator level="critical" />  // Still works

// Visual should remain identical
// Test all 5 levels in Leads module
```

#### Pre-Release Checklist
- [ ] Create ALIAS.severity tokens in designTokens.ts
- [ ] Refactor SeverityIndicator to use ALIAS.severity
- [ ] Remove hardcoded hex overrides (lines 78-80)
- [ ] Visual regression test all 5 severity levels
- [ ] Test in LeadCard component
- [ ] Test in LeadsDataTable component
- [ ] Verify ESLint errors cleared (should be 0)
- [ ] Update Storybook stories if needed
- [ ] Update documentation

---

---

### 2. Skeleton - Remove Animation Variant Prop

**Component:** `src/components/ui/Skeleton.tsx`
**Priority:** MEDIUM
**Category:** Variant Reduction (Design Consistency)
**Date Added:** 2025-12-13
**Review Doc:** `.claude/variant-reduction-strategy.md`

#### Problem
Too many animation variants create UI inconsistency:
- ❌ 3 animation variants (shimmer, wave, pulse)
- ❌ Purely aesthetic - no functional difference
- ❌ Consumers can choose different animations across pages
- ❌ Result: Inconsistent loading states

#### Current Code (v2.x)
```typescript
// Line 12: variant prop with 3 options
variant?: 'pulse' | 'shimmer' | 'wave'

// Lines 30-34: Three different animations
const animationClasses = {
  pulse: 'animate-pulse',
  shimmer: 'skeleton-shimmer',
  wave: 'skeleton-wave',
}
```

#### v2.x Safe Deprecation (IMPLEMENTED)
```typescript
/**
 * @deprecated The variant prop is deprecated and will be removed in v3.0.0.
 * Skeleton now uses a single, consistent 'shimmer' animation for design consistency.
 * All variants will render as shimmer in v2.x for backwards compatibility.
 */
variant?: 'pulse' | 'shimmer' | 'wave'

// Component always uses shimmer (ignore variant)
const animation = 'skeleton-shimmer'  // Fixed, no choice
```

#### Required Changes (v3.0.0)

**Step 1:** Remove variant prop from interface
```typescript
// Remove variant prop entirely
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  // variant removed
}
```

**Step 2:** Remove animation selection logic
```typescript
// Remove animationClasses object
// Hardcode shimmer animation

export function Skeleton({ className, rounded, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={cn(
        'bg-muted/30',
        roundedClasses[rounded],
        'skeleton-shimmer',  // Hardcoded
        className
      )}
    />
  )
}
```

**Step 3:** Update Storybook
- Remove animation variant stories
- Keep only rounded variant stories (functional)

#### Why It's Breaking
- **API change** - Removes variant prop
- **Consumer code breaks** - Any usage of `variant="wave"` or `variant="pulse"` will error
- **Used in production** - 7 files, 87 occurrences

#### Impact Assessment
- **Files affected:** 1 component file, 7 consumer files
- **Consumer update required:** Remove `variant` prop from all Skeleton usages
- **Visual impact:** All skeletons use shimmer (most are already using default shimmer)
- **Risk level:** LOW (purely aesthetic change, likely minimal actual usage of wave/pulse)

#### Migration Guide (for v3.0.0)
```typescript
// BEFORE (v2.x)
<Skeleton variant="wave" />
<Skeleton variant="pulse" />
<Skeleton variant="shimmer" />

// AFTER (v3.0.0)
<Skeleton />  // Always shimmer animation
<Skeleton />
<Skeleton />

// No visual change if using default (shimmer)
// Wave and pulse users will see shimmer instead
```

#### Pre-Release Checklist
- [ ] Remove `variant` prop from SkeletonProps interface
- [ ] Remove animationClasses object
- [ ] Hardcode 'skeleton-shimmer' animation
- [ ] Update all consumer files to remove variant prop
- [ ] Verify shimmer animation works in all 7 usage locations
- [ ] Update Storybook (remove animation stories)
- [ ] Update JSDoc (remove variant examples)
- [ ] Test visual regression (ensure shimmer looks good everywhere)

---

## 🔮 Future Items (Not Yet Identified)

As we stabilize more components in v2.x, additional breaking changes may be discovered.

### How to Add New Items
1. Stabilize component in v2.x (safe improvements only)
2. Identify breaking change that can't be fixed
3. Document it in this file
4. Reference in CHANGELOG.md v3.0.0 section
5. Add to component review file

---

---

### 3. Button - Redesign Color Strategy (Brand vs Action Colors)

**Component:** `src/components/ui/button.tsx`
**Priority:** HIGH
**Category:** Design Pattern Anti-Pattern
**Date Added:** 2025-12-13
**Constraint:** FROZEN for website (used in 8 section files, 58 occurrences)

#### Problem
Current design violates UX best practice: "Don't use brand color for all primary actions"

**Current:**
```tsx
// Primary button uses brand color (Abyss dark navy)
default: "bg-inverse-bg text-inverse"  // #2D3142 = Brand primary color

// Accent button uses brand secondary (Teal)
accent: "bg-accent-strong text-inverse"  // #08A4BD = Brand secondary color

// Result: Brand colors = button colors (dilutes brand identity)
```

**Issues:**
- ❌ Brand color overused (every primary action)
- ❌ Logo/headers don't stand out (same color as buttons)
- ❌ Brand identity diluted (color loses meaning)
- ❌ Design anti-pattern (industry best practice: reserve brand for special CTAs)

#### Current Code (v2.x)
```typescript
// Lines 26-50: Button variants
variant: {
  default: "bg-inverse-bg text-inverse"        // Brand primary
  accent: "bg-accent-strong text-inverse"      // Brand secondary
  destructive: "bg-error text-inverse"
  outline: "border border-default"
  secondary: "bg-muted-bg text-secondary"
  ghost: "text-primary hover:bg-page"
  link: "text-accent underline"
  contact: "bg-inverse-bg text-inverse"        // Same as default
}
```

#### Required Changes (v3.0.0)

**Step 1:** Create action color tokens in `designTokens.ts`
```typescript
export const ALIAS = {
  // ... existing tokens
  action: {
    // Primary: Neutral high-contrast (NOT brand color)
    primary: WAVE[600],           // #2563EB (neutral blue)
    primaryHover: WAVE[700],
    primaryText: PRIMITIVES.white,

    // Brand: Reserved for special CTAs (opt-in)
    brand: DEEP_CURRENT[500],     // #08A4BD (teal - actual brand)
    brandHover: DEEP_CURRENT[600],
    brandText: PRIMITIVES.white,

    // Destructive: Remains same
    destructive: CORAL[500],
    destructiveHover: CORAL[600],
  },
}
```

**Step 2:** Redesign Button variants
```typescript
const buttonVariants = cva({
  variants: {
    variant: {
      // Primary: Neutral action color (NOT brand)
      default: "bg-action-primary text-inverse hover:bg-action-primary/90",

      // Brand: Teal brand color - OPT-IN for special CTAs
      brand: "bg-brand text-inverse hover:bg-brand/90",

      // Keep existing
      destructive: "bg-error text-inverse hover:bg-error/90",
      outline: "border border-default bg-surface text-primary hover:bg-page",
      ghost: "text-primary hover:bg-page",

      // Remove redundant
      // secondary, link, contact, accent → consolidate
    }
  }
})
```

**Step 3:** Update website usage
```tsx
// BEFORE (website)
<Button variant="default">Learn More</Button>     // Was brand color
<Button variant="accent">Get Started</Button>     // Was brand color

// AFTER (website - v3.0.0 migration)
<Button>Learn More</Button>                       // Neutral action blue
<Button variant="brand">Start Free Trial</Button> // Brand teal - special CTA
```

**Step 4:** Define variant reduction
```tsx
// Final variants (5 total):
variant: 'default' | 'brand' | 'destructive' | 'outline' | 'ghost'

// Removed: secondary, link, contact, accent (redundant)
```

#### Why It's Breaking
- **Visual change** - All default buttons change from dark navy to blue
- **API change** - Remove variants (secondary, link, contact, accent)
- **Semantic change** - "default" means action, "brand" means brand CTA
- **Website impact** - 58 Button occurrences need review/migration
- **App impact** - All Button usages change visually

#### Impact Assessment
- **Files affected:** 1 component, ~100+ consumer files (website + app)
- **Visual impact:** HIGH - All primary buttons change color
- **Migration effort:** MEDIUM - Review all button usages, add "brand" where appropriate
- **Risk level:** MEDIUM (visual regression risk)
- **UX improvement:** HIGH (proper design pattern)

#### Migration Guide (for v3.0.0)

**Automatic migration (most buttons):**
```tsx
// BEFORE
<Button>Save</Button>                    // Dark navy (brand)
<Button variant="accent">Submit</Button> // Teal (brand)

// AFTER (auto - visual change)
<Button>Save</Button>                    // Blue (action) ← Visual change
<Button>Submit</Button>                  // Blue (action) ← Visual change
```

**Manual migration (special CTAs):**
```tsx
// BEFORE
<Button>Start Free Trial</Button>       // Dark navy

// AFTER (developer decision)
<Button variant="brand">Start Free Trial</Button>  // Teal - special CTA
```

**Variant consolidation:**
```tsx
// BEFORE
<Button variant="secondary">Cancel</Button>
<Button variant="link">Learn More</Button>

// AFTER
<Button variant="ghost">Cancel</Button>      // Consolidate to ghost
<Button variant="outline">Learn More</Button> // Or outline
```

#### Design Rationale

**Why Neutral Action Color:**
1. ✅ Buttons are functional tools (save, submit, cancel)
2. ✅ Brand color reserved for brand moments (join, start trial)
3. ✅ Better accessibility (neutral blue is universally recognized)
4. ✅ Logo/headers stand out (brand color is special)
5. ✅ Industry best practice (GitHub, Notion, Linear, Figma)

**When to use brand variant:**
- "Start Free Trial" - key conversion CTA
- "Join Beta" - special invitation
- "Get Started" - main website CTA
- "Upgrade Now" - upsell moment

**When to use default variant:**
- "Save" - functional action
- "Submit" - form submission
- "Confirm" - confirmation
- "Continue" - navigation

#### Pre-Release Checklist
- [ ] Create ALIAS.action tokens (primary, brand, destructive)
- [ ] Redesign button variants (5 total: default, brand, destructive, outline, ghost)
- [ ] Audit all Button usages (website + app)
- [ ] Identify CTAs that should use "brand" variant
- [ ] Update Button component
- [ ] Visual regression testing
- [ ] Migration guide for consumers
- [ ] Update Storybook with new philosophy
- [ ] Update documentation

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| **Total Breaking Changes** | 3 |
| **High Priority** | 2 (SeverityIndicator token refactor, Button redesign) |
| **Medium Priority** | 1 (Skeleton variant removal) |
| **Low Priority** | 0 |
| **Components Affected** | 3 (SeverityIndicator, Skeleton, Button) |

---

## 🚀 v3.0.0 Release Plan (Tentative)

### Phase 1: Deprecation (v2.9.0 - 1-2 months before v3.0.0)
- Add deprecation warnings for all breaking changes
- Provide migration guides
- Support both old and new APIs temporarily where possible

### Phase 2: Major Release (v3.0.0)
- Implement all breaking changes from this file
- Remove all deprecated features
- Complete visual regression testing
- Update all documentation
- Publish migration guide

### Phase 3: Post-Release
- Monitor for issues
- Provide v2.x → v3.0.0 migration support
- Update all examples and Storybook

---

## 📝 Notes

- This file should be read by agents when planning v3.0.0 work
- Keep it updated as new breaking changes are discovered during v2.x stabilization
- Each item should have: Problem, Solution, Impact, Migration Guide
- Link to detailed review files for context

---

**Last Review:** 2025-12-13
**Next Review:** When new breaking changes identified or when planning v3.0.0

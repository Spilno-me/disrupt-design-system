# Variant Reduction Strategy - Design Consistency

**Date:** 2025-12-13
**Philosophy:** Opinionated design system with minimal, essential variants
**Goal:** Maintain design vision, prevent consumer misuse

---

## 🎯 The Problem

**Too many variants = Inconsistent UI**

```tsx
// ❌ BAD: Too much freedom
<Skeleton variant="shimmer" />   // One page uses shimmer
<Skeleton variant="wave" />      // Another page uses wave
<Skeleton variant="pulse" />     // Another page uses pulse

Result: Inconsistent loading states across the application
```

**Example from Screenshot:**
- Skeleton has 3 animation variants (shimmer, wave, pulse)
- Consumers can choose different animations
- UI loses consistency - different loading experiences

---

## 💡 The Philosophy

### Opinionated Design System

**We are building an OPINIONATED design system:**
- ✅ Strong design vision
- ✅ Consistent user experience
- ✅ Minimal choice, maximum quality
- ❌ Not a "build anything" toolkit
- ❌ Not "fully flexible"

**Examples of opinionated systems:**
- Apple Design System - one way to do things
- Material Design - strict guidelines
- Stripe - limited variants, high polish

**Examples of flexible systems:**
- Tailwind CSS - infinite combinations
- Headless UI - bring your own styles
- Result: Every app looks different (good for flexibility, bad for consistency)

---

## 📋 Variant Decision Framework

### Question 1: Does this variant serve a FUNCTIONAL purpose?

**Functional = YES, Keep:**
```tsx
// Button variants serve DIFFERENT FUNCTIONS
<Button variant="default">Save</Button>      // Primary action
<Button variant="destructive">Delete</Button> // Dangerous action
<Button variant="ghost">Cancel</Button>       // Secondary action

// Badge variants indicate DIFFERENT STATES
<Badge variant="success">Active</Badge>       // Success state
<Badge variant="destructive">Error</Badge>    // Error state
<Badge variant="warning">Pending</Badge>      // Warning state
```

**Aesthetic = NO, Remove:**
```tsx
// Skeleton variants are PURELY AESTHETIC
<Skeleton variant="shimmer" />  // ❌ Just looks different
<Skeleton variant="wave" />     // ❌ Just looks different
<Skeleton variant="pulse" />    // ❌ Just looks different

// Pick ONE, remove others
<Skeleton />  // ✅ One animation, consistent everywhere
```

---

### Question 2: Does the variant improve accessibility or UX?

**Improves UX = YES, Keep:**
```tsx
// Button sizes improve touch targets and hierarchy
<Button size="sm">Secondary</Button>   // Smaller, less important
<Button size="lg">Primary CTA</Button> // Larger, more prominent

// Badge shapes serve different contexts
<Badge shape="default">Status</Badge>  // Inline with text
<Badge shape="pill">Category</Badge>   // Standalone tag
```

**Just aesthetic = NO, Remove:**
```tsx
// Multiple badge sizes without functional difference
<Badge size="xs" />  // ❌ Too many options
<Badge size="sm" />  // ✅ Keep default
<Badge size="md" />  // ❌ Remove
<Badge size="lg" />  // ❌ Remove
<Badge size="xl" />  // ❌ Remove
```

---

### Question 3: Does limiting this variant hurt consumers?

**Hurts = YES, Keep:**
```tsx
// Need different button states for different actions
<Button variant="default">Save</Button>      // NEED
<Button variant="destructive">Delete</Button> // NEED
<Button variant="ghost">Cancel</Button>       // NEED
```

**Doesn't hurt = NO, Remove:**
```tsx
// Don't need different skeleton animations
<Skeleton />  // One animation is enough
// Consumer doesn't care HOW it animates, just that it shows loading
```

---

## 🔍 Component Variant Audit

### Skeleton (Current: 3 variants)

**Current:**
```tsx
variant?: 'pulse' | 'shimmer' | 'wave'
```

**Analysis:**
- ❌ Purely aesthetic - no functional difference
- ❌ All indicate "loading" - same purpose
- ❌ Consumer doesn't need choice
- ❌ Creates inconsistency

**Decision:** ✅ **REDUCE to ONE**
```tsx
// v2.x (SAFE): Deprecate variant prop, always use shimmer
// v3.0.0 (BREAKING): Remove variant prop entirely

// Component code (v2.x transition)
export function Skeleton({
  variant = 'shimmer',  // Keep for backwards compat
  // ... rest
}) {
  // Ignore variant prop, always use shimmer
  const animation = 'skeleton-shimmer'  // Fixed
}

// v3.0.0: Remove variant prop completely
export function Skeleton({
  // variant prop removed
}) {
  const animation = 'skeleton-shimmer'
}
```

**Chosen variant:** `shimmer` (most subtle, professional)

---

### Badge (Current: 7 variants)

**Current:**
```tsx
variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
```

**Analysis:**
- ✅ Functional - different states/meanings
- ✅ Semantic colors (success/error/warning/info)
- ⚠️ Too many? Let's reduce

**Decision:** ✅ **REDUCE to 5 ESSENTIAL**

**Keep (Functional):**
```tsx
variant: 'default' | 'destructive' | 'success' | 'warning' | 'outline'

default      // Neutral/default state
destructive  // Error/danger state
success      // Success/active state
warning      // Warning/pending state
outline      // Low-emphasis variant
```

**Deprecate (Redundant):**
```tsx
secondary  // ❌ Redundant with default
info       // ❌ Redundant with default (blue vs gray - not meaningful)
```

**v2.x:** Mark as deprecated in JSDoc, keep working
**v3.0.0:** Remove secondary and info variants

---

### Badge Shape (Current: 2 shapes)

**Current:**
```tsx
shape?: 'default' | 'pill'
```

**Analysis:**
- ✅ Functional - different contexts (inline vs standalone)
- ✅ Only 2 options - minimal
- ✅ Keep both

**Decision:** ✅ **KEEP BOTH**

---

### Badge Size (Current: 3 sizes)

**Current:**
```tsx
size?: 'sm' | 'md' | 'lg'
```

**Analysis:**
- ⚠️ Functional - but 3 sizes might be too many
- ⚠️ Does consumer need 3 sizes?

**Decision:** ⚠️ **REDUCE to 2 or REMOVE entirely**

**Option A: Keep default only (no size prop)**
```tsx
// One size fits all
<Badge>Active</Badge>
```

**Option B: Keep 2 sizes (default + small)**
```tsx
size?: 'default' | 'sm'

<Badge>Default</Badge>           // Normal use
<Badge size="sm">Compact</Badge> // Dense UIs, mobile
```

**Recommendation:** Option A (remove size prop) unless consumers specifically need small variant

---

### SeverityIndicator (Current: 2 sizes)

**Current:**
```tsx
size?: 'sm' | 'md'
```

**Analysis:**
- ✅ Functional - table vs card contexts
- ✅ Only 2 options - minimal
- ✅ Keep both

**Decision:** ✅ **KEEP BOTH**

---

## 🎨 Variant Reduction Guidelines

### When to KEEP a variant:

1. ✅ **Different functional purpose**
   - Button: default vs destructive vs ghost (different actions)
   - Badge: success vs error vs warning (different states)

2. ✅ **Different semantic meaning**
   - Badge: success (green) vs destructive (red) - meaning is clear
   - SeverityIndicator: critical vs high vs medium (priority levels)

3. ✅ **Improves accessibility or UX**
   - Button size: sm vs lg (touch targets, hierarchy)
   - SeverityIndicator size: sm (tables) vs md (cards)

4. ✅ **Limited options (≤3 variants)**
   - Badge shape: default vs pill (2 options only)
   - SeverityIndicator size: sm vs md (2 options only)

5. ✅ **Consumer NEEDS the choice**
   - Can't achieve their use case without it

---

### When to REMOVE a variant:

1. ❌ **Purely aesthetic, no functional difference**
   - Skeleton: shimmer vs wave vs pulse
   - Different shadows: shadow-sm vs shadow-md vs shadow-lg vs shadow-xl

2. ❌ **Too many options (>5 variants)**
   - Badge: 7 variants is too many
   - Button: 6+ variants is too many

3. ❌ **Redundant with another variant**
   - Badge: secondary vs default (both neutral)
   - Badge: info vs default (both blue-ish)

4. ❌ **Consumer doesn't care about the difference**
   - Skeleton animation - consumer just wants "loading"
   - Exact border radius - consumer just wants "rounded"

5. ❌ **Creates inconsistency risk**
   - If different pages can choose different skeletons → inconsistent

---

## 🚀 Stabilization Workflow with Variant Reduction

### Step 1: Audit Current Variants
List all variant props:
```tsx
// Skeleton
variant?: 'pulse' | 'shimmer' | 'wave'
rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'  // 7 options!
```

---

### Step 2: Categorize Each Variant
```
Functional → KEEP
Aesthetic → REMOVE
Accessibility → KEEP
Redundant → REMOVE
Too many → REDUCE
```

---

### Step 3: Create v2.x Plan (Backwards Compatible)

**For variants to REMOVE:**

**Option A: Deprecate (keep working)**
```tsx
/**
 * @deprecated Use default variant instead. Will be removed in v3.0.0
 */
variant?: 'shimmer' | 'wave' | 'pulse'

// Internally, always use shimmer
const animation = 'skeleton-shimmer'  // Ignore variant prop
```

**Option B: Ignore prop value**
```tsx
// Keep prop for backwards compat, but ignore it
variant?: 'pulse' | 'shimmer' | 'wave'

// Component always uses shimmer regardless of prop
const animation = 'skeleton-shimmer'
```

---

### Step 4: Document for v3.0.0
Add to `.claude/v3-breaking-changes.md`:
```markdown
#### Skeleton - Remove animation variant prop
- **Breaking:** Remove `variant` prop
- **Reason:** Purely aesthetic, creates inconsistency
- **Migration:** Remove variant prop from all Skeleton usages
```

---

## 📊 Recommended Variant Limits

| Component Type | Max Variants | Reasoning |
|----------------|-------------|-----------|
| **State indicators** (Badge, Alert) | 4-5 | success, warning, error, info, default |
| **Action buttons** | 4-5 | primary, secondary, ghost, destructive, outline |
| **Sizes** | 2-3 | sm, default, (lg only if needed) |
| **Shapes** | 2 | default, pill/rounded |
| **Loading states** | 1 | ONE animation style |
| **Decorative** | 0-1 | Avoid if possible |

---

## 🎯 Component-by-Component Decisions

### Skeleton ❌ REDUCE
**Current:** 3 animation variants
**Reduce to:** 1 (shimmer only)
**Reason:** Purely aesthetic, no functional value

**v2.x Action:**
```tsx
// Deprecate variant prop, always use shimmer internally
/**
 * @deprecated The variant prop is deprecated and will be removed in v3.0.0.
 * Skeleton now uses a single, consistent animation style.
 */
variant?: 'pulse' | 'shimmer' | 'wave'
```

**v3.0.0 Action:**
```tsx
// Remove variant prop entirely
interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg'  // Keep, serves functional purpose
  // variant removed
}
```

---

### Badge ⚠️ REDUCE
**Current:** 7 variants
**Reduce to:** 5 variants
**Remove:** `secondary`, `info`

**Keep (Functional):**
```tsx
variant: 'default' | 'destructive' | 'success' | 'warning' | 'outline'
```

**v2.x Action:**
```tsx
/**
 * @deprecated The 'secondary' variant is deprecated. Use 'default' instead. Will be removed in v3.0.0.
 * @deprecated The 'info' variant is deprecated. Use 'default' instead. Will be removed in v3.0.0.
 */
variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
```

**v3.0.0 Action:**
```tsx
variant?: 'default' | 'destructive' | 'success' | 'warning' | 'outline'
```

---

### Badge Size ❌ REMOVE ENTIRELY
**Current:** 3 sizes (sm, md, lg)
**Reduce to:** No size prop (one default size)
**Reason:** Badges should be consistent size

**v2.x Action:**
```tsx
/**
 * @deprecated The size prop is deprecated and will be removed in v3.0.0.
 * Badge now uses a single, optimal size for all contexts.
 */
size?: 'sm' | 'md' | 'lg'

// Internally always use default size
```

**v3.0.0 Action:**
```tsx
// Remove size prop entirely
interface BadgeProps {
  variant?: string
  shape?: 'default' | 'pill'
  // size removed
}
```

---

### Button ✅ KEEP (Already Minimal)
**Current:** 6 variants (default, destructive, outline, secondary, ghost, link, contact, accent)
**Analysis:** 8 variants is too many

**Reduce to:** 5 ESSENTIAL variants

**Keep:**
```tsx
variant: 'default' | 'destructive' | 'outline' | 'ghost' | 'accent'

default      // Primary action (dark bg)
destructive  // Danger action (red)
outline      // Secondary action (bordered)
ghost        // Tertiary action (transparent)
accent       // Accent action (teal)
```

**Remove:**
```tsx
secondary    // ❌ Redundant with outline
link         // ❌ Use <a> tag instead
contact      // ❌ Too specific, use accent + custom class
```

---

### SeverityIndicator ✅ KEEP (Already Minimal)
**Current:** 5 severity levels, 2 sizes
**Analysis:** Functional, minimal
**Decision:** KEEP ALL (serves clear functional purpose)

---

## 📐 Variant Reduction Checklist

Use this when reviewing each component:

- [ ] List all variant props
- [ ] For each variant, ask:
  - [ ] Is it functional or aesthetic?
  - [ ] Does it serve different semantic meaning?
  - [ ] Would removing it hurt consumers?
  - [ ] Does it improve accessibility/UX?
- [ ] Count total variants (>5 = too many)
- [ ] Identify variants to remove
- [ ] Mark for deprecation in v2.x
- [ ] Plan removal in v3.0.0

---

## 🔧 Implementation Pattern (v2.x Safe)

### Step 1: Deprecate in JSDoc
```tsx
/**
 * @deprecated This variant is deprecated and will be removed in v3.0.0.
 * Use 'default' variant instead for consistency.
 */
variant?: 'default' | 'secondary' | 'info'
```

### Step 2: Internally Ignore Deprecated Variants
```tsx
export function Badge({ variant = 'default', ... }: BadgeProps) {
  // Map deprecated variants to supported ones
  const normalizedVariant = variant === 'secondary' || variant === 'info'
    ? 'default'
    : variant

  return (
    <span className={badgeVariants({ variant: normalizedVariant })} />
  )
}
```

### Step 3: Update Storybook
```tsx
// Remove stories for deprecated variants
// Keep only essential variants

export const AllVariants: Story = {
  render: () => (
    <div>
      <Badge variant="default">Default</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="outline">Outline</Badge>
      {/* Removed: secondary, info */}
    </div>
  )
}
```

### Step 4: Document in CHANGELOG
```markdown
### Deprecated
- **Badge**: `secondary` and `info` variants deprecated (use `default` instead)
- **Skeleton**: `variant` prop deprecated (single consistent animation)
- **Badge**: `size` prop deprecated (single optimal size)
```

### Step 5: Add to v3.0.0 Breaking Changes
Document in `.claude/v3-breaking-changes.md`

---

## 🎯 Target Variant Counts

| Component | Current | Target | Reason |
|-----------|---------|--------|--------|
| **Skeleton** | 3 animations | 1 | Aesthetic only |
| **Badge** | 7 variants | 5 | Remove redundant (secondary, info) |
| **Badge** | 3 sizes | 0 | One optimal size |
| **Button** | 8 variants | 5 | Remove redundant (secondary, link, contact) |
| **SeverityIndicator** | 5 levels, 2 sizes | KEEP | Functional |

---

## 📝 Deprecation Message Template

```tsx
/**
 * @deprecated The '{variant}' variant is deprecated and will be removed in v3.0.0.
 * Reason: [Creates inconsistency | Redundant with {other} | Aesthetic only]
 * Migration: Use '{recommended}' variant instead.
 *
 * @example
 * // Before (deprecated)
 * <Component variant="{deprecated}" />
 *
 * // After (recommended)
 * <Component variant="{recommended}" />
 */
```

---

## 🚀 Rollout Plan

### v2.4.0 (Now)
- ✅ Deprecate variants in JSDoc
- ✅ Update Storybook (remove deprecated variant stories)
- ✅ Internally normalize deprecated variants to recommended ones
- ✅ Document in CHANGELOG "Deprecated" section

### v2.5.0-v2.9.0
- ⚠️ Show console warnings when deprecated variants used
- 📚 Migration guides
- 🔔 Communicate to consumers

### v3.0.0
- ❌ Remove deprecated variant props
- ✅ Cleaner, more opinionated API
- 📖 Breaking change migration guide

---

## 💡 Design Philosophy Summary

**We believe:**
1. **Less is more** - Fewer variants, higher quality
2. **Consistency over flexibility** - One right way to do things
3. **Opinionated defaults** - We make design decisions for consumers
4. **Functional over aesthetic** - Variants must serve a purpose
5. **Prevent misuse** - Limited options = consistent UI

**Result:**
- ✅ Consistent user experience across all apps using DDS
- ✅ Faster development (fewer decisions for consumers)
- ✅ Easier maintenance (less code to support)
- ✅ Stronger design vision

---

**Last Updated:** 2025-12-13
**Status:** Active - Apply during stabilization

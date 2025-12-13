# Skeleton Component Review

**Date:** 2025-12-13
**Component:** Skeleton (`src/components/ui/Skeleton.tsx`)
**Reviewer:** AI Agent
**Status:** ✅ APPROVED with minor improvements

---

## 📊 Component Category

**Category:** Shared Primitive (LOW RISK)
- **Used in:** 7 files, 87 occurrences
- **Risk Level:** 🟢 LOW - Simple utility component, loading states
- **Usage:** DataTable, OptimizedImage, SectionLayout, DashboardPage, partner stories

---

## ✅ Current State Assessment

### Strengths
1. ✅ **Clean structure** - Three well-designed components (Skeleton, SkeletonImage, SkeletonText)
2. ✅ **TypeScript** - Proper type definitions with exported interfaces
3. ✅ **Accessible** - aria-hidden="true", role="presentation"
4. ✅ **Design token compliant** - Uses semantic Tailwind (bg-muted/30)
5. ✅ **Animation variants** - pulse, shimmer, wave
6. ✅ **Configurable** - variant, rounded props
7. ✅ **Sub-components** - SkeletonImage (aspect ratios), SkeletonText (multi-line)
8. ✅ **Comprehensive Storybook** - 8 stories showing all use cases
9. ✅ **Good adoption** - Used in 7 files

### Issues Found

#### 🟡 Minor Issues (Safe to fix)

1. **Missing React display names** (All three components)
   - Harder to debug in React DevTools
   - No runtime impact

2. **Props don't extend HTML attributes** (Lines 3, 50, 78)
   ```typescript
   // Current - can't accept data-testid
   interface SkeletonProps {
     className?: string
     variant?: 'pulse' | 'shimmer' | 'wave'
     rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
   }

   // Should extend HTMLDivElement
   interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>
   ```

3. **No data-testid in JSDoc**
   - Missing testing examples for Playwright

4. **Hardcoded colors in Storybook** (Lines 60-61, 77-80)
   ```typescript
   // ❌ Hardcoded
   background: '#FFFFFF',
   border: '1px dashed #CBD5E1',

   // ✅ Should use Tailwind classes
   className="bg-surface border border-dashed border-default"
   ```

#### ❌ No Critical Issues
- ✅ Design tokens compliant
- ✅ No PRIMITIVES imports
- ✅ No breaking changes needed

---

## 🔧 Proposed Safe Improvements

### 1. Extend Props with HTML Attributes (SAFE)
**Impact:** Enables data-testid, no API change
**Risk:** 🟢 ZERO

```typescript
// BEFORE
interface SkeletonProps {
  className?: string
  variant?: 'pulse' | 'shimmer' | 'wave'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

// AFTER
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'pulse' | 'shimmer' | 'wave'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

// Same for SkeletonImageProps and SkeletonTextProps
```

### 2. Spread Props to Enable data-testid (SAFE)
**Impact:** Allows data-testid and other HTML attributes
**Risk:** 🟢 ZERO

```typescript
// BEFORE
export function Skeleton({
  className = '',
  variant = 'shimmer',
  rounded = 'lg',
}: SkeletonProps)

// AFTER
export function Skeleton({
  className = '',
  variant = 'shimmer',
  rounded = 'lg',
  ...props  // ← Add
}: SkeletonProps)

// In JSX
<div
  {...props}  // ← Spread props
  className={cn(...)}
  aria-hidden="true"
  role="presentation"
/>
```

### 3. Add React Display Names (SAFE)
**Impact:** Better debugging, no runtime change
**Risk:** 🟢 ZERO

```typescript
Skeleton.displayName = "Skeleton"
SkeletonImage.displayName = "SkeletonImage"
SkeletonText.displayName = "SkeletonText"
```

### 4. Add data-testid to JSDoc (SAFE)
**Impact:** Better DX, no runtime change
**Risk:** 🟢 ZERO

```typescript
/**
 * Skeleton loading placeholder component.
 * Use to indicate content is loading while maintaining layout structure.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton className="w-[200px] h-[20px]" />
 *
 * // With data-testid for testing
 * <Skeleton
 *   className="w-full h-[60px]"
 *   data-testid="profile-skeleton"
 * />
 *
 * // In repeating lists
 * {items.map((_, i) => (
 *   <Skeleton
 *     key={i}
 *     className="w-full h-[40px]"
 *     data-testid={`item-skeleton-${i}`}
 *   />
 * ))}
 * ```
 */
```

### 5. Fix Hardcoded Colors in Storybook (SAFE)
**Impact:** Cleaner code, no visual change
**Risk:** 🟢 ZERO

```typescript
// BEFORE (lines 58-64)
<div style={{
  width: '350px',
  background: '#FFFFFF',        // ❌ Hardcoded
  border: '1px dashed #CBD5E1', // ❌ Hardcoded
  borderRadius: '8px',
  padding: '24px',
}}>

// AFTER
<div className="w-[350px] bg-surface border border-dashed border-default rounded-lg p-6">
```

### 6. Add data-testid Storybook Story (SAFE)
**Impact:** Testing documentation
**Risk:** 🟢 ZERO

```typescript
export const WithTestIds: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-secondary mb-2 font-medium">
          Loading Profile
        </p>
        <Skeleton
          className="w-full h-[60px]"
          data-testid="profile-skeleton"
        />
      </div>

      <div>
        <p className="text-sm text-secondary mb-2 font-medium">
          Loading List Items
        </p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="w-full h-[40px]"
              data-testid={`list-item-skeleton-${i}`}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-secondary mb-2 font-medium">
          Loading Card with Sub-components
        </p>
        <div
          className="w-[350px] bg-surface border border-default rounded-lg p-6"
          data-testid="card-skeleton-container"
        >
          <SkeletonImage
            aspectRatio="16/9"
            data-testid="card-image-skeleton"
          />
          <SkeletonText
            lines={3}
            className="mt-4"
            data-testid="card-text-skeleton"
          />
        </div>
      </div>
    </div>
  ),
}
```

---

## ❌ Breaking Changes to AVOID

None! All proposed changes are backwards compatible.

---

## 🎨 Design Token Compliance

**Status:** ✅ FULLY COMPLIANT

Component uses:
- ✅ `bg-muted/30` (semantic Tailwind)
- ✅ No raw hex colors
- ✅ No PRIMITIVES imports
- ✅ No hardcoded colors in component code

**Note:** Storybook has hardcoded colors (line 60-61, 77-80) for demo purposes - safe to fix with Tailwind classes.

---

## 📋 Implementation Checklist

- [ ] Extend SkeletonProps with `React.HTMLAttributes<HTMLDivElement>`
- [ ] Extend SkeletonImageProps with `React.HTMLAttributes<HTMLDivElement>`
- [ ] Extend SkeletonTextProps with `React.HTMLAttributes<HTMLDivElement>`
- [ ] Add `...props` parameter to all three components
- [ ] Spread `{...props}` in component JSX
- [ ] Add display names for all three components
- [ ] Add data-testid examples to JSDoc
- [ ] Fix hardcoded colors in Storybook stories
- [ ] Add "WithTestIds" Storybook story
- [ ] Run `npm run typecheck` (verify no errors)
- [ ] Run `npm run lint` (verify no errors)
- [ ] Update CHANGELOG.md

---

## 🚀 Recommendation

**Proceed with improvements:** ✅ ALL SAFE

All proposed changes are:
- ✅ Backwards compatible
- ✅ Non-breaking
- ✅ Improve testing support (data-testid)
- ✅ Improve developer experience
- ✅ No visual changes

**Estimated effort:** 15 minutes
**Risk level:** 🟢 VERY LOW

---

## 📝 Post-Implementation Notes

After implementing improvements:
1. Test all 3 animation variants in Storybook
2. Verify data-testid works in all 3 components
3. Verify no visual regression
4. Mark as "Stabilized" in component registry

---

## 🧪 Testing Strategy - ATOM Pattern

**Status:** ✅ IMPLEMENTED

All three Skeleton components follow the ATOM pattern:
- ✅ Accept data-testid via `React.HTMLAttributes<HTMLDivElement>`
- ✅ NO default testIds (consumer provides context)
- ✅ Props spread: `{...props}` enables data-testid
- ✅ JSDoc updated with ATOM pattern examples

**Usage:**
```tsx
// Consumer provides context-specific testIds
<Skeleton data-testid="profile-skeleton" />
<SkeletonImage data-testid="avatar-skeleton" />
<SkeletonText data-testid="description-skeleton" />

// In molecules (auto-generated by parent)
function ProfileCard({ user, testId }) {
  const baseTestId = testId || `profile-card-${user.id}`
  return (
    <div data-testid={baseTestId}>
      <SkeletonImage data-testid={`${baseTestId}-avatar`} />
      <SkeletonText data-testid={`${baseTestId}-bio`} />
    </div>
  )
}
```

**QA Benefits:**
- Predictable testIds in molecules (auto-generated)
- Flexible for atoms (consumer-provided)
- No "WithTestIds" stories needed (pattern is clear in JSDoc)

---

**Review Complete** ✅
**ATOM Pattern Implemented** ✅


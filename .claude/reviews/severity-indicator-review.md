# SeverityIndicator Component Review

**Date:** 2025-12-13
**Component:** SeverityIndicator (`src/components/ui/SeverityIndicator.tsx`)
**Reviewer:** AI Agent
**Status:** ⚠️ APPROVED with Safe Improvements + v3.0.0 Refactor Required

---

## 📊 Component Category

**Category:** Shared Primitive (App-Only)
- **Used in:** 2 files, 24 occurrences
- **Risk Level:** 🟡 MEDIUM - Used in Leads (production app)
- **Usage:** LeadCard, LeadsDataTable (priority indicators)

---

## ✅ Current State Assessment

### Strengths
1. ✅ **Well-structured types** - SeverityLevel exported, clear prop interface
2. ✅ **Excellent documentation** - JSDoc + Storybook stories
3. ✅ **Accessible** - role="img", aria-label, title attributes
4. ✅ **Size variants** - sm and md sizes
5. ✅ **Visual design** - Unique squircle shape, flame icon for critical
6. ✅ **Real usage** - Production component in Leads module
7. ✅ **Storybook** - Comprehensive stories (individual levels, sizes, context examples)

### Issues Found

#### 🔴 CRITICAL Issue (Cannot Fix in v2.x)

**Design Token Architecture Violation** (Lines 4, 36-80)
```typescript
// ❌ BAD: Direct import of Tier 1 PRIMITIVES
import { CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT } from '../../constants/designTokens'

// ❌ BAD: Hardcoded hex colors
textColor: '#FFFFFF',
severityConfig.none.fill = '#67E8F9'      // Line 78
severityConfig.none.stroke = '#A5F3FC'    // Line 79
severityConfig.none.textColor = '#06B6D4' // Line 80
```

**Why This is Critical:**
- Violates "zeroRawColors" policy
- ESLint error: "Direct import of Tier 1 PRIMITIVES is not allowed"
- Components should use ALIAS or MAPPED tokens only

**Why We Can't Fix in v2.x:**
- Requires creating new `ALIAS.severity` tokens
- Mapping existing ALIAS tokens would change colors (visual breaking change)
- Component is used in production Leads module
- NO BREAKING CHANGES allowed in v2.x

**Solution:** Mark for v3.0.0 refactor

---

#### 🟡 Minor Issues (Safe to fix)

1. **Hardcoded font family** (Line 192)
   ```typescript
   // Current
   fontFamily: 'Fixel Text, sans-serif'

   // Should use system fonts or omit (inherits from parent)
   ```

2. **Missing React display name**
   - Harder to debug in React DevTools

3. **No data-testid in JSDoc**
   - Missing testing examples for Playwright

---

## 🔧 Proposed Safe Improvements

### 1. Add React Display Name (SAFE)
**Impact:** Better debugging, no runtime change
**Risk:** 🟢 ZERO

```typescript
SeverityIndicator.displayName = "SeverityIndicator"
```

---

### 2. Add data-testid to JSDoc (SAFE)
**Impact:** Better DX, no runtime change
**Risk:** 🟢 ZERO

```typescript
/**
 * @example
 * ```tsx
 * // With data-testid for testing
 * <SeverityIndicator
 *   level="critical"
 *   data-testid="lead-priority-indicator"
 * />
 *
 * // In repeating lists
 * {leads.map(lead => (
 *   <SeverityIndicator
 *     level={lead.priority}
 *     data-testid={`lead-priority-${lead.id}`}
 *   />
 * ))}
 * ```
 */
```

---

### 3. Add data-testid Storybook Story (SAFE)
**Impact:** Testing documentation, no code change
**Risk:** 🟢 ZERO

```tsx
export const WithTestIds: Story = {
  render: () => (
    <div>
      <SeverityIndicator
        level="critical"
        data-testid="priority-critical"
      />
      {/* ... more examples */}
    </div>
  ),
}
```

---

### 4. Fix Font Family (SAFE - Optional)
**Impact:** Uses system fonts, minimal visual change
**Risk:** 🟡 LOW

**Option A: Remove fontFamily** (inherits from parent)
```typescript
// Remove fontFamily line entirely
// Uses inherited font-sans from Tailwind
```

**Option B: Use CSS variable**
```typescript
fontFamily: 'var(--font-sans)'
```

**Recommendation:** Remove fontFamily line (cleaner, inherits correctly)

---

## ❌ Breaking Changes to AVOID (v3.0.0 Only)

### 1. Fix Design Token Violation (BREAKING)

**Current:**
```typescript
import { CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT } from '../../constants/designTokens'

const severityConfig = {
  critical: { fill: CORAL[600], textColor: '#FFFFFF' },
  // ...
}
```

**Future v3.0.0 Fix:**
```typescript
import { ALIAS } from '../../constants/designTokens'

// Step 1: Add to designTokens.ts
export const ALIAS = {
  severity: {
    critical: { fill: CORAL[600], stroke: CORAL[200], text: PRIMITIVES.white },
    high: { fill: ORANGE[500], stroke: ORANGE[200], text: PRIMITIVES.white },
    medium: { fill: SUNRISE[500], stroke: ORANGE[200], text: PRIMITIVES.white },
    low: { fill: HARBOR[500], stroke: HARBOR[200], text: PRIMITIVES.white },
    none: { fill: DEEP_CURRENT[200], stroke: DEEP_CURRENT[100], text: DEEP_CURRENT[500] },
  },
}

// Step 2: Use in component
const severityConfig = {
  critical: {
    fill: ALIAS.severity.critical.fill,
    stroke: ALIAS.severity.critical.stroke,
    textColor: ALIAS.severity.critical.text,
    // ...
  },
}
```

**Why Breaking:**
- Refactors token architecture
- Requires design token system changes
- Risk of introducing visual regressions

**When to do:** v3.0.0 only

---

## 🎨 Design Token Compliance

**Status:** ❌ NOT COMPLIANT (Documented exception for v2.x)

**Violations:**
- ❌ Direct PRIMITIVES imports (CORAL, ORANGE, SUNRISE, HARBOR, DEEP_CURRENT)
- ❌ Hardcoded hex values (#FFFFFF, #67E8F9, #A5F3FC, #06B6D4)
- ❌ Should use ALIAS tokens

**Documented Exception:**
- Component pre-dates 3-tier token architecture
- Used in production (Leads module)
- Visual changes not allowed in v2.x
- **MARKED FOR v3.0.0 REFACTOR**

---

## 📋 Implementation Checklist

### Safe Improvements (Do Now)
- [ ] Add `SeverityIndicator.displayName = "SeverityIndicator"`
- [ ] Add data-testid examples to JSDoc
- [ ] Add data-testid Storybook story
- [ ] (Optional) Remove hardcoded fontFamily line
- [ ] Run `npm run typecheck`
- [ ] Run `npm run lint` (will still show PRIMITIVES error - document as known issue)
- [ ] Update CHANGELOG.md

### Document for v3.0.0
- [ ] Add to v3.0.0 refactor list in CHANGELOG
- [ ] Create designTokens.ts plan for ALIAS.severity tokens
- [ ] Mark as "Known Issue: Token Architecture" in review

---

## 🚀 Recommendation

**Proceed with SAFE improvements only:** ✅

All proposed changes are:
- ✅ Backwards compatible
- ✅ Non-breaking
- ✅ Improve DX (display name, testing docs)
- ✅ No visual changes
- ✅ No API changes

**Document token violation:** ⚠️ REQUIRED

- Add comment in component: "// TODO v3.0.0: Refactor to use ALIAS.severity tokens"
- Update CHANGELOG: "Known Issue: Design token architecture violation (to fix in v3.0.0)"
- ESLint will continue showing error - this is expected and documented

**Estimated effort:** 10 minutes (safe improvements only)
**Risk level:** 🟢 VERY LOW (no functional changes)

---

## 🔮 v3.0.0 Refactor Plan

### Step 1: Create ALIAS.severity tokens
Add to `src/constants/designTokens.ts`:
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
      fill: DEEP_CURRENT[200],
      stroke: DEEP_CURRENT[100],
      text: DEEP_CURRENT[500],
    },
  },
}
```

### Step 2: Update Component
```typescript
import { ALIAS } from '../../constants/designTokens'

const severityConfig: Record<SeverityLevel, SeverityConfig> = {
  critical: {
    fill: ALIAS.severity.critical.fill,
    stroke: ALIAS.severity.critical.stroke,
    textColor: ALIAS.severity.critical.text,
    // ...
  },
  // ... rest
}

// Remove lines 78-80 (hardcoded hex override)
```

### Step 3: Visual Regression Testing
- Test in Leads module
- Verify colors match exactly
- Check both sm and md sizes
- Test all 5 severity levels

---

## 📝 Post-Implementation Notes

After implementing safe improvements:
1. Verify display name in React DevTools
2. Test data-testid in Storybook story
3. Verify ESLint still shows PRIMITIVES error (expected)
4. Confirm no visual changes in Leads module
5. Update component registry status

---

**Review Complete** ✅ (with v3.0.0 refactor required)
**Safe Improvements Ready** ✅
**Token Violation Documented** ⚠️

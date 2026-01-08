# Efficiency Analysis Report

This report documents potential performance improvements identified in the disrupt-design-system codebase.

## Summary

| Issue | File | Impact | Status |
|-------|------|--------|--------|
| Missing throttle on resize | `useIsMobile.ts` | Medium | Fixed in PR |
| Stale closure in particle hook | `useMouseParticles.ts` | High | Documented |
| Missing throttle on scroll/resize | `ScrollFadeList.tsx` | High | Documented |
| Missing throttle on scroll/resize | `ScrollToTopButton.tsx` | Medium | Documented |
| Missing throttle on scroll/resize | `QuickFilter.tsx` | Medium | Documented |
| Missing throttle on resize | `TruncatedText.tsx` | Medium | Documented |

## Detailed Analysis

### 1. Missing Throttle on Resize Event (useIsMobile.ts)

**Location:** `src/hooks/useIsMobile.ts:26`

**Issue:** The `checkMobile` function is called directly on every resize event without any throttling. During window resize operations, this event can fire hundreds of times per second, causing unnecessary state updates and re-renders.

**Current Code:**
```typescript
window.addEventListener('resize', checkMobile)
```

**Impact:** Medium - Causes unnecessary state updates during resize operations, potentially affecting performance on lower-end devices.

**Recommended Fix:** Add requestAnimationFrame-based throttling to limit updates to once per frame (~60fps).

### 2. Stale Closure in Particle Hook (useMouseParticles.ts)

**Location:** `src/hooks/useMouseParticles.ts:68, 89`

**Issue:** The `handleMouseMove` callback includes `particles.length` in its dependency array, causing the callback to be recreated on every particle change. Additionally, the check `if (particles.length > MAX_ACTIVE_PARTICLES) return` may use a stale closure value.

**Current Code:**
```typescript
if (particles.length > MAX_ACTIVE_PARTICLES) return
// ...
}, [enabled, containerRef, particles.length])
```

**Impact:** High - The callback is recreated frequently (every time a particle is added/removed), and the particle count check may not reflect the current state.

**Recommended Fix:** Use a ref to track particle count or use functional state updates to avoid stale closures.

### 3. Missing Throttle on Scroll/Resize (ScrollFadeList.tsx)

**Location:** `src/components/ui/ScrollFadeList.tsx:100, 103`

**Issue:** The `calculateOpacity` function is called directly on every scroll and resize event without throttling. This is particularly problematic because it's called for EACH `ScrollFadeItem` in the list.

**Current Code:**
```typescript
window.addEventListener('scroll', calculateOpacity, { passive: true })
window.addEventListener('resize', calculateOpacity, { passive: true })
```

**Impact:** High - With many items in a ScrollFadeList, this can cause significant performance degradation during scrolling.

**Recommended Fix:** Add requestAnimationFrame throttling to the event handlers.

### 4. Missing Throttle on Scroll/Resize (ScrollToTopButton.tsx)

**Location:** `src/components/ui/ScrollToTopButton.tsx:21, 32-40`

**Issue:** Both `checkMobile` (resize) and `handleScroll` (scroll) are called directly without throttling.

**Impact:** Medium - Unnecessary function calls during resize and scroll operations.

**Recommended Fix:** Add requestAnimationFrame throttling to both handlers.

### 5. Missing Throttle on Scroll/Resize (QuickFilter.tsx)

**Location:** `src/components/ui/QuickFilter.tsx:74, 77, 436, 437`

**Issue:** Both `calculateOpacity` and `updateScrollState` are called directly on scroll and resize events without throttling.

**Impact:** Medium - Can cause performance issues when there are many QuickFilterItem components.

**Recommended Fix:** Add requestAnimationFrame throttling to the event handlers.

### 6. Missing Throttle on Resize (TruncatedText.tsx)

**Location:** `src/components/ui/table/TruncatedText.tsx:100`

**Issue:** The `checkTruncation` function performs DOM measurements (scrollWidth vs clientWidth) on every resize event without throttling.

**Impact:** Medium - If there are many TruncatedText components in a table, this can cause layout thrashing during resize.

**Recommended Fix:** Add requestAnimationFrame throttling to the resize handler.

## Implementation Notes

The recommended throttling pattern using requestAnimationFrame:

```typescript
const rafRef = useRef<number | null>(null)

const handleEvent = () => {
  if (rafRef.current !== null) {
    return
  }
  rafRef.current = requestAnimationFrame(() => {
    // Perform the actual work here
    rafRef.current = null
  })
}

// Cleanup in useEffect return
return () => {
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current)
  }
}
```

This pattern ensures that the handler only executes once per animation frame (~16ms at 60fps), significantly reducing the number of executions during rapid events like scrolling or resizing.

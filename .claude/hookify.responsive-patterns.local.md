---
name: responsive-patterns
enabled: false  # DEPRECATED: No action defined, was just info spam
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (sm:|md:|lg:|xl:|2xl:|grid-cols-)
---

## Responsive: Mobile-First

| Breakpoint | Width | Usage |
|------------|-------|-------|
| (default) | 0+ | Mobile base |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

```tsx
// ❌ Desktop-first
<div className="px-8 max-sm:px-4">

// ✅ Mobile-first
<div className="px-4 sm:px-6 lg:px-8">

// ✅ Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

Mobile: Touch ≥44px | Text ≥16px | No horizontal scroll

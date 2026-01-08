---
name: mobile-first
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (max-sm:|max-md:|max-lg:|max-xl:)
---

## Warning: Desktop-First Pattern Detected

**Not everything should be mobile-first.** Evaluate if this is intentional.

### Decision Matrix

| UI Type | Acceptable Strategy | `max-*` OK? |
|---------|---------------------|-------------|
| Simple lists, cards | Mobile-first | ❌ No |
| Dashboards, data tables | Tablet-first | ⚠️ Maybe |
| Form builders, entity templates | Desktop-only | ✅ Yes |
| Complex configuration UIs | Desktop-only | ✅ Yes |
| Drag-and-drop interfaces | Desktop-only | ✅ Yes |

### If Mobile-First IS Required

| Detected | Problem | Fix |
|----------|---------|-----|
| `max-sm:` | Desktop-first | Start mobile, add `sm:` |
| `max-md:` | Desktop-first | Start mobile, add `md:` |

```tsx
// ❌ Desktop-first (for simple content)
<div className="px-8 max-sm:px-4">

// ✅ Mobile-first
<div className="px-4 sm:px-6 lg:px-8">
```

### If Desktop-Only IS Intentional (complex UIs)

```tsx
// ✅ OK for form builders, entity templates, etc.
<div className="hidden lg:block">
  <ComplexConfigUI />
</div>
<div className="lg:hidden">
  <SimplifiedReadOnlyView />
  {/* Or: "Desktop required" message */}
</div>
```

### Mobile Fallback Options

1. **Simplified read-only view** - Show data but disable editing
2. **"Desktop required" message** - Clear UX for unsupported features
3. **Redirect to mobile-optimized page** - Alternative simplified flow

**Ref:** `.claude/skills/responsive-mobile-first.md`

# Variant Reduction Strategy

**Agent-only. Opinionated design system rules.**

---

## Core Rule

**Fewer variants = Consistent UI**

```
❌ 3 skeleton animations → consumers mix them → inconsistent UX
✅ 1 skeleton animation → every page looks the same
```

---

## Decision Framework

### When to ADD variant

```
ADD variant if:
├─ Semantically different (success vs error)
├─ Accessibility requires it
├─ Clear non-overlapping use cases
└─ Design system mandates distinction
```

### When to REJECT variant

```
REJECT variant if:
├─ Just "looks different" (cosmetic preference)
├─ Consumer-specific customization
├─ Overlaps existing variant's use case
└─ Would create inconsistency across app
```

---

## Variant Guidelines by Component

| Component | Allowed | Rejected |
|-----------|---------|----------|
| Button | default, destructive, outline, secondary, ghost, link | size="xs", custom colors |
| Badge | status variants (success, warning, error, info) | cosmetic variants |
| Skeleton | shimmer (default only) | wave, pulse |
| Input | default | colored, sizes |
| Card | default with shadow prop | bordered variants |

---

## Implementation Rules

1. **Default = Best Choice** - If consumer passes nothing, they get the best option
2. **Variants = Semantic** - Each variant has a clear semantic meaning (not cosmetic)
3. **Props over Variants** - Use props for size/spacing, variants for semantic differences
4. **Internal Flexibility** - Design system can have options; just don't expose all to consumers

---

## Example: Shadow Prop (Good Pattern)

```tsx
// Component exposes shadow levels
<Card shadow="sm">Data display</Card>
<Card shadow="elevated">Featured</Card>
<Card shadow="lg">Modal-like</Card>

// Why OK: Each level has semantic hierarchy meaning
// NOT cosmetic preference
```

---

## Anti-Patterns (REJECT if true)

| Signal | Action |
|--------|--------|
| "Some consumers want X" | Reject — not semantic |
| One-off design request | Reject — use composition |
| Same purpose as existing | Reject — redundant |
| No usage guidelines | Reject — undefined scope |

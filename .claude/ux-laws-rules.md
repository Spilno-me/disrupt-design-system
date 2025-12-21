# UX Laws Reference

**Source:** [lawsofux.com](https://lawsofux.com)

---

## Core Laws

| Law | Rule | Value |
|-----|------|-------|
| **Fitts** | Target size + distance | `min-h-11` (44px mobile) |
| **Hick** | Decision time ∝ options | 5-7 max |
| **Miller** | Working memory | 7±2 items |
| **Doherty** | Response time | <400ms or spinner |
| **Von Restorff** | Isolation effect | Primary = distinct |
| **Jakob** | Mental models | Follow conventions |

---

## Gestalt (Grouping)

| Principle | Meaning | Token |
|-----------|---------|-------|
| Proximity | Close = related | `gap-2` in, `gap-6` out |
| Similarity | Same = related | Consistent style |
| Common Region | Bounded = grouped | Cards, borders |
| Prägnanz | Simple preferred | Reduce noise |

---

## By Component

| Component | Laws | Requirements |
|-----------|------|--------------|
| **Button** | Fitts, Von Restorff | 44px touch, primary distinct |
| **Form** | Miller, Chunking | 5-7 fields, grouped sections |
| **Nav** | Hick, Serial Position | ≤7 items, key at start/end |
| **Modal** | Fitts, Cognitive Load | Reachable close, single purpose |
| **List** | Miller, Proximity | 7 visible, grouped items |
| **Loading** | Doherty, Zeigarnik | >400ms spinner, show progress |

---

## Tokens

```
Touch:    min-h-11 (44px) | min-h-8 (32px desktop)
Spacing:  gap-2 (in-group) | gap-6 (between) | gap-12 (sections)
Timing:   <100ms instant | >400ms spinner | >1s progress
```

---

## Red Flags

| Signal | Fix |
|--------|-----|
| >7 nav items | Progressive disclosure |
| Touch <44px | `min-h-11 min-w-11` |
| No loading | Skeleton/spinner |
| Wall of text | Chunk into sections |
| Same-style buttons | Visual hierarchy |
| >7 form fields | Multi-step |

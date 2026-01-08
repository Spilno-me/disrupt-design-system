---
name: ux-touch-targets
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<button[^>]*className="[^"]*(?:p-1|p-2|h-6|h-7|h-8|w-6|w-7|w-8)[^"]*"[^>]*>|className="[^"]*(?:p-1|p-2)[^"]*"[^>]*onClick)
---

## UX Warning: Small Touch Target

**Fitts's Law:** Interactive elements need minimum 44x44px touch area.

| Detected | Problem | Fix |
|----------|---------|-----|
| `p-1`, `p-2` on button | Too small | Add `min-h-11 min-w-11` |
| `h-8 w-8` button | 32px only | Use `h-11 w-11` (44px) |
| `p-1` with onClick | Tiny target | Use `p-3` minimum |

```tsx
// ❌ Detected - tiny touch target
<button className="p-1">X</button>
<button className="h-8 w-8">+</button>
<div className="p-2" onClick={fn}>

// ✅ Accessible touch targets
<button className="p-1 min-h-11 min-w-11">X</button>
<button className="h-11 w-11">+</button>
<button className="p-3" onClick={fn}>
```

**Ref:** `.claude/ux-laws-rules.md`

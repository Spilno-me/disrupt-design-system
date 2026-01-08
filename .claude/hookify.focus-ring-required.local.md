---
name: focus-ring-required
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<button|<Button|onClick=)[^>]*className="(?![^"]*focus:)[^"]*"
---

## Warning: Missing Focus Ring

**A11y Rule:** Interactive elements need visible focus indicators.

```tsx
// ❌ No focus styles
<button className="p-2 bg-surface">

// ✅ With focus ring
<button className="p-2 bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">

// ✅ Using focus-visible (better)
<button className="p-2 bg-surface focus-visible:ring-2 focus-visible:ring-accent">
```

**Standard focus classes:**
```
focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
```

**Why:** Keyboard users need to see which element is focused.

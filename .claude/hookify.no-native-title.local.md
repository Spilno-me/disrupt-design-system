---
name: no-native-title
enabled: true
event: file
action: warn  # Changed from block to warn - too many false positives
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: file_path
    operator: not_contains
    pattern: .stories.tsx
  - field: content
    operator: regex_match
    pattern: <(button|div|span|a|td|th)[^>]*\stitle=["'][^"']+["']
---

## Warning: Prefer Tooltip Over Native title

**CLAUDE.md Rule:** Always use shadcn Tooltip, never native `title`.

| Detected | Problem | Fix |
|----------|---------|-----|
| `title="..."` | Poor UX, no styling | Use `<Tooltip>` |

```tsx
// ❌ Blocked - native title
<button title="Delete item">X</button>
<Icon title="Settings" />

// ✅ Use Tooltip component
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

<Tooltip>
  <TooltipTrigger asChild>
    <button>X</button>
  </TooltipTrigger>
  <TooltipContent>Delete item</TooltipContent>
</Tooltip>
```

**Why:** Native title has poor UX (delayed, unstyled, no touch support).

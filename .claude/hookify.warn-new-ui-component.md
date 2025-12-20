---
name: warn-new-ui-component
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: ^src/components/ui/[^/]+\.tsx$
  - field: old_text
    operator: equals
    pattern: ""
action: warn
---

## Warning: New UI Component

**Pre-check:** Exists already? | Truly reusable?

**Component type → testId strategy:**

| Type | Example | testId |
|------|---------|--------|
| ATOM | Button, Badge | Accept via props spread |
| MOLECULE | LeadCard | Auto-generate from data |
| PAGE | Dashboard | Hardcode regions |

**Implementation checklist:**

```tsx
// 1. Use Radix for interactive
import * as Dialog from '@radix-ui/react-dialog'

// 2. Tokens only
className="bg-surface text-primary border-default rounded-lg"

// 3. Props spread for testId (ATOM)
interface Props extends React.HTMLAttributes<HTMLDivElement> {}
const Component = ({ ...props }: Props) => <div {...props} />

// 4. Variants via cva(), max 3-5
```

**Variant limits:** sizes ≤3, states ≤5, animations =1

**After:** Add story + update `agent-context.json` registry

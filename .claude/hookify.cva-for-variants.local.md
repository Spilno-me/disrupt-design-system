---
name: cva-for-variants
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (variant|size)\s*===?\s*['"][^'"]+['"].*className
---

## Warning: Use CVA for Variants

**Conditional className logic should use class-variance-authority.**

```tsx
// ❌ Manual variant logic
const Button = ({ variant }) => (
  <button className={
    variant === 'primary' ? 'bg-accent text-white' :
    variant === 'secondary' ? 'bg-surface text-primary' :
    'bg-transparent'
  }>
)

// ✅ Use CVA
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center rounded-lg font-medium',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-white',
        secondary: 'bg-surface text-primary',
        ghost: 'bg-transparent hover:bg-muted-bg',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

**Why:** Type-safe, composable, consistent pattern across DDS.

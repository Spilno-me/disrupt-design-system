---
name: component-api-limits
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.(tsx|ts)$
  - field: new_text
    operator: regex_match
    pattern: interface.*Props
---

## Component API Limits

| Constraint | Limit | Action |
|------------|-------|--------|
| Total props | ≤7 | Split component |
| Boolean props | ≤2 | Use `variant` enum |
| Icon props | 0 | Use `children` |

```tsx
// ❌ Over-configured (8 props, 4 booleans)
interface ButtonProps {
  variant; size; disabled; loading;
  leftIcon; rightIcon; fullWidth; rounded;
}

// ✅ Composable (4 props)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: ReactNode;
}
```

Ref: `.claude/component-dev-rules.md`

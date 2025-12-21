---
name: typescript-strictness
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.(tsx|ts)$
  - field: new_text
    operator: regex_match
    pattern: (:\s*any|as\s+any|<any>|Record<string,\s*any>)
---

## TypeScript: No `any`

| Pattern | Fix |
|---------|-----|
| `: any` | Specific type or `unknown` |
| `as any` | Fix source type |
| `Record<string, any>` | `Record<string, unknown>` |

```tsx
// ❌ Blocked
const data: any = fetch();
const x = value as any;

// ✅ Type-safe
const data: unknown = fetch();
const x = value as SpecificType;

// Events
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
```

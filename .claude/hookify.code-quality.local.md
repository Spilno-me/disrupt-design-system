---
name: code-quality
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.(tsx?|jsx?)$
  - field: content
    operator: regex_match
    pattern: (:\s*any(?![a-zA-Z])|as\s+any(?![a-zA-Z])|<any>|<div\s+onClick(?!=)|<span\s+onClick(?!=)|console\.(log|debug|info)\()
---

## Code Quality Issue Detected

**Detected one of:**

| Pattern | Problem | Fix |
|---------|---------|-----|
| `: any` | Type unsafe | Use specific type or `unknown` |
| `as any` | Type bypass | Fix source type |
| `<div onClick>` | Inaccessible | Use `<button>` |
| `<span onClick>` | No semantics | Use `<button>` |
| `console.log` | Debug code | Remove before commit |

### Quick Fixes:

```tsx
// TypeScript
const data: any = ...     // ❌
const data: unknown = ... // ✅

// Accessibility
<div onClick={fn}>        // ❌
<button onClick={fn}>     // ✅

// Debugging
console.log(x)            // ❌ Remove
console.error('Error:', e) // ✅ OK for errors
```

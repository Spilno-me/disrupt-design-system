---
name: mdx-color-span-wrapper
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.mdx$
  - field: new_text
    operator: regex_match
    pattern: style=\{\{[^}]*color:
---

## MDX Color Bug - Wrap Text in Span

Storybook CSS overrides inline `color:` unless text is wrapped.

```jsx
// ❌ Color overridden by Storybook
<div style={{ color: PRIMITIVES.white }}>Text</div>

// ✅ Span prevents override
<div style={{ color: PRIMITIVES.white }}>
  <span style={{ color: PRIMITIVES.white }}>Text</span>
</div>
```

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

## MDX Inline Color Bug - Use Span Wrapper

You're adding inline `color:` styles in an MDX file.

**Storybook's CSS will override your color** unless you wrap text in `<span>`.

```jsx
// ❌ WRONG - color will be overridden by Storybook CSS
<div style={{ color: PRIMITIVES.white }}>Text</div>
<code style={{ color: ABYSS[500] }}>Code text</code>

// ✅ CORRECT - span prevents Storybook override
<div style={{ color: PRIMITIVES.white }}>
  <span style={{ color: PRIMITIVES.white }}>Text</span>
</div>
<code style={{ color: ABYSS[500] }}>
  <span style={{ color: ABYSS[500] }}>Code text</span>
</code>
```

### Why This Happens

1. Storybook's MDX processor wraps content in `<p>` tags
2. Storybook CSS applies `colorPrimary` to those elements
3. CSS cascade overrides your inline styles on parent elements

### Quick Fix

Always wrap visible text in `<span>` with the same color style.

See: CLAUDE.md § "MDX Text Color Bug (CRITICAL)"

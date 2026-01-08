---
name: semantic-html
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<div[^>]*>\s*(Copyright|©|Footer|Header|Navigation|Nav|Menu|Main|Article|Section|Aside|Search)|<div[^>]*role=["'](navigation|banner|main|contentinfo|search)["'])
---

## Warning: Use Semantic HTML Element

**Content suggests semantic element, not `<div>`.**

| Content/Role | Use Instead |
|--------------|-------------|
| Navigation, Menu | `<nav>` |
| Header, Banner | `<header>` |
| Footer, Copyright | `<footer>` |
| Main content | `<main>` |
| Article | `<article>` |
| Sidebar | `<aside>` |
| Section | `<section>` |

```tsx
// ❌ Div with role
<div role="navigation">...</div>
<div>© 2024 Company</div>

// ✅ Semantic HTML
<nav>...</nav>
<footer>© 2024 Company</footer>
```

**Why:** Better accessibility, SEO, and code readability.

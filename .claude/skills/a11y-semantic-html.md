# Fix Accessibility Issues



**Category:** ux | **Tags:** accessibility, a11y, semantic, mcp, maya
**Variables:** `{COMPONENT}`

---

Fix accessibility in {COMPONENT}.

## MAYA Mindset
- Semantic HTML uses browser conventions users already know
- Screen reader expectations are established patterns—respect them
- Accessible = familiar to assistive technology users

## MCP Contrast Verification (REQUIRED for WCAG)
```
// Check text contrast on backgrounds
mcp__dds__check_contrast({ background: "bg-surface", foreground: "text-primary" })
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "SLATE[200]" })

// Find accessible color combinations
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "white", minLevel: "AAA" })

// Get guidance for specific contexts
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
```

READ: `.claude/hookify.accessibility-enforcement.md`

Replace These Patterns:
| Bad | Fix |
|-----|-----|
| `<div onClick>` | `<button>` |
| `<span onClick>` | `<button>` |
| `role="button"` | `<button>` |
| `tabIndex={0}` workaround | Semantic element |

For Complex Interactions → Use Radix:
```tsx
// ✅ Radix handles a11y
<Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
```

Requirements:
- Focus visible: `focus:ring-2 focus:ring-accent`
- Contrast: Verify with MCP (4.5:1 AA, 7:1 AAA)
- Touch targets: min 44px (`min-h-11`)
- Labels: All inputs need labels

OUTPUT: Accessible component with semantic HTML + MCP contrast verification results.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*

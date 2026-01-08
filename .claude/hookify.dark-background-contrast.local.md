---
name: dark-background-contrast
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?|mdx)$
  - field: content
    operator: regex_match
    pattern: (ABYSS\[(7|8|9)\d{2}\]|DEEP_CURRENT\[(7|8|9)\d{2}\]|bg-dark|bg-inverse|bg-\[var\(--brand-(abyss|deep-current)-(7|8|9)\d{2}\)\]|background.*#0[0-4])
---

## ⚠️ Dark Background Detected - Verify Contrast

**What was detected:** Dark background color (ABYSS/DEEP_CURRENT 700-900 range)

### MANDATORY: Check text contrast before proceeding

| Background | Minimum Text | WCAG |
|------------|--------------|------|
| ABYSS[700-900] | `SLATE[100-200]` or `white` | 4.5:1 AA |
| DEEP_CURRENT[700-900] | `DEEP_CURRENT[50-200]` or `white` | 4.5:1 AA |

### Quick Contrast Check:
```
Use MCP: mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "SLATE[300]" })
```

### Common Mistakes:
| ❌ Fails | ✅ Passes |
|----------|----------|
| `SLATE[300]` on `ABYSS[900]` (~5:1 borderline) | `SLATE[200]` on `ABYSS[900]` (~7:1) |
| `ABYSS[300]` on `ABYSS[800]` (invisible) | `white` on `ABYSS[800]` (~12:1) |
| `DEEP_CURRENT[300]` on `DEEP_CURRENT[800]` | `DEEP_CURRENT[100]` on `DEEP_CURRENT[800]` |

### Same-Family Rule:
**Never use same color family for both background AND text** (e.g., ABYSS on ABYSS)

**Ref:** `.claude/css-styling-rules.md`, `src/data/contrast-matrix.json`

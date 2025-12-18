---
name: enforce-color-contrast
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(mdx|tsx|jsx)$
  - field: new_text
    operator: regex_match
    pattern: color:\s*[A-Z_]+\[|background:\s*[A-Z_]+\[|PRIMITIVES\.|ABYSS\[|DEEP_CURRENT\[|DUSK_REEF\[|SLATE\[|CORAL\[|bg-[a-z]|text-[a-z]
---

## COLOR CONTRAST CHECK REQUIRED

You are writing color combinations. **Before proceeding, verify contrast compliance.**

### Quick Reference (from `.claude/color-matrix.json`)

| Background | Required Text Color |
|------------|---------------------|
| `ABYSS[400-900]` (dark) | `PRIMITIVES.white` or `SLATE[300]` |
| `ABYSS[50-200]` (light) | `ABYSS[500]` |
| `DEEP_CURRENT[500+]` | `PRIMITIVES.white` |
| `DUSK_REEF[500+]` | `PRIMITIVES.white` |
| `PRIMITIVES.white/cream` | `ABYSS[500]` |
| `SLATE[50-200]` | `ABYSS[500]` or `DUSK_REEF[500]` |

### WCAG Ratios (from `.claude/contrast-matrix.json`)

- **Text**: 4.5:1 minimum
- **Large text (18pt+)**: 3.0:1 minimum
- **UI components/icons**: 3.0:1 minimum

### Common Failures

```
ABYSS[500] text on ABYSS[500] bg = 1:1 (INVISIBLE!)
ABYSS[400] text on ABYSS[500] bg = ~1.5:1 (FAIL)
DUSK_REEF[500] text on DUSK_REEF[600] bg = ~1.3:1 (FAIL)
```

### Golden Rule

**Same color family on itself = BAD CONTRAST**

If you haven't consulted `.claude/color-matrix.json` for this edit, do so now.

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

## Color Contrast Check

**WCAG minimums:** Text 4.5:1 | Large text/icons 3.0:1

| Background | Use |
|------------|-----|
| `ABYSS[400-900]` | `PRIMITIVES.white` or `SLATE[300]` |
| `ABYSS[50-200]` | `ABYSS[500]` |
| `DEEP_CURRENT[500+]` | `PRIMITIVES.white` |
| `DUSK_REEF[500+]` | `PRIMITIVES.white` |
| `white/cream` | `ABYSS[500]` |
| `SLATE[50-200]` | `ABYSS[500]` or `DUSK_REEF[500]` |

**Golden rule:** Same family on itself = INVISIBLE

```
ABYSS[500] on ABYSS[500] = 1:1 (FAIL)
ABYSS[400] on ABYSS[500] = ~1.5:1 (FAIL)
```

Consult `.claude/color-matrix.json` if unsure.

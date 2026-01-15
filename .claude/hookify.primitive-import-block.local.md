---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/enforcement.yaml
# Rule: primitive-import-block
# Scope: projects
# Generated: 2026-01-15T11:58:39.455Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: primitive-import-block
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: file_path
    operator: not_regex_match
    pattern: (tailwind-preset\.js|designTokens\.ts|ColorPalette\.stories\.tsx|tokens\.css)
  - field: content
    operator: regex_match
    pattern: import\s+\{[^}]*(PRIMARY|ERROR|SAGE|TEAL|SECONDARY|TERTIARY|INFO|WARNING|ACCENT|SUCCESS|NEUTRAL|PRIMITIVES)[^}]*\}\s+from\s+['"]@
---

🚫 **Primitive import blocked.** Use Tailwind classes (`text-primary`) or `ALIAS` for dynamic values. Never import PRIMITIVES directly.

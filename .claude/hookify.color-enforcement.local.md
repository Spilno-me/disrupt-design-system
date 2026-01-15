---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/enforcement.yaml
# Rule: color-enforcement
# Scope: projects
# Generated: 2026-01-15T11:58:39.455Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: color-enforcement
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?|css)$
  - field: file_path
    operator: not_regex_match
    pattern: (designTokens\.ts|tailwind-preset\.js|generate-tokens|ColorPalette\.stories\.tsx|tokens\.css|styles\.css|project-registry\.ts|token-resolver\.ts|persistence\.ts)
  - field: content
    operator: regex_match
    pattern: (#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}(?![0-9A-Fa-f])|rgb\(|rgba\(|(bg|text|border)-(neutral|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d)
---

🚫 **Raw color blocked.** Use tokens: `text-primary`, `bg-surface`, `border-default`. Priority: semantic → contextual → primitive.

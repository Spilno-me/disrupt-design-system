---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: no-inline-styles
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: no-inline-styles
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: file_path
    operator: not_contains
    pattern: .stories.tsx
  - field: content
    operator: regex_match
    pattern: style=\{\{[^}]*(padding|margin|width|height|fontSize|color|background)[^}]*\}\}
---

⚠️ **Inline style detected.** Use Tailwind: `p-4` not `style={{ padding: '16px' }}`. Exception: CSS variables.

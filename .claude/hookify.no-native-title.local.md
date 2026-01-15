---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/enforcement.yaml
# Rule: no-native-title
# Scope: projects
# Generated: 2026-01-15T11:58:39.456Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: no-native-title
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?)$
  - field: content
    operator: regex_match
    pattern: \s+title=["'][^"']+["']
  - field: content
    operator: not_regex_match
    pattern: (<title>|DialogTitle|AlertDialogTitle)
---

🚫 **Native title blocked.** Use `<Tooltip>` component for accessibility. Native title fails on touch devices and screen readers.

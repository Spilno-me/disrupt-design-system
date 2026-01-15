---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/enforcement.yaml
# Rule: no-important
# Scope: projects
# Generated: 2026-01-15T11:58:39.456Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: no-important
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.(tsx?|jsx?|css)$
  - field: content
    operator: regex_match
    pattern: "!important"
---

🚫 **!important blocked.** Fix specificity instead. Use Tailwind `!` prefix (`!text-error`) only if needed.

---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: focus-ring-required
# Scope: projects
# Generated: 2026-01-15T11:58:39.464Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: focus-ring-required
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<button|<Button|<a\s+href)
  - field: content
    operator: not_regex_match
    pattern: (focus:ring|focus-visible:ring|focus:outline)
---

⚠️ **A11y:** Add focus ring for keyboard navigation: `focus:ring-2 focus:ring-accent focus:ring-offset-2`

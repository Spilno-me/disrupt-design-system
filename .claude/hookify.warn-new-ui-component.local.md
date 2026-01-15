---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: warn-new-ui-component
# Scope: projects
# Generated: 2026-01-15T11:58:39.467Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: warn-new-ui-component
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/[A-Z].*\.tsx$
  - field: content
    operator: regex_match
    pattern: export\s+(const|function)\s+[A-Z]
---

⚠️ **New UI component.** Did you check for existing components? Search `src/components/ui/` first.

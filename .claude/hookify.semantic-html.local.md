---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: semantic-html
# Scope: projects
# Generated: 2026-01-15T11:58:39.464Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: semantic-html
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<div\s+onClick(?!=)|<span\s+onClick(?!=))
---

⚠️ **A11y:** Use `<button>` instead of `<div onClick>`. Semantic HTML provides keyboard support.

---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: import-hygiene
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: import-hygiene
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx?$
  - field: content
    operator: regex_match
    pattern: from\s+['"]\.\./\.\./\.\./
---

⚠️ **Deep import detected.** Use path alias: `@/components/ui/Button` not `../../../components/ui/Button`

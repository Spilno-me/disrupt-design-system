---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: mobile-first
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: mobile-first
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (max-sm:|max-md:|max-lg:|max-xl:)
---

⚠️ **Desktop-first pattern.** Use mobile-first (`sm:`, `lg:`) unless intentional for complex dashboards.

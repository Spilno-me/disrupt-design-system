---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: story-infrastructure
# Scope: projects
# Generated: 2026-01-15T11:58:39.467Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: story-infrastructure
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.stories\.tsx$
  - field: content
    operator: not_regex_match
    pattern: (ATOM_META|MOLECULE_META|ORGANISM_META|PAGE_META|satisfies\s+Meta)
---

⚠️ **Use story meta pattern.** Import `ATOM_META` from `@/test/storybook-helpers` and use `satisfies Meta`.

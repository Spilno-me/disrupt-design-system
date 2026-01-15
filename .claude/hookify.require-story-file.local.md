---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: require-story-file
# Scope: projects
# Generated: 2026-01-15T11:58:39.467Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: require-story-file
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/[A-Z][^/]+\.tsx$
  - field: file_path
    operator: not_regex_match
    pattern: (\.stories\.|\.test\.|index\.tsx)
---

⚠️ **Story file needed.** Every UI component needs a `.stories.tsx` file for documentation.

---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: no-arbitrary-values
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: no-arbitrary-values
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (w-\[|h-\[|p-\[|m-\[|gap-\[|text-\[|top-\[|left-\[|right-\[|bottom-\[)
---

🚫 **Arbitrary value blocked.** Use tokens: `w-48` not `w-[200px]`, `gap-4` not `gap-[15px]`.

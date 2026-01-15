---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: cva-for-variants
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: cva-for-variants
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/ui/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (variant|size)\s*===?\s*['"][^'"]+['"].*className
---

⚠️ **Use CVA for variants.** Replace `variant === 'x' ? ...` with `cva()` from class-variance-authority.

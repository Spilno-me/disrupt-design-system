---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: dark-background-contrast
# Scope: projects
# Generated: 2026-01-15T11:58:39.467Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: dark-background-contrast
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (bg-accent|bg-primary|bg-error|bg-dark|bg-slate-[789]|bg-gray-[789]|bg-neutral-[789])
  - field: content
    operator: not_regex_match
    pattern: text-(white|primary-foreground|accent-foreground)
---

⚠️ **Dark bg needs light text.** Use `text-accent-foreground` or `text-white` on dark backgrounds.

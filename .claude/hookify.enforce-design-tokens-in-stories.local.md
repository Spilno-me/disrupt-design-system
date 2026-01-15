---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: enforce-design-tokens-in-stories
# Scope: projects
# Generated: 2026-01-15T11:58:39.468Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: enforce-design-tokens-in-stories
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.stories\.tsx$
  - field: content
    operator: regex_match
    pattern: (bg|text|border)-(red|blue|green|gray|slate|zinc)-\d
---

⚠️ **Raw Tailwind color in story.** Use semantic tokens: `bg-surface`, `text-primary`. Stories should demonstrate token usage.

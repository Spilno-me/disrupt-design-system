---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: ux-touch-targets
# Scope: projects
# Generated: 2026-01-15T11:58:39.464Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: ux-touch-targets
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/components/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (<button[^>]*className="[^"]*(?:p-1|p-2|h-6|h-7|h-8|w-6|w-7|w-8)[^"]*"[^>]*>|className="[^"]*(?:p-1|p-2)[^"]*"[^>]*onClick)
---

⚠️ **Fitts's Law:** Touch targets need min 44x44px. Add `min-h-11 min-w-11` to small interactive elements.

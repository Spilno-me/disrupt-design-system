---
# AUTO-GENERATED from Salvador Vault
# Source: chains/rules/projects/quality.yaml
# Rule: async-state-handling
# Scope: projects
# Generated: 2026-01-15T11:58:39.465Z
#
# Do NOT edit manually - regenerate with: npm run sync-hooks
name: async-state-handling
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.tsx$
  - field: content
    operator: regex_match
    pattern: (useQuery|useMutation|fetch\(|await\s+)
  - field: content
    operator: not_regex_match
    pattern: (isLoading|isPending|isError|error|loading|LoadingSpinner|Skeleton)
---

⚠️ **Handle all async states:** loading (`<Skeleton>`), error (`<ErrorMessage>`), empty (`<EmptyState>`), success.

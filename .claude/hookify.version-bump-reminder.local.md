---
name: version-bump-reminder
enabled: false  # DEPRECATED: Use commit-quality instead
event: PreToolUse
conditions:
  - field: tool_name
    operator: equals
    pattern: Bash
  - field: command
    operator: regex_match
    pattern: git commit
action: warn
---

## Reminder: Check Version Bump & Documentation

**Before committing, verify:**

| Change Type | Version Bump | Files to Update |
|-------------|--------------|-----------------|
| New component | MINOR (2.x.0) | package.json, changelog.json, agent-context.json |
| New feature/export | MINOR (2.x.0) | package.json, changelog.json |
| Breaking change | MAJOR (3.0.0) | package.json, changelog.json, v3-breaking-changes.md |
| Bug fix | PATCH (2.x.x) | package.json, changelog.json |
| Architecture change | MINOR+ | package.json, changelog.json, CLAUDE.md |

**Checklist:**
1. [ ] `package.json` version bumped?
2. [ ] `.claude/changelog.json` updated?
3. [ ] `.claude/agent-context.json` registry updated (if new components)?
4. [ ] `CLAUDE.md` updated (if new rules/patterns)?
5. [ ] Breaking changes documented in `v3-breaking-changes.md`?

**SemVer Rules:**
```
MAJOR: Breaking changes (remove/rename exports, change signatures)
MINOR: New features, new exports, backwards-compatible additions
PATCH: Bug fixes, documentation, internal refactors
```

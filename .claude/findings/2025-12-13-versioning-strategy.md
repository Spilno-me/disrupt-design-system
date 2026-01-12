# Versioning Strategy to Prevent Breaking Changes

**Date:** 2025-12-13
**Category:** versioning
**Severity:** critical
**Status:** active

---

## Problem

No versioning strategy. Risk of breaking consumer apps with refactors in minor versions (e.g., DataTable API change in v2.4.0 breaks all users).

---

## Solution

Implemented semantic versioning rules:
- v2.x = NO breaking changes (add features only)
- v3.0.0 = All breaking changes together
- PATCH = bug fix, MINOR = new feature, MAJOR = breaking

Added to: `agent-context.json` → `criticalRules.versioning`

---

## Prevention

- [x] Added versioning rules to agent-context.json
- [x] Created CHANGELOG.md
- [x] Updated CLAUDE.md with redirect to JSON
- [x] Added SessionStart hookify reminder
- [ ] Add API compatibility tests (future)

---

## Agent Action

**When editing components:**
- Check: Is this backwards compatible?
- Breaking (rename/remove/change props)? → STOP → v3.0.0 only
- Safe (optional prop/bugfix)? → MINOR/PATCH → Proceed
- Query: `jq '.quickLookup.isBreaking' .claude/agent-context.json`

**When bumping version:**
- PATCH: Bug fix (2.3.1 → 2.3.2)
- MINOR: New feature (2.3.1 → 2.4.0)
- MAJOR: Breaking (2.3.1 → 3.0.0) [NOT NOW]
- Always: Update CHANGELOG.md

---

## Tags

#versioning #breaking-changes #semver #v3.0.0 #api-stability #critical

---

## Related

- Files: `agent-context.json`, `CHANGELOG.md`, `CLAUDE.md`
- Rules: `agent-context.json` → `criticalRules.versioning`

# Missing Component Exports - Audit

**Date:** 2025-12-13
**Category:** export
**Severity:** high
**Status:** active

---

## Problem

27 components exist but NOT exported from `src/index.ts`. 4 HIGH priority documented in CLAUDE.md but inaccessible: NotificationsPanel, QuickFilter, DropdownMenu, Tabs.

---

## Solution

Conducted audit. Categorized missing exports:
- HIGH (4): NotificationsPanel, QuickFilter, DropdownMenu, Tabs
- MEDIUM (7): Base Wizard components
- REVIEW (11): Partner/Invoice components

Added to: `component-registry.json` with `exported: false` flag

---

## Prevention

- [x] Created component-registry.json with export status
- [x] Added "Component Export Status" to CLAUDE.md
- [x] Documented missing exports in agent-context.json
- [x] Hookify reminds on component creation
- [ ] Add export validation tests (future)

---

## Agent Action

**When creating component:**
- Check: `jq '.ui.ComponentName' .claude/component-registry.json`
- If exists → Use it. If not → Create
- Export from: `src/index.ts` + types + sub-components + hooks
- Update: `component-registry.json` + `CLAUDE.md`
- Version: MINOR bump

**When editing exports:**
- Check missing: `jq '.components.exports.missing' .claude/agent-context.json`
- Export: Component, Types, Sub-components, Hooks
- Update: CLAUDE.md Component Export Status

---

## Tags

#export #public-api #components #dx #missing-exports #audit

---

## Related

- Files: `src/index.ts`, `component-registry.json`, `agent-context.json`
- Missing: NotificationsPanel, QuickFilter, DropdownMenu, Tabs
- Query: `jq '.ui | to_entries | map(select(.value.exported == false))' component-registry.json`

# DDS - Agent Context

**Agent-only. Optimized for speed.**

---

## 🚀 READ THESE FILES (5 seconds)

1. `.claude/agent-context.json` (100 lines) ⭐ MASTER FILE
2. `.claude/component-registry.json` (200 lines) ⭐ COMPONENT LOOKUP
3. `.claude/findings/index.json` (150 lines) ⭐ LESSONS LEARNED

**Total: ~450 lines JSON = 5-second load ⚡**

---

## Quick Reference (From JSON)

### Versioning (agent-context.json → criticalRules.versioning)
```
NO breaking changes until v3.0.0
Breaking: rename/remove props, change types, change defaults
Safe: add optional props, new components, bug fixes
Version: 2.3.1 → 2.4.0 (MINOR)
```

### Tokens (agent-context.json → criticalRules.tokens)
```
ZERO raw colors: NO #hex, rgb(), bg-blue-500, text-gray-600
Use: ALIAS.text.primary OR bg-surface (semantic Tailwind)
```

### Exports (agent-context.json → criticalRules.exports)
```
Two-level: component/index.ts + src/index.ts
Missing: NotificationsPanel, QuickFilter, DropdownMenu, Tabs
Export: component + types + sub-components + hooks
```

### Git
```
NO Claude attribution
Format: feat:|fix:|chore:|refactor:|docs:
```

---

## Workflows (agent-context.json → workflow)

### editComponent
```
1. Backwards compatible check
2. Breaking? → STOP → v3.0.0
3. Safe? → Update CHANGELOG
```

### createComponent
```
1. Check component-registry.json (exists?)
2. Radix UI for interactive
3. ALIAS or semantic Tailwind
4. Export from src/index.ts + types
5. MINOR bump
```

### refactorComponent
```
1. API changes? → BREAKING → v3.0.0
2. Internal only? → SAFE → Proceed
```

### bumpVersion
```
1. PATCH|MINOR|MAJOR
2. MAJOR → v3.0.0 only
3. Update CHANGELOG
```

---

## Fast Queries

```bash
jq '.workflow.editComponent' .claude/agent-context.json
jq '.ui.ComponentName' .claude/component-registry.json
jq '.quickLookup.isBreaking' .claude/agent-context.json
jq '.components.exports.missing' .claude/agent-context.json
```

---

## Component Registry Quick Check

**Exported:** Button, Input, Dialog, Card, Select, DataTable, Form, Badge, Skeleton, Tooltip, Separator, Slider, Header, AppHeader, AppSidebar, AppFooter, LoginForm, ErrorState, SeverityIndicator

**Missing (HIGH):** NotificationsPanel, QuickFilter, DropdownMenu, Tabs

**Query:** `jq '.ui' .claude/component-registry.json`

---

## Breaking vs Safe

**Breaking (v3.0.0 ONLY):**
- Rename props
- Remove props
- Change prop types
- Change defaults
- Remove exports

**Safe (v2.x OK):**
- Add optional props (with defaults)
- Add new components
- Fix bugs (no API change)
- Add variants
- Deprecate (keep working)

---

## Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run storybook
```

---

**DO NOT read below. All info is in JSON files above.** ⚠️

---

## [DEPRECATED - For migration reference only]

This section preserved for historical context during v2 → v3 migration.
All active rules are in JSON files above.

<details>
<summary>Old verbose guidelines (click to expand - not needed for agents)</summary>

[Previous CLAUDE.md content preserved here for reference during migration]
[Will be removed in v3.0.0]

</details>

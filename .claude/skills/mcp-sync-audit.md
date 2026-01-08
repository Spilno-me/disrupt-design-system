# Audit & Sync MCP Server Data



**Category:** mcp | **Tags:** mcp, sync, audit, maintenance, drift
**Read first:** `.claude/agent-context.json`

---

Audit MCP server data for drift from actual codebase.

## MCP Data Architecture

The MCP server reads from these data files:

| File | Content | Location |
|------|---------|----------|
| `agent-context.json` | Component registry, tokens, philosophy | `.claude/` |
| `color-matrix.json` | Color categories and rules | `.claude/` |
| `contrast-matrix.json` | WCAG contrast data | `.claude/` |
| `color-intelligence.json` | Color harmony, contexts | `src/data/` |

## Step 1: Component Registry Drift Check

```bash
# Count actual components (no stories)
ls src/components/ui/*.tsx | grep -v stories | wc -l

# Count registered components
cat .claude/agent-context.json | jq '.components.registry.ui | keys | length'

# List unregistered components
ls src/components/ui/*.tsx | grep -v stories | xargs -I{} basename {} .tsx | sort > /tmp/actual.txt
cat .claude/agent-context.json | jq -r '.components.registry.ui | keys[]' | sort > /tmp/registered.txt
comm -23 /tmp/actual.txt /tmp/registered.txt
```

## Step 2: For Each Unregistered Component

Read the component file and extract:
1. **Type**: Look for ATOM/MOLECULE/ORGANISM in JSDoc
2. **Status**: Look for @status tag or STABILIZED/FROZEN/TODO
3. **Variants**: Look for CVA variants or union types
4. **Subs**: Look for compound component pattern (ComponentName.Sub)
5. **Features**: Key capabilities from JSDoc

Template for new component entry:
```json
"{ComponentName}": {
  "path": "ui/{filename}.tsx",
  "type": "ATOM|MOLECULE|ORGANISM",
  "status": "TODO|STABILIZED|FROZEN",
  "testId": "TODO|ready|N/A",
  "variants": ["variant1", "variant2"],
  "subs": ["Sub1", "Sub2"],
  "features": ["feature1", "feature2"],
  "for": "Brief description of use case"
}
```

## Step 3: Add to agent-context.json

Location: `.claude/agent-context.json` → `components.registry.ui`

```bash
# After manual edits, validate
npm run health  # Runs all validators
```

## Step 4: Color Data Sync

```bash
# Regenerate color matrix from tokens
npm run sync:colors

# Regenerate contrast matrix
npm run sync:colors  # Same command

# Regenerate color intelligence types
npm run sync:color-intelligence
```

## Step 5: Full Sync

```bash
# Sync everything
npm run sync:all

# Validate
npm run health
```

## Sync Scripts Reference

| Command | What It Syncs |
|---------|---------------|
| `npm run sync-components` | Component status from JSDoc (UPDATE only) |
| `npm run sync:colors` | Color matrix + contrast matrix |
| `npm run sync:color-intelligence` | color-intelligence.toon + types |
| `npm run sync:prompts` | Prompt library → skill files |
| `npm run sync:all` | All of the above |

## KNOWN LIMITATION

⚠️ `sync-components` only UPDATES existing entries - it does NOT add new components.
New components must be manually added to `.claude/agent-context.json`.

## Drift Prevention Checklist

When adding a new component:
- [ ] Create component file in `src/components/ui/`
- [ ] Add JSDoc with @component type and @status
- [ ] **MANUALLY** add entry to `.claude/agent-context.json`
- [ ] Run `npm run sync-components` to sync status
- [ ] Run `npm run health` to validate

## Expected Coverage

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Registry coverage | >90% | 70-90% | <70% |
| Status accuracy | 100% | >95% | <95% |
| Last sync | <7 days | 7-14 days | >14 days |

OUTPUT: Drift report + sync actions taken.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*

# @dds/mcp Roadmap

**Goal:** Make AI agents follow DDS rules precisely every time for:
1. **DDS Component Development** - Building components within the design system
2. **Consumer Integration** - Using DDS components in real applications

---

## Phase 1: Foundation ✅ COMPLETE

**Status:** Shipped  
**Tools:** 6

| Tool | Purpose |
|------|---------|
| `get_component` | Component metadata lookup |
| `search_components` | Component discovery |
| `get_design_tokens` | Token value reference |
| `get_color_guidance` | Color usage rules |
| `check_token_usage` | Token validation |
| `get_design_philosophy` | Wu Wei + MAYA principles |

**Outcome:** AI can query DDS knowledge and validate tokens.

---

## Phase 2: Validation & Patterns 🎯 NEXT

**Goal:** Proactive rule enforcement during development

### New Tools

| Tool | Purpose | Priority |
|------|---------|----------|
| `check_contrast` | WCAG contrast validation | HIGH |
| `get_storybook_patterns` | Story writing rules (AllStates, modal overlay) | HIGH |
| `get_component_workflow` | Step-by-step checklist for component creation | HIGH |
| `get_testing_patterns` | data-testid vs data-slot guidance | MEDIUM |
| `validate_import` | Check if import path is correct | MEDIUM |

### Data Sources to Add

```
.claude/contrast-matrix.json  → check_contrast
.claude/storybook-rules.md    → get_storybook_patterns
.claude/component-dev-rules.md → get_component_workflow
.claude/testing-quick-ref.md  → get_testing_patterns
```

**Outcome:** AI follows full development workflow, not just token validation.

---

## Phase 3: Consumer Integration 🔮 FUTURE

**Goal:** Help developers using DDS in their apps

### New Tools

| Tool | Purpose |
|------|---------|
| `suggest_component` | "I need a form" → suggests Input, Select, Button |
| `get_usage_example` | Code example for component usage |
| `check_composition` | Validate component composition patterns |
| `get_accessibility_rules` | A11y requirements for component |

### Use Cases

```
Developer: "I need to show an error message"
AI calls: suggest_component({need: "error message"})
Returns: ErrorState component with variants, usage example

Developer: "Is this Dialog usage correct?"
AI calls: check_composition({component: "Dialog", code: "..."})
Returns: Validation result with suggestions
```

**Outcome:** Consumer developers get guided toward correct DDS usage.

---

## Phase 4: Full Compliance Audit 🔮 FUTURE

**Goal:** Audit entire files/projects for DDS compliance

### New Tools

| Tool | Purpose |
|------|---------|
| `audit_file` | Scan file for all DDS violations |
| `audit_tokens` | Find all non-semantic tokens in codebase |
| `suggest_fixes` | Auto-fix suggestions for violations |
| `generate_story` | Scaffold compliant Storybook story |

### Use Cases

```
Developer: "Check this component for DDS compliance"
AI calls: audit_file({path: "src/components/MyCard.tsx"})
Returns: 
  - Line 15: bg-slate-100 → use bg-muted-bg
  - Line 23: missing data-testid
  - Line 30: shadow-md OK ✓
```

**Outcome:** AI can review and fix DDS violations automatically.

---

## Phase 5: Code Generation 🔮 FUTURE

**Goal:** Generate DDS-compliant code from descriptions

### New Tools

| Tool | Purpose |
|------|---------|
| `generate_component_scaffold` | Create new component with correct structure |
| `generate_variant` | Add variant to existing component |
| `generate_story_file` | Create complete story file |

**Outcome:** AI generates code that's DDS-compliant by default.

---

## Implementation Priority Matrix

| Phase | Effort | Impact | Priority |
|-------|--------|--------|----------|
| Phase 1 | ✅ Done | Foundation | - |
| Phase 2 | Medium | High | 🎯 NOW |
| Phase 3 | Medium | High | NEXT |
| Phase 4 | High | Very High | LATER |
| Phase 5 | High | Very High | LATER |

---

## Success Metrics

### Phase 1 (Current)
- [ ] MCP server starts without errors
- [ ] All 6 tools respond correctly
- [ ] Integrated into Claude Code

### Phase 2
- [ ] AI stops using raw hex codes
- [ ] AI follows Storybook patterns
- [ ] AI checks contrast before choosing colors

### Phase 3
- [ ] Consumer developers get correct component suggestions
- [ ] Usage examples are always DDS-compliant

### Phase 4
- [ ] Full file audit catches 95%+ of violations
- [ ] Auto-fix suggestions are accurate

### Phase 5
- [ ] Generated components pass all DDS rules
- [ ] Zero manual fixes needed for scaffolded code

---

## Design Principles

1. **Read-only first** - MCP reads from existing `.claude/` files
2. **No duplication** - Single source of truth in `.claude/`
3. **Incremental value** - Each phase delivers usable tools
4. **Wu Wei** - Build what's needed, not what might be needed

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| stdio transport | Simple, works with Claude Code |
| Read `.claude/` at runtime | Always up-to-date |
| Zod schemas | Type safety + auto-generated JSON Schema |
| Single index.ts | Simple to maintain at current scale |

### When to Split Files

Split into modules when:
- Total tools > 15
- Need to mock data sources for testing
- Multiple transports needed (HTTP, stdio)
